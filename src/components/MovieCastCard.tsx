import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {Cast} from 'interfaces';
import Icon from 'react-native-vector-icons/Ionicons';

export const MovieCastCard = ({cast}: {cast: Cast}) => {
  return (
    <View style={styles.castCardBox}>
      {cast.profile_path ? (
        <Image source={{uri: cast.profile_path}} style={styles.castCardImage} />
      ) : (
        <Icon name="image-outline" color="grey" size={50} />
      )}
      <View style={styles.castCardInfo}>
        <Text style={styles.castCardName}>{cast.name}</Text>
        <Text>
          as{' '}
          {cast.character.length > 20
            ? cast.character.slice(0, 19).concat('...')
            : cast.character}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  castCardBox: {
    borderRadius: 8,
    flexDirection: 'row',
    width: 250,
    height: 60,
    justifyContent: 'flex-start',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  castCardImage: {
    width: 60,
    borderRadius: 8,
  },
  castCardInfo: {
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  castCardName: {
    fontWeight: 'bold',
  },
});
