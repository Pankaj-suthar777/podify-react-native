import React from 'react';
import AudioListItem from '../../ui/AudioListItem';
import AudioListLoadingUI from '../../ui/AudioListLoadingUI';
import EmptyRecords from '../../ui/EmptyRecords';
import {FC} from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import {useFetchUploadsByProfile} from '../../hooks/query';
import useAudioController from 'src/hooks/useAudioController';
import {useSelector} from 'react-redux';
import {getPlayerState} from 'src/store/player';

interface Props {}

const UploadsTab: FC<Props> = props => {
  const {data, isLoading} = useFetchUploadsByProfile();
  const {onAudioPress} = useAudioController();
  const {onGoingAudio} = useSelector(getPlayerState);

  if (isLoading) return <AudioListLoadingUI />;

  if (!data?.length) return <EmptyRecords title="There is no audio!" />;

  return (
    <ScrollView style={styles.container}>
      {data?.map(item => {
        return (
          <AudioListItem
            key={item.id}
            audio={item}
            isPlaying={onGoingAudio?.id === item.id}
            onPress={() => onAudioPress(item, data)}
          />
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default UploadsTab;
