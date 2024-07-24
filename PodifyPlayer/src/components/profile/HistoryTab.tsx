import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useFetchHistories} from 'src/hooks/query';
import EmptyRecords from '@ui/EmptyRecords';
import AudioListLoadingUI from '@ui/AudioListLoadingUI';
import colors from '@utils/colors';
import AntDesign from 'react-native-vector-icons/AntDesign';

const HistoryTab = () => {
  const {data, isLoading} = useFetchHistories();

  if (isLoading) return <AudioListLoadingUI />;

  if (!data || !data[0]?.audios.length)
    return <EmptyRecords title="There is no history!" />;

  return (
    <ScrollView>
      {data.map((item, index) => {
        return (
          <View key={item.date + index}>
            <Text style={styles.date}>{item.date}</Text>
            <View style={styles.listContainer}>
              {item.audios.map((audio, i) => {
                return (
                  <View key={audio.id + i} style={styles.history}>
                    <Text style={styles.historyTitle}>{audio.title}</Text>
                    <Pressable>
                      <AntDesign name="close" color={colors.CONTRAST} />
                    </Pressable>
                  </View>
                );
              })}
            </View>
          </View>
        );
      })}
      <Text>HistoryTab</Text>
    </ScrollView>
  );
};

export default HistoryTab;

const styles = StyleSheet.create({
  date: {
    color: colors.PRIMARY,
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
});
