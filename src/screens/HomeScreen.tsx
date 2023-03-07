import React, {useContext} from 'react';
import {
  ActivityIndicator,
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {GradientWrapper, MoviePoster, MoviesCarrousel} from '@components/index';
import {useMovies} from '@hooks/index';

import Carousel from 'react-native-snap-carousel';
import {getColorsMediaFile} from 'helpers';
import {GradientContext} from 'context/index';
import {useEffect} from 'react';

const {width: windowWidth} = Dimensions.get('window');

export const HomeScreen = () => {
  const {nowPlaying, popular, topRated, upcoming, isLoading} = useMovies();
  const {top} = useSafeAreaInsets();
  const {handleBgMainColors, previousColors} = useContext(GradientContext);

  const getPosterColors = async (index: number) => {
    const uri = nowPlaying[index].poster_path;
    const [primaryColor, secondaryColor] = await getColorsMediaFile(uri);
    handleBgMainColors({primary: primaryColor, secondary: secondaryColor});
  };

  useEffect(
    () => {
      if (nowPlaying.length > 0 && previousColors.primary === 'transparent') {
        getPosterColors(0);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [nowPlaying],
  );

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color="red" size={100} />
      </View>
    );
  }

  return (
    <SafeAreaView>
      <GradientWrapper>
        <ScrollView>
          <View
            style={{
              marginTop: Platform.OS === 'android' ? top + 20 : top - 20,
            }}>
            {/* Main Carrousel */}
            <View style={styles.carouselContainer}>
              <Carousel
                data={nowPlaying}
                renderItem={({item}) => <MoviePoster movie={item} />}
                sliderWidth={windowWidth}
                itemWidth={300}
                inactiveSlideOpacity={0.9}
                loop
                loopClonesPerSide={9}
                onSnapToItem={index => getPosterColors(index)}
              />
            </View>
            {/* FlatList Carrousel */}
            <MoviesCarrousel title={'Popular'} movies={popular} />
            <MoviesCarrousel title={'Top Rated'} movies={topRated} />
            <MoviesCarrousel title={'Upcoming'} movies={upcoming} />
          </View>
        </ScrollView>
      </GradientWrapper>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselContainer: {
    height: 440,
  },
});
