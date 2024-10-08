import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import LatestUploads from '@components/LatestUploads';
import RecommendedAudios from '@components/RecommendedAudios';
import OptionModal from '@components/OptionModal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '@utils/colors';
import {AudioData, Playlist} from 'src/types/audio';
import catchAsyncError from 'src/api/catchError';
import {useDispatch} from 'react-redux';
import {upldateNotification} from 'src/store/notification';
import PlaylistForm, {PlaylistInfo} from '@components/PlaylistForm';
import PlayListModal from '@components/PlaylistModal';
import {getClient} from 'src/api/client';
import {useFetchPlaylist} from 'src/hooks/query';
import useAudioController from 'src/hooks/useAudioController';
import AppView from '@components/AppView';
import RecentlyPlayed from '@components/RecentlyPlayed';
import RecommendedPlaylist from '@components/RecommendedPlaylist';
import {
  updatePlaylistVisbility,
  updateSelectedListId,
} from 'src/store/playlistModal';

const Home = () => {
  const [showOptions, setShowOptions] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState<AudioData>();
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [showPlaylistForm, setShowPlaylistForm] = useState(false);
  const {onAudioPress} = useAudioController();

  const dispatch = useDispatch();

  const {data} = useFetchPlaylist();

  const handleOnFavPress = async () => {
    if (!selectedAudio) return;
    // send request with the audio id that we want to add to fav

    try {
      const client = await getClient();

      await client.post('/favorite?audioId=' + selectedAudio.id);
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

  const handlePlaylistSubmit = async (value: PlaylistInfo) => {
    if (!value.title.trim()) return;

    try {
      const client = await getClient();
      await client.post('/playlist/create', {
        resId: selectedAudio?.id,
        title: value.title,
        visibility: value.private ? 'private' : 'public',
      });

      dispatch(
        upldateNotification({message: 'New lsit added.', type: 'success'}),
      );
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      dispatch(upldateNotification({message: errorMessage, type: 'error'}));
    }
  };

  const updatePlaylist = async (item: Playlist) => {
    try {
      const client = await getClient();
      await client.patch('/playlist', {
        id: item.id,
        item: selectedAudio?.id,
        title: item.title,
        visibility: item.visibility,
      });

      setSelectedAudio(undefined);
      setShowPlaylistModal(false);
      dispatch(
        upldateNotification({message: 'New audio added.', type: 'success'}),
      );
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      dispatch(upldateNotification({message: errorMessage, type: 'error'}));
    }
  };

  const handleOnListPress = (playlist: Playlist) => {
    dispatch(updateSelectedListId(playlist.id));
    dispatch(updatePlaylistVisbility(true));
  };

  return (
    <AppView>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.space}>
          <RecentlyPlayed />
        </View>

        <View style={styles.space}>
          <LatestUploads
            onAudioLongPress={() => setShowOptions(true)}
            onAudioPress={onAudioPress}
          />
        </View>

        <View style={styles.space}>
          <RecommendedAudios
            onAudioLongPress={item => handleOnLongPress(item)}
            onAudioPress={onAudioPress}
          />
        </View>

        <View style={styles.space}>
          <RecommendedPlaylist onListPress={handleOnListPress} />
        </View>

        <OptionModal
          visible={showOptions}
          onRequestClose={() => {
            setShowOptions(false);
          }}
          options={[
            {
              title: 'Add to Playlist',
              icon: 'playlist-music',
              onPress: handleOnAddToPlaylist,
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

        <PlayListModal
          visible={showPlaylistModal}
          onRequestClose={() => {
            setShowPlaylistModal(false);
          }}
          list={data || []}
          onCreateNewPress={() => {
            setShowPlaylistModal(false);
            setShowPlaylistForm(true);
          }}
          onPlaylistPress={updatePlaylist}
        />

        <PlaylistForm
          visible={showPlaylistForm}
          onRequestClose={() => {
            setShowPlaylistForm(false);
          }}
          onSubmit={handlePlaylistSubmit}
        />
      </ScrollView>
    </AppView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  space: {
    marginBottom: 15,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  optionLabel: {color: colors.PRIMARY, fontSize: 16, marginLeft: 5},
});
