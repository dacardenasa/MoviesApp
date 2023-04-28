import {Movie} from './movies';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

export type RootStackParams = {
  HomeScreen: undefined;
  DetailScreen: {movie: Movie};
};

export type IDetailScreenProps = NativeStackScreenProps<
  RootStackParams,
  'DetailScreen'
>;
