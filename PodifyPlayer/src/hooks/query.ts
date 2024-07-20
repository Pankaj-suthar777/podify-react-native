import catchAsyncError from 'src/api/catchError';
import {useDispatch} from 'react-redux';
import {upldateNotification} from 'src/store/notification';
import client, {getClient} from 'src/api/client';
import {useQuery} from 'react-query';
import {AudioData, Playlist} from 'src/types/audio';
import {getFromAsyncStorage, Keys} from '@utils/asyncStorage';

const fetchLastest = async (): Promise<AudioData[]> => {
  const {data} = await client('/audio/latest');
  return data.audios;
};

export const useFetchLatestAudios = () => {
  const dispatch = useDispatch();
  return useQuery(['latest-uploads'], {
    queryFn: () => fetchLastest(),
    onError(err) {
      const errorMessage = catchAsyncError(err);
      dispatch(upldateNotification({message: errorMessage, type: 'error'}));
    },
  });
};

const fetchRecommended = async (): Promise<AudioData[]> => {
  const {data} = await client('/audio/latest');
  return data.audios;
};

export const useFetchRecommendedAudios = () => {
  const dispatch = useDispatch();
  return useQuery(['recommended'], {
    queryFn: () => fetchRecommended(),
    onError(err) {
      const errorMessage = catchAsyncError(err);
      dispatch(upldateNotification({message: errorMessage, type: 'error'}));
    },
  });
};

const fetchPlaylist = async (): Promise<Playlist[]> => {
  const client = await getClient();
  const token = await getFromAsyncStorage(Keys.AUTH_TOKEN);
  const {data} = await client('/playlist/by-profile', {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  });
  return data.playlist;
};

export const useFetchPlaylist = () => {
  const dispatch = useDispatch();
  return useQuery(['playlist'], {
    queryFn: () => fetchPlaylist(),
    onError(err) {
      const errorMessage = catchAsyncError(err);
      dispatch(upldateNotification({message: errorMessage, type: 'error'}));
    },
  });
};

const fetchUploadsByProfile = async (): Promise<AudioData[]> => {
  const client = await getClient();
  const {data} = await client('/profile/uploads');
  return data.audios;
};

export const useFetchUploadsByProfile = () => {
  const dispatch = useDispatch();
  return useQuery(['uploads-by-profile'], {
    queryFn: () => fetchUploadsByProfile(),
    onError(err) {
      const errorMessage = catchAsyncError(err);
      dispatch(upldateNotification({message: errorMessage, type: 'error'}));
    },
  });
};

const fetchFavorites = async (): Promise<AudioData[]> => {
  const client = await getClient();
  const {data} = await client('/favorite');
  return data.audios;
};

export const useFetchFavorite = () => {
  const dispatch = useDispatch();
  return useQuery(['favorite'], {
    queryFn: () => fetchFavorites(),
    onError(err) {
      console.log(err);
      const errorMessage = catchAsyncError(err);
      dispatch(upldateNotification({message: errorMessage, type: 'error'}));
    },
  });
};
