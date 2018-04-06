// @flow
const debug = require('debug')('api:mutations:thread:publish-thread');
import stringSimilarity from 'string-similarity';
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { uploadImage } from '../../utils/s3';
import { getUserPermissionsInChannel } from '../../models/usersChannels';
import { getUserPermissionsInCommunity } from '../../models/usersCommunities';
import { getChannelById } from '../../models/channel';
import { getCommunityById } from '../../models/community';
import {
  publishThread,
  editThread,
  getThreadsByUserAsSpamCheck,
} from '../../models/thread';
import { createParticipantInThread } from '../../models/usersThreads';
import { StripeUtil } from 'shared/stripe/utils';
import type { FileUpload, DBThread } from 'shared/types';
import { PRIVATE_CHANNEL, FREE_PRIVATE_CHANNEL } from 'pluto/queues/constants';
import { toPlainText, toState } from 'shared/draft-utils';
import {
  processReputationEventQueue,
  sendThreadNotificationQueue,
  _adminProcessToxicThreadQueue,
} from 'shared/bull/queues';
import getSpectrumScore from 'athena/queues/moderationEvents/spectrum';
import getPerspectiveScore from 'athena/queues/moderationEvents/perspective';

const threadBodyToPlainText = (body: any): string =>
  toPlainText(toState(JSON.parse(body)));

type Attachment = {
  attachmentType: string,
  data: string,
};

type File = FileUpload;

type PublishThreadInput = {
  thread: {
    channelId: string,
    communityId: string,
    type: 'SLATE' | 'DRAFTJS',
    content: {
      title: string,
      body?: string,
    },
    attachments?: ?Array<Attachment>,
    filesToUpload?: ?Array<File>,
  },
};

export default async (
  _: any,
  { thread }: PublishThreadInput,
  { user, loaders }: GraphQLContext
) => {
  const currentUser = user;

  if (!currentUser) {
    return new UserError('You must be signed in to publish a new thread.');
  }

  if (thread.type === 'SLATE') {
    throw new UserError(
      "You're on an old version of Spectrum, please refresh your browser."
    );
  }

  const [
    currentUserChannelPermissions,
    currentUserCommunityPermissions,
    channel,
    community,
    usersPreviousPublishedThreads,
  ] = await Promise.all([
    getUserPermissionsInChannel(thread.channelId, currentUser.id),
    getUserPermissionsInCommunity(thread.communityId, currentUser.id),
    getChannelById(thread.channelId),
    getCommunityById(thread.communityId),
    getThreadsByUserAsSpamCheck(currentUser.id),
  ]);

  if (!community || community.deletedAt) {
    return new UserError('This community doesn’t exist');
  }

  // if channel wasn't found or is deleted
  if (!channel || channel.deletedAt) {
    return new UserError("This channel doesn't exist");
  }

  if (channel.isArchived) {
    return new UserError('This channel has been archived');
  }

  // if user isn't a channel member
  if (
    !currentUserChannelPermissions.isMember ||
    currentUserChannelPermissions.isBlocked ||
    currentUserCommunityPermissions.isBlocked
  ) {
    return new UserError(
      "You don't have permission to create threads in this channel."
    );
  }

  if (channel.isPrivate) {
    const { customer } = await StripeUtil.jobPreflight(community.id);

    if (!customer) {
      return new UserError(
        'We could not verify the billing status for this channel, please try again'
      );
    }

    const [hasPaidPrivateChannel, hasFreePrivateChannel] = await Promise.all([
      StripeUtil.hasSubscriptionItemOfType(customer, PRIVATE_CHANNEL),
      StripeUtil.hasSubscriptionItemOfType(customer, FREE_PRIVATE_CHANNEL),
    ]);

    if (!hasPaidPrivateChannel && !hasFreePrivateChannel) {
      return new UserError(
        'This private channel does not have an active subscription'
      );
    }
  }

  // if user has published other threads in the last hour, check for spam
  if (
    usersPreviousPublishedThreads &&
    usersPreviousPublishedThreads.length > 0
  ) {
    debug('User has posted more than one thread in the previous 30m');

    // dont allow user to post more than three times across all communities in a timeframe
    if (usersPreviousPublishedThreads.length > 3) {
      debug('User has posted more than 3 times in previous 30m');
      return new UserError(
        'You’ve been posting a lot recently - please wait a while before posting more.'
      );
    }

    // dont allow user to post in same community more than 3 times in a timeframe
    const threadsPublishedInSameCommunity = usersPreviousPublishedThreads.filter(
      t => t && t.communityId === thread.communityId
    );
    if (threadsPublishedInSameCommunity.length >= 3) {
      debug(
        'User has posted at least 3 times in the same community in previous 30m'
      );
      return new UserError(
        'You’ve been posting a lot in this community - please wait a while before posting more.'
      );
    }

    const checkForSpam = usersPreviousPublishedThreads.map(t => {
      if (!t) return false;

      const incomingTitle = thread.content.title;
      const thisTitle = t.content.title;
      const titleSimilarity = stringSimilarity.compareTwoStrings(
        incomingTitle,
        thisTitle
      );
      debug(`Title similarity score for spam check: ${titleSimilarity}`);
      if (titleSimilarity > 0.8) return true;

      if (thread.content.body) {
        const incomingBody = threadBodyToPlainText(thread.content.body);
        const thisBody = threadBodyToPlainText(t.content.body);
        const bodySimilarity = stringSimilarity.compareTwoStrings(
          incomingBody,
          thisBody
        );
        debug(`Body similarity score for spam check: ${bodySimilarity}`);
        if (bodySimilarity > 0.8) return true;
      }

      return false;
    });

    const isSpamming = checkForSpam.filter(Boolean).length > 0;
    if (isSpamming) {
      debug('User is spamming similar content');
      return new UserError(
        'It looks like you’ve been posting about a similar topic recently - please wait a while before posting more.'
      );
    }
  }

  /*
  If the thread has attachments, we have to iterate through each attachment and JSON.parse() the data payload. This is because we want a generic data shape in the graphQL layer like this:

  {
    attachmentType: enum String
    data: String
  }

  But when we get the data onto the client we JSON.parse the `data` field so that we can have any generic shape for attachments in the future.
*/

  let threadObject = Object.assign(
    {},
    {
      ...thread,
      content: {
        ...thread.content,
        title: thread.content.title.trim(),
      },
    }
  );
  // if the thread has attachments
  if (thread.attachments) {
    // iterate through them and construct a new attachment object
    const attachments = thread.attachments.map(attachment => {
      return {
        attachmentType: attachment.attachmentType,
        data: JSON.parse(attachment.data),
      };
    });

    // create a new thread object, overriding the attachments field with our new array
    threadObject = Object.assign({}, threadObject, {
      attachments,
    });
  }

  // $FlowFixMe
  const dbThread: DBThread = await publishThread(threadObject, currentUser.id);

  // we check for toxicity here only to determine whether or not to send
  // email notifications - the thread will be published regardless, but we can
  // prevent some abuse and spam if we ensure people dont get email notifications
  // with titles like "fuck you"
  const threadIsToxic = async () => {
    const body = thread.content.body
      ? threadBodyToPlainText(thread.content.body)
      : '';
    const title = thread.content.title;
    const text = `${title} ${body}`;

    const scores = await Promise.all([
      getSpectrumScore(text, dbThread.id, dbThread.creatorId),
      getPerspectiveScore(text),
    ]).catch(err =>
      console.error(
        'Error getting thread moderation scores from providers',
        err.message
      )
    );

    const spectrumScore = scores && scores[0];
    const perspectiveScore = scores && scores[1];

    // if neither models returned results
    if (!spectrumScore && !perspectiveScore) return false;

    // if both services agree that the thread is >= 98% toxic
    if ((spectrumScore + perspectiveScore) / 2 >= 0.98) {
      return true;
    }

    return false;
  };

  if (threadIsToxic) {
    debug(
      'Thread determined to be toxic, not sending notifications or adding rep'
    );
    // generate an alert for admins
    _adminProcessToxicThreadQueue.add({ thread: dbThread });
  } else {
    debug('Thread is not toxic, send notifications and add rep');
    // thread is clean, send notifications and process reputation
    sendThreadNotificationQueue.add({ thread: dbThread });
    processReputationEventQueue.add({
      userId: currentUser.id,
      type: 'thread created',
      entityId: dbThread.id,
    });
  }

  // create a relationship between the thread and the author
  await createParticipantInThread(dbThread.id, currentUser.id);

  if (!thread.filesToUpload || thread.filesToUpload.length === 0) {
    return dbThread;
  }

  // if the original mutation input contained files to upload
  const urls = await Promise.all(
    // upload each of the files to s3
    thread.filesToUpload.map(
      file => file && uploadImage(file, 'threads', dbThread.id)
    )
  );

  // Replace the local image srcs with the remote image src
  const body = dbThread.content.body && JSON.parse(dbThread.content.body);

  // $FlowFixMe
  const imageKeys = Object.keys(body.entityMap).filter(
    key => body.entityMap[key].type === 'image'
  );
  urls.forEach((url, index) => {
    // $FlowFixMe
    if (!body.entityMap[imageKeys[index]]) return;
    body.entityMap[imageKeys[index]].data.src = url;
  });

  // Update the thread with the new links
  return editThread(
    {
      threadId: dbThread.id,
      content: {
        ...dbThread.content,
        body: JSON.stringify(body),
      },
    },
    false
  );
};
