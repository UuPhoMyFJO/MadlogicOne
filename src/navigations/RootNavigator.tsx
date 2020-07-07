import React, {useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {RootStackParamsList} from './types';
import NavigatorMap from './NavigatorMap';
import AuthStack from './AuthStackNavigator';
import AppStack from './AppStackNavigator';

const Stack = createStackNavigator<RootStackParamsList>();

export default function RootNavigator() {
  const [isAuthorized] = useState(false);

  return (
    <Stack.Navigator>
      {isAuthorized ? (
        <Stack.Screen name={NavigatorMap.AppStack} component={AppStack} />
      ) : (
        <Stack.Screen
          name={NavigatorMap.AuthStack}
          component={AuthStack}
          options={{header: () => null}}
        />
      )}
    </Stack.Navigator>
  );
}