import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {DetailScreen, HomeScreen} from '@screens/index';
import {RootStackParams} from '@interfaces/index';

const Stack = createStackNavigator<RootStackParams>();

export const StackNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: {
          backgroundColor: 'white',
        },
      }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="DetailScreen" component={DetailScreen} />
    </Stack.Navigator>
  );
};
