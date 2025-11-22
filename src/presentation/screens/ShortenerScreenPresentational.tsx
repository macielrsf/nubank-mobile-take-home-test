import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShortenedUrl } from '../../domain/entities/ShortenedUrl';
import { UrlInput } from '../components/UrlInput';
import { ShortenedListPresentational } from '../components/ShortenedListPresentational';
import { Theme } from '../hooks/useTheme';

/**
 * Presentational Component
 * - Pure component focused on UI rendering
 * - Receives all data via props
 * - No direct access to use cases or DI container
 * - Emits events through callbacks
 */
interface ShortenerScreenPresentationalProps {
  theme: Theme;
  url: string;
  loading: boolean;
  error: string | null;
  shortenedUrls: ShortenedUrl[];
  loadingStates: Record<string, 'copy' | 'open' | null>;
  onUrlChange: (url: string) => void;
  onSubmit: () => void;
  onToggleTheme: () => void;
  onCopy: (alias: string, shortUrl: string) => void;
  onOpen: (alias: string, shortUrl: string) => void;
}

export const ShortenerScreenPresentational: React.FC<
  ShortenerScreenPresentationalProps
> = ({
  theme,
  url,
  loading,
  error,
  shortenedUrls,
  loadingStates,
  onUrlChange,
  onSubmit,
  onToggleTheme,
  onCopy,
  onOpen,
}) => {
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View
          style={[styles.header, { borderBottomColor: theme.colors.border }]}
        >
          <Text style={[styles.title, { color: theme.colors.primary }]}>
            Nu URL Shortener
          </Text>
          <TouchableOpacity
            onPress={onToggleTheme}
            style={styles.themeButton}
            testID="theme-toggle"
          >
            <Text style={styles.themeIcon}>{theme.isDark ? '☀️' : '🌙'}</Text>
          </TouchableOpacity>
        </View>

        <UrlInput
          url={url}
          onUrlChange={onUrlChange}
          onSubmit={onSubmit}
          loading={loading}
          theme={theme}
        />

        {error && (
          <View
            style={[
              styles.errorContainer,
              {
                backgroundColor: theme.colors.errorBackground,
                borderLeftColor: theme.colors.error,
              },
            ]}
          >
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
              {error}
            </Text>
          </View>
        )}

        <ShortenedListPresentational
          items={shortenedUrls}
          theme={theme}
          loadingStates={loadingStates}
          onCopy={onCopy}
          onOpen={onOpen}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  themeButton: {
    padding: 8,
  },
  themeIcon: {
    fontSize: 24,
  },
  errorContainer: {
    padding: 12,
    marginHorizontal: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  errorText: {
    fontSize: 14,
  },
});
