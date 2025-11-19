import React, { useState } from 'react';
import { Alert } from 'react-native';
import { ShortenerScreenPresentational } from '../screens/ShortenerScreenPresentational';
import { ShortenedUrl } from '../../domain/entities/ShortenedUrl';
import { useTheme } from '../hooks/useTheme';
import { dependencies } from '../../di/container';

/**
 * Smart Component (Container)
 * - Handles business logic and state management
 * - Connects to use cases through DI
 * - Manages side effects
 */
export const ShortenerScreenContainer: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shortenedUrls, setShortenedUrls] = useState<ShortenedUrl[]>([]);
  const [loadingStates, setLoadingStates] = useState<
    Record<string, 'copy' | 'open' | null>
  >({});

  const handleSubmit = async () => {
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await dependencies.shortenUrlUseCase.execute(url);
      setShortenedUrls(prevUrls => [result, ...prevUrls]);
      setUrl('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to shorten URL');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (alias: string, shortUrl: string) => {
    setLoadingStates(prev => ({ ...prev, [alias]: 'copy' }));
    try {
      const resolvedUrl = await dependencies.resolveShortUrlUseCase.execute(
        shortUrl,
      );
      await dependencies.copyUrlUseCase.execute(resolvedUrl);
    } catch (err) {
      Alert.alert(
        'Error',
        err instanceof Error ? err.message : 'Failed to copy URL',
      );
    } finally {
      setLoadingStates(prev => ({ ...prev, [alias]: null }));
    }
  };

  const handleOpen = async (alias: string, shortUrl: string) => {
    setLoadingStates(prev => ({ ...prev, [alias]: 'open' }));
    try {
      const resolvedUrl = await dependencies.resolveShortUrlUseCase.execute(
        shortUrl,
      );
      await dependencies.openUrlUseCase.execute(resolvedUrl);
    } catch (err) {
      Alert.alert(
        'Error',
        err instanceof Error ? err.message : 'Failed to open URL',
      );
    } finally {
      setLoadingStates(prev => ({ ...prev, [alias]: null }));
    }
  };

  return (
    <ShortenerScreenPresentational
      theme={theme}
      url={url}
      loading={loading}
      error={error}
      shortenedUrls={shortenedUrls}
      loadingStates={loadingStates}
      onUrlChange={setUrl}
      onSubmit={handleSubmit}
      onToggleTheme={toggleTheme}
      onCopy={handleCopy}
      onOpen={handleOpen}
    />
  );
};
