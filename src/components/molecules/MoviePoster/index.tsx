import React from 'react';
import { Image, StyleSheet, View, TouchableOpacity } from 'react-native';
import { IDetailScreenProps, MoviePosterProps } from '@interfaces/index';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

export const MoviePoster = ({
  movie,
  width = 300,
  height = 420,
}: MoviePosterProps) => {
  const navigation = useNavigation<IDetailScreenProps['navigation']>();
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('DetailScreen', { movie })}
      activeOpacity={0.8}
      style={{ ...styles.container, width, height }}>
      <View style={styles.imageContainer}>
        {movie.poster_path ? (
          <Image source={{ uri: movie.poster_path }} style={styles.image} />
        ) : (
          <View style={styles.fallbackContainer}>
            <Icon name="image-outline" color="grey" size={60} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 300,
    height: 420,
    marginHorizontal: 2,
    paddingBottom: 20,
    paddingHorizontal: 7,
  },
  image: {
    flex: 1,
    borderRadius: 18,
  },
  imageContainer: {
    flex: 1,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
  },
  fallbackContainer: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
