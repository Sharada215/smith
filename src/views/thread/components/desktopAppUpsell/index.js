// @flow
import React from 'react';
import compose from 'recompose/compose';
import { withCurrentUser } from 'src/components/withCurrentUser';
import { track, events } from 'src/helpers/analytics';
import {
  hasDismissedDesktopAppUpsell,
  dismissDesktopAppUpsell,
  isDesktopApp,
  DESKTOP_APP_MAC_URL,
} from 'src/helpers/desktop-app-utils';
import { isMac } from 'src/helpers/is-os';
import { PrimaryButton } from 'src/views/community/components/button';
import { SidebarSection } from 'src/views/community/style';
import { Container, AppIcon, Content, Title, Subtitle } from './style';

type Props = {
  currentUser: ?Object,
};

type State = {
  isVisible: boolean,
};

class DesktopAppUpsell extends React.Component<Props, State> {
  constructor() {
    super();

    this.state = {
      isVisible: false,
    };
  }

  componentDidMount() {
    const desktopUpsellVisible =
      isMac() && !isDesktopApp() && !hasDismissedDesktopAppUpsell();

    if (desktopUpsellVisible) {
      this.setState({ isVisible: true });
      track(events.THREAD_VIEW_DOWNLOAD_MAC_VIEWED);
    }
  }

  download = () => {
    track(events.THREAD_VIEW_DOWNLOAD_MAC_CLICKED);
    dismissDesktopAppUpsell();
    return this.setState({ isVisible: false });
  };

  render() {
    const { currentUser } = this.props;
    const { isVisible } = this.state;

    if (!isVisible || !currentUser) return null;

    return (
      <SidebarSection>
        <Container>
          <AppIcon src={'/img/homescreen-icon-72x72.png'} />

          <Content>
            <Title>Download Spectrum for Mac</Title>
            <Subtitle>A better way to keep up with your communities.</Subtitle>

            <a href={DESKTOP_APP_MAC_URL} onClick={this.download}>
              <PrimaryButton>Download</PrimaryButton>
            </a>
          </Content>
        </Container>
      </SidebarSection>
    );
  }
}

export default compose(withCurrentUser)(DesktopAppUpsell);
