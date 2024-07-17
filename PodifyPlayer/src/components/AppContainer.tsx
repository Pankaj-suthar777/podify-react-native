import {SafeAreaView, StyleSheet} from 'react-native';
import React, {FC} from 'react';

interface Props {
  children: React.ReactNode;
}

const AppContainer: FC<Props> = ({children}) => {
  return <SafeAreaView style={styles.container}>{children}</SafeAreaView>;
};

export default AppContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
