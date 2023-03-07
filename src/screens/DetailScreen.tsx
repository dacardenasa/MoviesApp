import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {IDetailScreenProps} from '@interfaces/index';
import {useMovieDetails} from '@hooks/index';
import {MovieDetails} from '@components/index';
import {SafeAreaView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const screenHeight = Dimensions.get('screen').height;

export const DetailScreen = ({route}: IDetailScreenProps) => {
  const navigation = useNavigation<IDetailScreenProps['navigation']>();
  const movie = route.params;
  const {isLoading, movieDetails, cast} = useMovieDetails({movieId: movie.id});
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.imageContainer}>
          <View style={styles.imageBorder}>
            <Image
              source={{uri: movie?.poster_path}}
              style={styles.posterImage}
            />
          </View>
        </View>
        <View style={styles.movieNameContainer}>
          <Text style={styles.subtitle}>{movie.original_title}</Text>
          <Text style={styles.title}>{movie.title}</Text>
        </View>
        {isLoading ? (
          <ActivityIndicator size={35} color="gray" />
        ) : (
          <MovieDetails movieDetails={movieDetails!} cast={cast} />
        )}
        <TouchableOpacity
          activeOpacity={1}
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon color={'white'} name={'arrow-back-outline'} size={60} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: '100%',
    height: screenHeight * 0.7,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 9,
    borderBottomEndRadius: 25,
    borderBottomStartRadius: 25,
  },
  imageBorder: {
    flex: 1,
    overflow: 'hidden',
    borderBottomEndRadius: 25,
    borderBottomStartRadius: 25,
  },
  posterImage: {
    flex: 1,
  },
  movieNameContainer: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
    color: '#000000',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
});
