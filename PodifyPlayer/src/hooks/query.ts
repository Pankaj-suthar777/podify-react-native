import catchAsyncError from 'src/api/catchError';
import {useDispatch} from 'react-redux';
import {upldateNotification} from 'src/store/notification';
import client from 'src/api/client';
import {useQuery} from 'react-query';
import {AudioData} from 'src/types/audio';

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
