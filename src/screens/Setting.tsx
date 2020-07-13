import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {Switch, Text, Colors, useTheme} from 'react-native-paper';
import noop from 'lodash/noop';
import Slider from '@react-native-community/slider';
import {observer} from 'mobx-react-lite';
import {useIntl} from 'react-intl';
import Animated, {
  Value,
  timing,
  Easing,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

import {useGlobalStyles} from '../core/hooks/useGlobalStyle';

const styles = StyleSheet.create({
  item: {
    marginVertical: 8,
    padding: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switch: {
    marginRight: 16,
  },
  slider: {
    width: '100%',
    marginTop: 8,
  },
  storageTxt: {
    textAlign: 'center',
  },
});

const SLIDER_HEIGHT = 60;

const AnimatedSlider = Animated.createAnimatedComponent(Slider);

const Setting = () => {
  const theme = useTheme();
  const {formatMessage} = useIntl();
  const [globalStyles] = useGlobalStyles(theme);
  const [isSwitchStorageOn, setIsSwitchStorageOn] = React.useState(false);

  const height = new Value(isSwitchStorageOn ? 0 : SLIDER_HEIGHT);

  const anim = timing(height, {
    duration: 200,
    toValue: isSwitchStorageOn ? SLIDER_HEIGHT : 0,
    easing: Easing.inOut(Easing.linear),
  });

  const toggleSwitch = () => setIsSwitchStorageOn((prev) => !prev);
  const opacity = interpolate(height, {
    inputRange: [0, SLIDER_HEIGHT],
    outputRange: [0, 1],
    extrapolate: Extrapolate.CLAMP,
  });

  useEffect(() => {
    anim.start();
  }, [isSwitchStorageOn, anim]);
  return (
    <View style={globalStyles.container}>
      <View style={[styles.item, globalStyles.shadowBox]}>
        <View style={styles.itemContainer}>
          <Switch
            value={false}
            onValueChange={noop}
            style={styles.switch}
            color={Colors.blue500}
          />
          <Text>{formatMessage({id: 'setting.sync.wifi'})}</Text>
        </View>
      </View>
      <View style={[styles.item, globalStyles.shadowBox]}>
        <Animated.View style={styles.itemContainer}>
          <Switch
            value={isSwitchStorageOn}
            onValueChange={toggleSwitch}
            style={[styles.switch]}
            color={Colors.blue500}
          />
          <Text>{formatMessage({id: 'setting.max.storage'})}</Text>
        </Animated.View>
        <Animated.View style={{height, justifyContent: 'center'}}>
          <AnimatedSlider
            style={[styles.slider, {opacity}]}
            minimumTrackTintColor={Colors.blue500}
            thumbTintColor={Colors.blue500}
            onValueChange={console.log}
          />
          <Animated.Text style={[styles.storageTxt, {opacity}]}>
            100MB
          </Animated.Text>
        </Animated.View>
      </View>
    </View>
  );
};

export default observer(Setting);
