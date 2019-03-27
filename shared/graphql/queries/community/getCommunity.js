// @flow
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import communityInfoFragment from '../../fragments/community/communityInfo';
import type { CommunityInfoType } from '../../fragments/community/communityInfo';
import communityMetaDataFragment from '../../fragments/community/communityMetaData';
import type { CommunityMetaDataType } from '../../fragments/community/communityMetaData';

export type GetCommunityType = {
  ...$Exact<CommunityInfoType>,
  ...$Exact<CommunityMetaDataType>,
};

export const getCommunityByIdQuery = gql`
  query getCommunityById($id: ID) {
    community(id: $id) {
      ...communityInfo
      ...communityMetaData
    }
  }
  ${communityInfoFragment}
  ${communityMetaDataFragment}
`;

const getCommunityByIdOptions = {
  options: ({ id }) => ({
    variables: {
      id,
    },
  }),
};

export const getCommunityById = graphql(
  getCommunityByIdQuery,
  getCommunityByIdOptions
);

export const getCommunityBySlugQuery = gql`
  query getCommunityBySlug($slug: LowercaseString) {
    community(slug: $slug) {
      ...communityInfo
      ...communityMetaData
    }
  }
  ${communityInfoFragment}
  ${communityMetaDataFragment}
`;

const getCommunityBySlugOptions = {
  options: ({ slug }) => ({
    variables: {
      slug: slug,
    },
  }),
};

export const getCommunityBySlug = graphql(
  getCommunityBySlugQuery,
  getCommunityBySlugOptions
);

export const getCommunityByMatchQuery = gql`
  query getCommunityByMatch($slug: LowercaseString) {
    community(slug: $slug) {
      ...communityInfo
      ...communityMetaData
    }
  }
  ${communityInfoFragment}
  ${communityMetaDataFragment}
`;

const getCommunityByMatchOptions = {
  options: ({
    match: {
      params: { communitySlug },
    },
  }) => ({
    variables: {
      slug: communitySlug,
    },
    /*
      don't change this fetch policy
      its required to make the new community creation flow work
      after a user creates their community, they have a button to view
      the community or go to settings - if this does not follow a cache hit
      with a network request, the client will think the community does
      not exist
    */
    fetchPolicy: 'cache-and-network',
  }),
};

export const getCommunityByMatch = graphql(
  getCommunityByMatchQuery,
  getCommunityByMatchOptions
);
