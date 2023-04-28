import React, {useContext, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {IGradienteWrapper} from '@interfaces/index';
import LinearGradient from 'react-native-linear-gradient';
import {GradientContext} from 'context/index';
import {Animated} from 'react-native';
import {useFadeAnimation} from 'hooks';

export const GradientWrapper = ({children}: IGradienteWrapper) => {
  const {mainColors, previousColors, handleBgPreviousColors} =
    useContext(GradientContext);
  const {opacity, fadeIn, fadeOut} = useFadeAnimation();

  useEffect(() => {
    fadeIn(() => {
      handleBgPreviousColors(mainColors);
      fadeOut();
    });
  }, [fadeIn, fadeOut, handleBgPreviousColors, mainColors]);

  return (
    <View>
      <LinearGradient
        colors={[previousColors.primary, previousColors.secondary, 'white']}
        style={{...StyleSheet.absoluteFillObject}}
        start={{x: 0.1, y: 0.1}}
        end={{x: 0.5, y: 0.5}}
      />
      <Animated.View style={{...StyleSheet.absoluteFillObject, opacity}}>
        <LinearGradient
          colors={[mainColors.primary, mainColors.secondary, 'white']}
          style={{...StyleSheet.absoluteFillObject}}
          start={{x: 0.1, y: 0.1}}
          end={{x: 0.5, y: 0.5}}
        />
      </Animated.View>
      {children}
    </View>
  );
};
