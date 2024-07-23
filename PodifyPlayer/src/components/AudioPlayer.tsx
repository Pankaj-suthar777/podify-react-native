import {Image, StyleSheet, Text, View} from 'react-native';
import React, {FC, useState} from 'react';
import AppModal from '@ui/AppModal';
import colors from '@utils/colors';
import {useDispatch, useSelector} from 'react-redux';
import {getPlayerState} from 'src/store/player';
import useAudioController from 'src/hooks/useAudioController';
import AppLink from '@ui/AppLink';
import formatDuration from 'format-duration';
import {useProgress} from 'react-native-track-player';

interface Props {
  visible: boolean;
  onRequestClose(): void;
  onListOptionPress?(): void;
}

const fromattedDuration = (duration = 0) => {
  return formatDuration(duration, {
    leading: true,
  });
};

const AudioPlayer: FC<Props> = ({visible, onRequestClose}) => {
  const [showAudioInfo, setShowAudioInfo] = useState(false);
  const {onGoingAudio, playbackRate} = useSelector(getPlayerState);
  const {
    isPalying,
    isBusy,
    onNextPress,
    onPreviousPress,
    seekTo,
    skipTo,
    togglePlayPause,
    setPlaybackRate,
  } = useAudioController();
  const poster = onGoingAudio?.poster;
  const source = poster ? {uri: poster} : require('../assets/music.png');

  const {duration, position} = useProgress();
  const dispatch = useDispatch();

  return (
    <AppModal animation visible={visible} onRequestClose={onRequestClose}>
      <View style={styles.container}>
        <Image source={source} style={styles.poster} />
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{onGoingAudio?.title}</Text>
          <AppLink title={onGoingAudio?.owner.name || ''} />
          <View style={styles.durationContainer}>
            <Text style={styles.duration}>
              {fromattedDuration(position * 1000)}
            </Text>
            <Text style={styles.duration}>
              {fromattedDuration(duration * 1000)}
            </Text>
          </View>
        </View>
      </View>
    </AppModal>
  );
};

export default AudioPlayer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  poster: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  contentContainer: {
    width: '100%',
    flex: 1,
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.CONTRAST,
  },
  durationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  duration: {
    color: colors.CONTRAST,
  },
  controles: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  skipText: {
    fontSize: 12,
    marginTop: 2,
    color: colors.CONTRAST,
  },
  infoBtn: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  listOptionBtnContainer: {
    alignItems: 'flex-end',
  },
});
