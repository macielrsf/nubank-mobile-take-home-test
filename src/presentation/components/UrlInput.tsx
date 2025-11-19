import React from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import { Theme } from '../hooks/useTheme';

interface UrlInputProps {
  url: string;
  onUrlChange: (url: string) => void;
  onSubmit: () => void;
  loading: boolean;
  theme: Theme;
}

export const UrlInput: React.FC<UrlInputProps> = ({
  url,
  onUrlChange,
  onSubmit,
  loading,
  theme,
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        testID="url-input"
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.inputBackground,
            borderColor: theme.colors.inputBorder,
            color: theme.colors.text,
          },
        ]}
        placeholder="Enter URL to shorten"
        placeholderTextColor={theme.colors.textSecondary}
        value={url}
        onChangeText={onUrlChange}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="url"
        editable={!loading}
      />
      <TouchableOpacity
        testID="shorten-button"
        style={[
          styles.button,
          { backgroundColor: theme.colors.primary },
          loading && styles.buttonDisabled,
        ]}
        onPress={onSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Shortening...' : 'Shorten'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  button: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
