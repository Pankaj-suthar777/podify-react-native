import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {FC, useState} from 'react';
import AppModal from '@ui/AppModal';
import colors from '@utils/colors';
import {useDispatch, useSelector} from 'react-redux';
import {getPlayerState, updatePlaybackRate} from 'src/store/player';
import useAudioController from 'src/hooks/useAudioController';
import AppLink from '@ui/AppLink';
import formatDuration from 'format-duration';
import {useProgress} from 'react-native-track-player';
import Slider from '@react-native-community/slider';
import AntDesign from 'react-native-vector-icons/AntDesign';
import PlayerControler from '@ui/PlayerControler';
import Loader from '@ui/Loader';
import PlayPauseBtn from '@ui/PlayPauseBtn';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import PlaybackRateSelector from '@ui/PlaybackRateSelector';
import AudioInfoContainer from './AudioInfoContainer';
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {
  visible: boolean;
  onRequestClose(): void;
  onListOptionPress?(): void;
  onProfileLinkPress?(): void;
}

const fromattedDuration = (duration = 0) => {
  return formatDuration(duration, {
    leading: true,
  });
};

const AudioPlayer: FC<Props> = ({
  visible,
  onRequestClose,
  onListOptionPress,
  onProfileLinkPress,
}) => {
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

  const updateSeek = async (value: number) => {
    await seekTo(value);
  };

  const handleSkipTo = async (skipType: 'forward' | 'reverse') => {
    if (skipType === 'forward') await skipTo(10);
    if (skipType === 'reverse') await skipTo(-10);
  };

  const handleOnNextPress = async () => {
    await onNextPress();
  };

  const handleOnPreviousPress = async () => {
    await onPreviousPress();
  };

  const onPlaybackPress = async (rate: number) => {
    await setPlaybackRate(rate);
    dispatch(updatePlaybackRate(rate));
  };

  return (
    <AppModal animation visible={visible} onRequestClose={onRequestClose}>
      <View style={styles.container}>
        <Pressable
          onPress={() => setShowAudioInfo(true)}
          style={styles.infoBtn}>
          <AntDesign name="infocirlceo" color={colors.CONTRAST} size={24} />
        </Pressable>
        <AudioInfoContainer
          visible={showAudioInfo}
          closeHandler={setShowAudioInfo}
        />
        <Image source={source} style={styles.poster} />
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{onGoingAudio?.title}</Text>
          <AppLink
            onPress={onProfileLinkPress}
            title={onGoingAudio?.owner.name || ''}
          />
          <View style={styles.durationContainer}>
            <Text style={styles.duration}>
              {fromattedDuration(position * 1000)}
            </Text>
            <Text style={styles.duration}>
              {fromattedDuration(duration * 1000)}
            </Text>
          </View>

          <Slider
            minimumValue={0}
            maximumValue={duration}
            minimumTrackTintColor={colors.CONTRAST}
            maximumTrackTintColor={colors.INACTIVE_CONTRAST}
            value={position}
            onSlidingComplete={updateSeek}
          />

          <View style={styles.controles}>
            {/* Previous */}
            <PlayerControler onPress={handleOnPreviousPress} ignoreContainer>
              <AntDesign
                name="stepbackward"
                size={24}
                color={colors.CONTRAST}
              />
            </PlayerControler>

            {/* Skip Time Left */}
            <PlayerControler
              onPress={() => handleSkipTo('reverse')}
              ignoreContainer>
              <FontAwesome
                name="rotate-left"
                size={18}
                color={colors.CONTRAST}
              />
              <Text style={styles.skipText}>-10s</Text>
            </PlayerControler>

            {/* Play Pause */}
            <PlayerControler>
              {isBusy ? (
                <Loader color={colors.PRIMARY} />
              ) : (
                <PlayPauseBtn
                  playing={isPalying}
                  onPress={togglePlayPause}
                  color={colors.PRIMARY}
                />
              )}
            </PlayerControler>

            {/* Skip Time Right */}
            <PlayerControler
              onPress={() => handleSkipTo('forward')}
              ignoreContainer>
              <FontAwesome
                name="rotate-right"
                size={18}
                color={colors.CONTRAST}
              />
              <Text style={styles.skipText}>+10s</Text>
            </PlayerControler>

            {/* Next */}
            <PlayerControler onPress={handleOnNextPress} ignoreContainer>
              <AntDesign name="stepforward" size={24} color={colors.CONTRAST} />
            </PlayerControler>
          </View>

          <PlaybackRateSelector
            onPress={onPlaybackPress}
            activeRate={playbackRate.toString()}
            containerStyle={{marginTop: 20}}
          />

          <View style={styles.listOptionBtnContainer}>
            <PlayerControler onPress={onListOptionPress} ignoreContainer>
              <MaterialComIcon
                name="playlist-music"
                size={24}
                color={colors.CONTRAST}
              />
            </PlayerControler>
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
