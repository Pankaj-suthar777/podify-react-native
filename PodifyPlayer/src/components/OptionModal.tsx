import {StyleSheet, View} from 'react-native';
import React from 'react';
import BasicModelConatiner from '@ui/BasicModelConatiner';

interface Props<T> {
  visible: boolean;
  onRequestClose(): void;
  options: T[];
  renderItem(item: T): JSX.Element;
}

const OptionModal = <T extends any>({
  onRequestClose,
  visible,
  options,
  renderItem,
}: Props<T>) => {
  return (
    <BasicModelConatiner visible={visible} onRequestClose={onRequestClose}>
      {options.map((item, index) => {
        return <View key={index}>{renderItem(item)}</View>;
      })}
    </BasicModelConatiner>
  );
};

export default OptionModal;

const styles = StyleSheet.create({});
