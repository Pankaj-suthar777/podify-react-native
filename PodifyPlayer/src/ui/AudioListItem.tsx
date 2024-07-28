import colors from '../utils/colors';
import React, {FC} from 'react';
import {View, StyleSheet, Pressable, Image, Text} from 'react-native';
import {AudioData} from '../types/audio';
import PlayAnimation from './PlayAnimation';

interface Props {
  audio: AudioData;
  onPress?(): void;
  isPlaying?: boolean;
  onLongPress?(): void;
}

const AudioListItem: FC<Props> = ({
  audio,
  onPress,
  isPlaying = false,
  onLongPress,
}) => {
  const getSource = (poster?: string) => {
    return {uri: poster};
  };
  return (
    <Pressable
      onLongPress={onLongPress}
      onPress={onPress}
      style={styles.listItem}>
      <View>
        <Image source={getSource(audio.poster)} style={styles.poster} />
        <PlayAnimation visible={isPlaying} />
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {audio.title}
        </Text>
        <Text style={styles.owner} numberOfLines={1} ellipsizeMode="tail">
          {audio.owner.name}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    backgroundColor: colors.OVERLAY,
    marginBottom: 15,
    borderRadius: 5,
  },
  titleContainer: {
    flex: 1,
    padding: 5,
  },
  poster: {
    width: 50,
    height: 50,
  },
  title: {
    color: colors.CONTRAST,
    fontWeight: '700',
  },
  owner: {
    color: colors.SECONDARY,
    fontWeight: '700',
  },
});

export default AudioListItem;
