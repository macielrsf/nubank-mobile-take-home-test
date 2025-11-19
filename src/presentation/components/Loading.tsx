import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { Theme } from '../hooks/useTheme';

interface LoadingProps {
  theme: Theme;
}

export const Loading: React.FC<LoadingProps> = ({ theme }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" color={theme.colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
