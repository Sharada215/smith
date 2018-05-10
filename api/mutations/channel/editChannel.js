// @flow
import type { GraphQLContext } from '../../';
import type { EditChannelInput } from '../../models/channel';
import UserError from '../../utils/UserError';
import { approvePendingUsersInChannel } from '../../models/usersChannels';
import { editChannel } from '../../models/channel';
import {
  isAuthedResolver as requireAuth,
  canModerateChannel,
} from '../../utils/permissions';
import { events } from 'shared/analytics';
import { trackQueue } from 'shared/bull/queues';

export default requireAuth(
  async (_: any, args: EditChannelInput, { user, loaders }: GraphQLContext) => {
    const channel = await loaders.channel.load(args.input.channelId);

    if (!await canModerateChannel(user.id, args.input.channelId, loaders)) {
      trackQueue.add({
        userId: user.id,
        event: events.CHANNEL_EDITED_FAILED,
        context: { channelId: args.input.channelId },
        properties: {
          reason: 'no permission',
        },
      });

      return new UserError('You don’t have permission to manage this channel');
    }

    if (channel.isPrivate && !args.input.isPrivate) {
      approvePendingUsersInChannel(args.input.channelId);
    }

    trackQueue.add({
      userId: user.id,
      event: events.CHANNEL_EDITED,
      context: { channelId: args.input.channelId },
    });

    return editChannel(args);
  }
);
