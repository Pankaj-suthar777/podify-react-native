import {Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {fetchHistories, useFetchHistories} from 'src/hooks/query';
import EmptyRecords from '@ui/EmptyRecords';
import AudioListLoadingUI from '@ui/AudioListLoadingUI';
import colors from '@utils/colors';
import {getClient} from 'src/api/client';
import {useMutation, useQueryClient} from 'react-query';
import {useNavigation} from '@react-navigation/native';
import {History, historyAudio} from 'src/types/audio';
import PaginatedList from '@ui/PaginatedList';
import AntDesing from 'react-native-vector-icons/AntDesign';

let pageNo = 0;

const HistoryTab = () => {
  const navigation = useNavigation();
  const {data, isLoading, isFetching} = useFetchHistories();
  const queryClient = useQueryClient();
  const [selectedHistories, setSelectedHistories] = useState<string[]>([]);
  const noData = !data?.length;
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const removeMutation = useMutation({
    mutationFn: async histories => removeHistories(histories),
    onMutate: (histories: string[]) => {
      queryClient.setQueryData<History[]>(['histories'], oldData => {
        let newData: History[] = [];
        if (!oldData) return newData;

        for (let data of oldData) {
          const filterd = data.audios.filter(
            item => !histories.includes(item.id),
          );
          if (filterd.length) {
            newData.push({date: data.date, audios: filterd});
          }
        }

        return newData;
      });
    },
  });

  const removeHistories = async (histories: string[]) => {
    const client = await getClient();
    await client.delete('/history?histories=' + JSON.stringify(histories));
    queryClient.invalidateQueries({queryKey: ['histories']});
  };

  const handleSingleHistoryRemove = async (history: historyAudio) => {
    removeMutation.mutate([history.id]);
  };

  const handleOnLongPress = async (history: historyAudio) => {
    setSelectedHistories([history.id]);
  };

  const handleOnPress = async (history: historyAudio) => {
    if (selectedHistories.length === 0) {
      return;
    }
    setSelectedHistories(old => {
      if (old.includes(history.id)) {
        return old.filter(item => item !== history.id);
      }
      return [...old, history.id];
    });
  };

  const handleMultipleHistoryRemove = async () => {
    setSelectedHistories([]);
    removeMutation.mutate([...selectedHistories]);
  };

  const handleOnRefresh = () => {
    pageNo = 0;
    setHasMore(true);
    queryClient.invalidateQueries({queryKey: ['histories']});
  };

  const handleOnEndReached = async () => {
    if (!data || !hasMore || isFetchingMore) return;

    setIsFetchingMore(true);
    pageNo += 1;
    const res = await fetchHistories(pageNo);
    if (!res || !res.length) {
      setHasMore(false);
    }
    const newData = [...data, ...res];
    const finalData: History[] = [];

    const mergedData = newData.reduce((accumulator, current) => {
      const foundObj = accumulator.find(item => item.date === current.date);

      if (foundObj) {
        foundObj.audios = foundObj.audios.concat(current.audios);
      } else {
        accumulator.push(current);
      }

      return accumulator;
    }, finalData);

    queryClient.setQueryData(['histories'], mergedData);
    setIsFetchingMore(false);
  };

  useEffect(() => {
    const unselectHistories = () => {
      setSelectedHistories([]);
    };
    navigation.addListener('blur', unselectHistories);
    return () => {
      navigation.removeListener('blur', unselectHistories);
    };
  }, []);

  if (isLoading) return <AudioListLoadingUI />;

  return (
    <>
      {selectedHistories.length ? (
        <Pressable
          onPress={handleMultipleHistoryRemove}
          style={styles.removeBtn}>
          <Text style={styles.removeBtnText}>Remove</Text>
        </Pressable>
      ) : null}

      <PaginatedList
        data={data}
        renderItem={({item}) => {
          return (
            <View key={item.date}>
              <Text style={styles.date}>{item.date}</Text>
              <View style={styles.listContainer}>
                {item.audios.map((audio, index) => {
                  return (
                    <Pressable
                      onLongPress={() => handleOnLongPress(audio)}
                      onPress={() => handleOnPress(audio)}
                      key={audio.id + index}
                      style={[
                        styles.history,
                        {
                          backgroundColor: selectedHistories.includes(audio.id)
                            ? colors.INACTIVE_CONTRAST
                            : colors.OVERLAY,
                        },
                      ]}>
                      <Text style={styles.historyTitle}>{audio.title}</Text>
                      <Pressable
                        onPress={() => handleSingleHistoryRemove(audio)}>
                        <AntDesing name="close" color={colors.CONTRAST} />
                      </Pressable>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          );
        }}
        onEndReached={handleOnEndReached}
        ListEmptyComponent={<EmptyRecords title="There is no history!" />}
        refreshing={isFetching}
        onRefresh={handleOnRefresh}
        isFetching={isFetchingMore}
        hasMore={hasMore}
      />
    </>
  );
};

export default HistoryTab;

const styles = StyleSheet.create({
  date: {
    color: colors.INACTIVE_CONTRAST,
  },
  historyTitle: {
    color: colors.CONTRAST,
    paddingHorizontal: 5,
    fontWeight: '700',
    flex: 1,
  },
  history: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.OVERLAY,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  listContainer: {
    marginTop: 10,
    paddingLeft: 10,
  },
  removeBtn: {
    padding: 10,
    alignSelf: 'flex-end',
  },
  removeBtnText: {
    color: colors.CONTRAST,
  },
});
