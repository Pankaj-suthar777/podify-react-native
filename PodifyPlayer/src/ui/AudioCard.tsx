import colors from '@utils/colors';
import {FC} from 'react';
import {
  StyleSheet,
  Pressable,
  Image,
  Text,
  StyleProp,
  ViewStyle,
} from 'react-native';
import PlayAnimation from './PlayAnimation';

interface Props {
  title: string;
  poster?: string;
  onPress?(): void;
  onLongPress?(): void;
  playing?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

const AudioCard: FC<Props> = ({
  title,
  poster,
  onLongPress,
  onPress,
  playing = false,
  containerStyle,
}) => {
  const source = poster ? {uri: poster} : require('../assets/music.png');
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={[styles.container, containerStyle]}>
      <Image source={source} style={styles.poster} />
      <PlayAnimation visible={playing} />
      <Text numberOfLines={2} ellipsizeMode="tail" style={styles.title}>
        {title}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {width: 100, marginRight: 15},
  poster: {height: 100, aspectRatio: 1, borderRadius: 7},
  title: {
    color: colors.CONTRAST,
    fontWeight: '500',
    fontSize: 16,
    marginTop: 5,
  },
});

export default AudioCard;
