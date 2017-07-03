//@flow
import React, { Component } from 'react';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
import { getEverythingThreads, getCurrentUserProfile } from './queries';
import Titlebar from '../../views/titlebar';
import { UpsellSignIn, UpsellToReload } from '../../components/upsell';
import UpsellNewUser from '../../components/upsell/newUserUpsell';
import { displayLoadingScreen } from '../../components/loading';
import { FlexCol } from '../../components/globals';
import { withInfiniteScroll } from '../../components/infiniteScroll';
import { Column } from '../../components/column';
import { UserProfile } from '../../components/profile';
import ThreadFeed from '../../components/threadFeed';
import ThreadComposer from '../../components/threadComposer';
import AppViewWrapper from '../../components/appViewWrapper';
import Head from '../../components/head';
import CommunityList from '../user/components/communityList';
import generateMetaInfo from 'shared/generate-meta-info';

const EverythingThreadFeed = compose(getEverythingThreads)(ThreadFeed);

class DashboardPure extends Component {
  state: {
    isNewUser: boolean,
  };

  constructor(props) {
    super(props);

    const user = this.props.data.user;
    const communities =
      this.props.data.user && this.props.data.user.communityConnection.edges;
    const isNewUser =
      (user && communities.length <= 0) || (user && !user.username);

    this.state = {
      isNewUser,
    };
  }

  graduate = () => {
    this.setState({
      isNewUser: false,
    });
  };

  render() {
    const { data: { user, error } } = this.props;
    const { isNewUser } = this.state;
    const isMobile = window.innerWidth < 768;

    const { title, description } = generateMetaInfo();

    if (error) {
      return (
        <FlexCol style={{ flex: 'auto' }}>
          <Head title={title} description={description} />
          <Titlebar noComposer />
          <AppViewWrapper>
            <Column type="primary" alignItems="center">
              <UpsellToReload />
            </Column>
          </AppViewWrapper>
        </FlexCol>
      );
    } else if (user && user !== null) {
      const currentUser = user;
      const communities = user.communityConnection.edges;

      return (
        <FlexCol style={{ flex: 'auto' }}>
          <Head title={title} description={description} />
          <Titlebar />
          <AppViewWrapper>

            {!isNewUser &&
              !isMobile &&
              <Column type="secondary">
                <UserProfile profileSize="mini" data={{ user: user }} />
                {!isNewUser &&
                  <CommunityList
                    withDescription={false}
                    currentUser={currentUser}
                    user={user}
                    communities={communities}
                  />}
              </Column>}

            <Column type="primary">
              {!isNewUser &&
                <span>
                  <ThreadComposer />
                  <EverythingThreadFeed viewContext="dashboard" />
                </span>}

              {isNewUser &&
                <UpsellNewUser user={user} graduate={this.graduate} />}
            </Column>
          </AppViewWrapper>
        </FlexCol>
      );
    } else {
      return (
        <FlexCol style={{ flex: 'auto' }}>
          <Head title={title} description={description} />
          <Titlebar noComposer />
          <AppViewWrapper>
            <Column type="primary" alignItems="center">
              <UpsellSignIn />
            </Column>
          </AppViewWrapper>
        </FlexCol>
      );
    }
  }
}

const Dashboard = compose(
  getCurrentUserProfile,
  displayLoadingScreen,
  withInfiniteScroll,
  pure
)(DashboardPure);
export default Dashboard;
