import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {StackNavigation} from 'navigation';
import {GradientProvider} from 'context/index';

const AppState = ({children}: {children: JSX.Element | JSX.Element[]}) => (
  <GradientProvider>{children}</GradientProvider>
);

const App = () => {
  return (
    <NavigationContainer>
      <AppState>
        <StackNavigation />
      </AppState>
    </NavigationContainer>
  );
};

export default App;
