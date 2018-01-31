// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withApollo } from 'react-apollo';
import { Loading } from '../../../components/loading';
import MembersList from './communityMembersList';
import { Button } from '../../../components/buttons';
import {
  SectionCard,
  SectionTitle,
} from '../../../components/settingsViews/style';
import Icon from '../../../components/icons';
import {
  Filters,
  Filter,
  SearchFilter,
  SearchInput,
  SearchForm,
} from '../style';
import type { GetUserType } from 'shared/graphql/queries/user/getUser';
import { throttle } from '../../../helpers/utils';
import { searchCommunityMembersQuery } from 'shared/graphql/queries/search/searchCommunityMembers';
import { ListContainer } from '../../../components/listItems/style';
import { initNewThreadWithUser } from '../../../actions/directMessageThreads';
import ViewError from '../../../components/viewError';
import GranularUserProfile from '../../../components/granularUserProfile';

type Props = {
  id: string,
  client: Object,
  currentUser: Object,
  dispatch: Function,
  history: Object,
};

type Node = {
  ...$Exact<GetUserType>,
  contextPermissions: {
    isMember: boolean,
    isOwner: boolean,
    isModerator: boolean,
    isBlocked: boolean,
    reputation: number,
  },
};

type State = {
  filter: ?{
    isMember?: boolean,
    isModerator?: boolean,
    isBlocked?: boolean,
  },
  totalCount: ?number,
  searchIsFocused: boolean,
  searchIsLoading: boolean,
  searchResults: Array<?Node>,
  searchString: string,
};

class CommunityMembers extends React.Component<Props, State> {
  initialState = {
    filter: { isMember: true },
    totalCount: null,
    searchIsFocused: false,
    searchResults: [],
    searchIsLoading: false,
    searchString: '',
  };

  state = this.initialState;

  constructor() {
    super();
    // only kick off search query every 200ms
    this.search = throttle(this.search, 200);
  }

  reset = () =>
    this.setState({
      filter: this.initialState.filter,
      searchIsFocused: false,
    });

  viewModerators = () =>
    this.setState({
      filter: {
        isModerator: true,
      },
      searchIsFocused: false,
    });

  viewBlocked = () =>
    this.setState({
      filter: {
        isBlocked: true,
      },
      searchIsFocused: false,
    });

  setTotalCount = (totalCount: number) => this.setState({ totalCount });

  handleChange = (e: any) => {
    const searchString = e.target && e.target.value;
    // if the user has cleared the search input, make sure there are no search
    // results or focused users
    if (!searchString || searchString.length === 0) {
      return this.setState({
        searchResults: [],
        searchIsLoading: false,
      });
    }

    this.setState({
      searchString: searchString,
    });

    // $FlowIssue
    return this.search();
  };

  search = () => {
    const { searchString: queryString } = this.state;
    const { client, id: communityId } = this.props;

    if (!queryString || queryString.length === 0) {
      return this.setState({ searchResults: [], searchIsLoading: false });
    }

    // start the input loading spinner
    if (this.state.searchResults.length === 0) {
      this.setState({ searchIsLoading: true });
    }

    // trigger the query
    client
      .query({
        query: searchCommunityMembersQuery,
        variables: {
          queryString,
          type: 'USERS',
          filter: { communityId },
        },
      })
      .then(({ data: { search } }) => {
        if (
          !search ||
          !search.searchResultsConnection ||
          search.searchResultsConnection.edges.length === 0
        ) {
          this.setState({
            searchResults: [],
            searchIsLoading: false,
          });
        }

        return this.setState({
          searchResults: search.searchResultsConnection.edges.map(
            e => e && e.node
          ),
          searchIsLoading: false,
        });
      })
      .catch(err => {
        console.log('Error searching users', err);
      });
  };

  initSearch = () => this.setState({ filter: null, searchIsFocused: true });

  initMessage = user => {
    this.props.dispatch(initNewThreadWithUser(user));
    this.props.history.push('/messages/new');
  };

  renderSearchResults = () => {
    const { searchResults, searchString } = this.state;
    const { currentUser } = this.props;

    if (searchResults.length === 0) {
      const emoji = ' ';

      const heading =
        searchString.length > 1
          ? `We couldn't find anyone matching "${searchString}"`
          : 'Search for people in your community';

      const subheading =
        searchString.length > 1
          ? 'Grow your community by inviting people via email, or by importing a Slack team'
          : 'Find people by name, username, and profile description - try searching for "designer" or "developer"';

      return (
        <ViewError emoji={emoji} heading={heading} subheading={subheading} />
      );
    }

    return (
      <ListContainer>
        {searchResults &&
          searchResults.map(user => {
            if (!user) return null;

            const roles = Object.keys(user.contextPermissions)
              .filter(r => r !== 'reputation')
              .filter(r => r !== 'isMember')
              .filter(r => r !== '__typename')
              .filter(r => user && user.contextPermissions[r])
              .map(r => {
                switch (r) {
                  case 'isOwner':
                    return 'Admin';
                  case 'isBlocked':
                    return 'Blocked';
                  case 'isModerator':
                    return 'Moderator';
                }
              });

            if (user.isPro) {
              roles.push('pro');
            }

            const reputation =
              (user.contextPermissions &&
                user.contextPermissions.reputation &&
                user.contextPermissions.reputation.toString()) ||
              '0';

            return (
              <GranularUserProfile
                key={user.id}
                id={user.id}
                name={user.name}
                username={user.username}
                description={user.description}
                isCurrentUser={user.id === currentUser.id}
                isOnline={user.isOnline}
                onlineSize={'small'}
                reputation={reputation}
                profilePhoto={user.profilePhoto}
                avatarSize={'40'}
                badges={roles}
              >
                <Button>Edit user</Button>
                <Button>Message user</Button>
              </GranularUserProfile>
            );
          })}
      </ListContainer>
    );
  };

  render() {
    const {
      filter,
      totalCount,
      searchIsFocused,
      searchIsLoading,
      searchResults,
    } = this.state;
    const { id } = this.props;

    return (
      <SectionCard>
        <SectionTitle>
          Community Members {totalCount && ` · ${totalCount}`}
        </SectionTitle>

        <Filters>
          <Filter
            onClick={this.reset}
            active={filter && filter.isMember ? true : false}
          >
            All
          </Filter>
          <Filter
            onClick={this.viewModerators}
            active={filter && filter.isModerator ? true : false}
          >
            Moderators
          </Filter>
          <Filter
            onClick={this.viewBlocked}
            active={filter && filter.isBlocked ? true : false}
          >
            Blocked
          </Filter>

          <SearchFilter onClick={this.initSearch}>
            <SearchForm onSubmit={e => e.preventDefault()}>
              <Icon glyph={'search'} size={28} />
              <SearchInput
                onChange={this.handleChange}
                type={'text'}
                placeholder={'Search'}
              />
            </SearchForm>
          </SearchFilter>
        </Filters>

        {searchIsFocused ? (
          searchIsLoading ? (
            searchResults.length === 0 && <Loading />
          ) : (
            this.renderSearchResults()
          )
        ) : (
          <MembersList
            filter={filter}
            id={id}
            setTotalCount={this.setTotalCount}
          />
        )}

        {filter &&
          filter.isModerator && (
            <ViewError
              emoji={' '}
              heading={'Moderator roles are coming soon!'}
              subheading={
                'Check back here later to manage moderation roles within your community'
              }
            />
          )}

        {filter &&
          filter.isBlocked && (
            <ViewError
              emoji={' '}
              heading={'User permissions are coming soon!'}
              subheading={
                'Check back later to easily manage roles and permissions for members in your community'
              }
            />
          )}
      </SectionCard>
    );
  }
}

const map = state => ({ currentUser: state.users.currentUser });

export default compose(
  // $FlowIssue
  connect(map),
  withApollo
)(CommunityMembers);
