import AudioForm from '@components/form/AudioForm';
import {mapRange} from '@utils/math';
import {FC, useState} from 'react';
import {useDispatch} from 'react-redux';
import catchAsyncError from 'src/api/catchError';
import {getClient} from 'src/api/client';
import {upldateNotification} from 'src/store/notification';

interface Props {}

const Upload: FC<Props> = props => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [busy, setBusy] = useState(false);

  const dispatch = useDispatch();

  const handleUpload = async (formData: FormData) => {
    setBusy(true);
    try {
      const client = await getClient({'Content-Type': 'multipart/form-data;'});

      const {data} = await client.post('/audio/create', formData, {
        onUploadProgress(progressEvent) {
          const uploaded = mapRange({
            inputMin: 0,
            inputMax: progressEvent.total || 0,
            outputMin: 0,
            outputMax: 100,
            inputValue: progressEvent.loaded,
          });

          if (uploaded >= 100) {
            setBusy(false);
          }

          setUploadProgress(Math.floor(uploaded));
        },
      });

      console.log(data);
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      dispatch(upldateNotification({message: errorMessage, type: 'error'}));
    }
    setBusy(false);
  };

  return (
    <AudioForm onSubmit={handleUpload} busy={busy} progress={uploadProgress} />
  );
};

export default Upload;
