import {StyleSheet, View} from 'react-native';
import React from 'react';
import LatestUploads from '@components/LatestUploads';
import RecommendedAudios from '@components/RecommendedAudios';

const Home = () => {
  return (
    <View style={styles.container}>
      <LatestUploads />
      <RecommendedAudios />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});
