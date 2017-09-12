// @flow
// $FlowFixMe
import { graphql, gql } from 'react-apollo';
import { userInfoFragment } from '../../api/fragments/user/userInfo';
import { userSettingsFragment } from '../../api/fragments/user/userSettings';

export const GET_USER_PROFILE_QUERY = gql`
  query getUserSettings($username: String) {
    user(username: $username) {
      ...userInfo
      email
      ...userSettings
    }
  }
  ${userInfoFragment}
  ${userSettingsFragment}
`;

export const GET_USER_PROFILE_OPTIONS = {
  options: ({ match }) => ({
    variables: {
      username: match.params.username,
    },
    fetchPolicy: 'network-only',
  }),
};

export const GetUserProfile = graphql(
  GET_USER_PROFILE_QUERY,
  GET_USER_PROFILE_OPTIONS
);
