import OptionModal from '@components/OptionModal';
import PlaylistForm from '@components/PlaylistForm';
import EmptyRecords from '@ui/EmptyRecords';
import OptionSelector from '@ui/OptionSelector';
import PaginatedList from '@ui/PaginatedList';
import PlaylistItem from '@ui/PlaylistItem';
import colors from '@utils/colors';
import {FC, useState} from 'react';
import {StyleSheet} from 'react-native';
import {useQueryClient} from 'react-query';
import {useDispatch} from 'react-redux';
import catchAsyncError from 'src/api/catchError';
import {fetchPlaylist, useFetchPlaylist} from 'src/hooks/query';
import {upldateNotification} from 'src/store/notification';
import {
  udpateAllowPlaylistAudioRemove,
  updateIsPlaylistPrivate,
  updatePlaylistVisbility,
  updateSelectedListId,
} from 'src/store/playlistModal';
import {Playlist} from 'src/types/audio';
import AntDesing from 'react-native-vector-icons/AntDesign';
import deepEqual from 'deep-equal';
import {getClient} from 'src/api/client';

interface Props {}

let pageNo = 0;

const PlaylistTab: FC<Props> = props => {
  const {data, isFetching} = useFetchPlaylist();
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist>();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const handleOnListPress = (playlist: Playlist) => {
    dispatch(udpateAllowPlaylistAudioRemove(true));
    dispatch(updateIsPlaylistPrivate(playlist.visibility === 'private'));
    dispatch(updateSelectedListId(playlist.id));
    dispatch(updatePlaylistVisbility(true));
  };

  const handleOnEndReached = async () => {
    setIsFetchingMore(true);
    try {
      if (!data) return;
      pageNo += 1;
      const playlist = await fetchPlaylist(pageNo);
      if (!playlist || !playlist.length) {
        setHasMore(false);
      }

      const newList = [...data, ...playlist];
      queryClient.setQueryData(['playlist'], newList);
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      dispatch(upldateNotification({message: errorMessage, type: 'error'}));
    }
    setIsFetchingMore(false);
  };

  const handleOnRefresh = () => {
    pageNo = 0;
    setHasMore(true);
    queryClient.invalidateQueries(['playlist']);
  };

  const handleOnLongPress = (playlist: Playlist) => {
    setSelectedPlaylist({
      ...playlist,
    });
    setShowOptions(true);
  };

  const closeOptions = () => {
    setShowOptions(false);
  };

  const closeUpdateForm = () => {
    setShowUpdateForm(false);
  };

  const handleOnEditPress = () => {
    closeOptions();
    setShowUpdateForm(true);
  };

  const updatePlaylist = async (item: Playlist) => {
    try {
      const client = await getClient();
      closeUpdateForm();
      await client.patch('/playlist', item);
      queryClient.invalidateQueries(['playlist']);

      dispatch(
        upldateNotification({message: 'Playlist updated', type: 'success'}),
      );
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      dispatch(upldateNotification({message: errorMessage, type: 'error'}));
    }
  };

  const handleOnDeletePress = async () => {
    try {
      const client = await getClient();
      closeOptions();
      await client.delete(
        '/playlist?all=yes&playlistId=' + selectedPlaylist?.id,
      );
      queryClient.invalidateQueries(['playlist']);

      dispatch(
        upldateNotification({message: 'Playlist removed.', type: 'success'}),
      );
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      dispatch(upldateNotification({message: errorMessage, type: 'error'}));
    }
  };

  return (
    <>
      <PaginatedList
        data={data}
        hasMore={hasMore}
        isFetching={isFetchingMore}
        onEndReached={handleOnEndReached}
        onRefresh={handleOnRefresh}
        refreshing={isFetching}
        ListEmptyComponent={<EmptyRecords title="There is no playlist!" />}
        renderItem={({item, index}) => {
          return (
            <PlaylistItem
              onPress={() => handleOnListPress(item)}
              key={item.id}
              playlist={item}
              onLongPress={() => handleOnLongPress(item)}
            />
          );
        }}
      />

      <OptionModal
        visible={showOptions}
        onRequestClose={closeOptions}
        options={[
          {
            title: 'Edit',
            icon: 'edit',
            onPress: handleOnEditPress,
          },
          {
            title: 'Delete',
            icon: 'delete',
            onPress: handleOnDeletePress,
          },
        ]}
        renderItem={item => {
          return (
            <OptionSelector
              onPress={item.onPress}
              label={item.title}
              icon={
                <AntDesing size={24} color={colors.PRIMARY} name={item.icon} />
              }
            />
          );
        }}
      />

      <PlaylistForm
        visible={showUpdateForm}
        onRequestClose={closeUpdateForm}
        onSubmit={value => {
          const isSame = deepEqual(value, {
            title: selectedPlaylist?.title,
            private: selectedPlaylist?.visibility === 'private',
          });
          if (isSame || !selectedPlaylist) return;

          updatePlaylist({
            ...selectedPlaylist,
            title: value.title,
            visibility: value.private ? 'private' : 'public',
          });
        }}
        initialValue={{
          title: selectedPlaylist?.title || '',
          private: selectedPlaylist?.visibility === 'private',
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default PlaylistTab;
