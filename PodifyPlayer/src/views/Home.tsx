import {StyleSheet, View} from 'react-native';
import React from 'react';
import {useFetchLatestAudios} from 'src/hooks/query';
import LatestUploads from '@components/LatestUploads';

const Home = () => {
  const {isLoading, data} = useFetchLatestAudios();

  if (isLoading) {
    return;
  }

  return (
    <View style={styles.container}>
      <LatestUploads />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});
