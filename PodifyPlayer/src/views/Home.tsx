import {Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import LatestUploads from '@components/LatestUploads';
import RecommendedAudios from '@components/RecommendedAudios';
import OptionModal from '@components/OptionModal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '@utils/colors';
import {AudioData} from 'src/types/audio';
import catchAsyncError from 'src/api/catchError';
import {useDispatch} from 'react-redux';
import {upldateNotification} from 'src/store/notification';

const Home = () => {
  const [showOptions, setShowOptions] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState<AudioData>();

  const dispatch = useDispatch();

  const handleOnFavPress = async () => {
    if (!selectedAudio) return;
    // send request with the audio id that we want to add to fav

    try {
      const client = await getClient();

      const {data} = await client.post('/favorite?audioId=' + selectedAudio.id);
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      dispatch(upldateNotification({message: errorMessage, type: 'error'}));
    }

    setSelectedAudio(undefined);
    setShowOptions(false);
  };

  const handleOnLongPress = (audio: AudioData) => {
    setSelectedAudio(audio);
    setShowOptions(true);
  };

  const handleOnAddToPlaylist = () => {
    setShowOptions(false);
    setShowPlaylistModal(true);
  };

  return (
    <View style={styles.container}>
      <LatestUploads
        onAudioLongPress={() => setShowOptions(true)}
        onAudioPress={}
      />
      <RecommendedAudios
        onAudioLongPress={item => handleOnLongPress(item)}
        onAudioPress={}
      />
      <OptionModal
        visible={showOptions}
        onRequestClose={}
        options={[
          {
            title: 'Add to Playlist',
            icon: 'playlist-music',
            onPress: handleOnFavPress,
          },
          {
            title: 'Add to Favorite',
            icon: 'cards-heart',
            onPress: handleOnFavPress,
          },
        ]}
        renderItem={item => {
          return (
            <Pressable onPress={item.onPress} style={styles.optionContainer}>
              <MaterialCommunityIcons size={24} name={item.icon} />
              <Text style={styles.optionLabel}>{item.title}</Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  optionLabel: {
    color: colors.PRIMARY,
    fontSize: 16,
    marginLeft: 5,
  },
});
