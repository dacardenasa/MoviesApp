import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {Cast} from '@interfaces/index';
import {MovieCastCard} from '@components/index';

export const MovieCastCarrousel = ({cast}: {cast: Cast[]}) => {
  return (
    <FlatList
      data={cast}
      renderItem={({item}) => (
        <View style={styles.movieBox}>
          <MovieCastCard cast={item} />
        </View>
      )}
      keyExtractor={item => item.id.toString()}
      horizontal
      showsHorizontalScrollIndicator={false}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
};

const styles = StyleSheet.create({
  movieBox: {
    paddingVertical: 10,
  },
  separator: {
    width: 50,
  },
});
