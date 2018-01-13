// @flow
import * as React from 'react';
import { Text, View } from 'react-native';
import compose from 'recompose/compose';
import getCommunityById from '../../gql/community/queries/getCommunity';
import ViewNetworkHandler from '../../components/viewNetworkHandler';

import { Wrapper } from './style';

type Props = {
  isLoading: boolean,
  hasError: boolean,
  data: {
    community?: {
      name: string,
    },
  },
};
class Splash extends React.Component<Props> {
  render() {
    const { data, isLoading, hasError, foo } = this.props;
    if (data.community) {
      return (
        <Wrapper>
          <View testID="welcome">
            <Text>Now viewing {data.community.name}</Text>
          </View>
        </Wrapper>
      );
    }

    if (isLoading) {
      return (
        <Wrapper>
          <View testID="welcome">
            <Text>Loading...</Text>
          </View>
        </Wrapper>
      );
    }

    if (hasError) {
      return (
        <Wrapper>
          <View testID="welcome">
            <Text>Error!</Text>
          </View>
        </Wrapper>
      );
    }

    return null;
  }
}

export default compose(getCommunityById, ViewNetworkHandler)(Splash);
