// @flow
/**
 * Community query resolvers
 */
const {
  getCommunityMetaData,
  getAllCommunityThreads,
} = require('../models/community');
const { getChannelsByCommunity } = require('../models/channel');
import paginate from '../utils/paginate-arrays';
import type { PaginationOptions } from '../utils/paginate-arrays';
import type { GetCommunityArgs } from '../models/community';
import { encode, decode } from '../utils/base64';
import type { GraphQLContext } from '../';

module.exports = {
  Query: {
    community: (
      _: any,
      args: GetCommunityArgs,
      { loaders, user }: GraphQLContext
    ) => {
      if (args.id) return loaders.community.load(args.id);
      if (args.slug) return loaders.communityBySlug.load(args.slug);

      return null;
    },
  },
  Community: {
    channelConnection: ({ id }: { id: string }) => ({
      pageInfo: {
        hasNextPage: false,
      },
      edges: getChannelsByCommunity(id).then(channels =>
        channels.map(channel => ({
          node: channel,
        }))
      ),
    }),
    isOwner: ({ owners }, _, { user }) => {
      if (!user) return false;
      return owners.indexOf(user.uid) > -1;
    },
    isMember: ({ members }, _, { user }) => {
      if (!user) return false;
      return members.indexOf(user.uid) > -1;
    },
    memberConnection: (
      { members }: { members: Array<string> },
      { first = 10, after }: PaginationOptions,
      { loaders }: GraphQLContext
    ) => {
      const { list, hasMoreItems } = paginate(members, {
        first,
        after: decode(after),
      });
      return loaders.user.loadMany(list).then(users => ({
        pageInfo: {
          hasNextPage: hasMoreItems,
        },
        edges: users.map(user => ({
          cursor: encode(user.uid),
          node: user,
        })),
      }));
    },
    threadConnection: (
      { id }: { id: string },
      { first = 10, after }: PaginationOptions
    ) => {
      const cursor = decode(after);
      // TODO: Make this more performant by doing an actual db query rather than this hacking around
      return getAllCommunityThreads(id)
        .then(threads =>
          paginate(
            threads,
            { first, after: cursor },
            thread => thread.id === cursor
          )
        )
        .then(result => ({
          pageInfo: {
            hasNextPage: result.hasMoreItems,
          },
          edges: result.list.map(thread => ({
            cursor: encode(thread.id),
            node: thread,
          })),
        }));
    },
    metaData: ({ id }: { id: string }) => {
      return getCommunityMetaData(id).then(data => {
        return {
          channels: data[0],
          members: data[1],
        };
      });
    },
  },
};
