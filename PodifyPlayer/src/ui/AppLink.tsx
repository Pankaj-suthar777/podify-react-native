import colors from '@utils/colors';
import {FC} from 'react';
import {StyleSheet, Pressable, Text} from 'react-native';

interface Props {
  title: string;
  onPress?(): void;
  active?: boolean;
}

const AppLink: FC<Props> = ({title, onPress, active = true}) => {
  return (
    <Pressable
      onPress={active ? onPress : null}
      style={{opacity: active ? 1 : 0}}>
      <Text style={styles.title}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  title: {
    color: colors.SECONDARY,
  },
});

export default AppLink;
