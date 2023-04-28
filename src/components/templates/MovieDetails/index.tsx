import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Cast, IMovieFull} from '@interfaces/index';
import {MovieCastCarrousel} from '@components/index';
import Icon from 'react-native-vector-icons/Ionicons';

interface IMovieDetailsProps {
  movieDetails: IMovieFull;
  cast: Cast[];
}

export const MovieDetails = ({movieDetails, cast}: IMovieDetailsProps) => (
  <View style={styles.movieDetailsContainer}>
    <View style={styles.genresBox}>
      <Icon name="star-outline" color="grey" size={16} />
      <Text style={styles.genresLabel}>
        {`${movieDetails.vote_average} - ${movieDetails.genres
          .map(g => g.name)
          .join(', ')}`}
      </Text>
    </View>
    <View style={styles.detailsBox}>
      <Text style={styles.subtitleLabel}>Historia</Text>
      <Text>{movieDetails.overview}</Text>
      <Text style={styles.subtitleLabel}>Presupuesto</Text>
      <Text>{movieDetails.budget}</Text>
    </View>
    <Text style={styles.subtitleLabel}>Actores</Text>
    <MovieCastCarrousel cast={cast} />
    <View style={styles.separator} />
  </View>
);

const styles = StyleSheet.create({
  movieDetailsContainer: {
    marginHorizontal: 20,
    marginTop: 4,
  },
  genresBox: {
    flexDirection: 'row',
  },
  genresLabel: {
    marginLeft: 8,
  },
  detailsBox: {
    flexDirection: 'column',
  },
  subtitleLabel: {
    fontSize: 20,
    marginTop: 10,
    fontWeight: 'bold',
  },
  separator: {
    height: 20,
  },
});
