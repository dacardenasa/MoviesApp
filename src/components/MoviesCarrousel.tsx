import React from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {MoviePoster} from '@components/index';
import {MoviesCarrouselProps} from '@interfaces/index';

export const MoviesCarrousel = ({movies, title}: MoviesCarrouselProps) => {
  return (
    <View style={title ? styles.container : styles.withoutTitleContainer}>
      {title && <Text style={styles.title}>{title}</Text>}
      <FlatList
        data={movies}
        renderItem={({item}) => (
          <MoviePoster movie={item} width={140} height={200} />
        )}
        keyExtractor={item => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 260,
  },
  withoutTitleContainer: {
    height: 220,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
