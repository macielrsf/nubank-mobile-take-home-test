import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ListRenderItem,
  TouchableOpacity,
} from 'react-native';
import { ShortenedUrl } from '../../domain/entities/ShortenedUrl';
import { Theme } from '../hooks/useTheme';
import { Loading } from './Loading';

/**
 * Presentational Component
 * - Pure component focused on UI rendering
 * - Receives data and callbacks via props
 * - No direct access to use cases or DI container
 * - Manages UI-specific state (loading indicators) for better UX
 */
interface ShortenedListPresentationalProps {
  items: ShortenedUrl[];
  theme: Theme;
  loadingStates: Record<string, 'copy' | 'open' | null>;
  onCopy: (alias: string, shortUrl: string) => void;
  onOpen: (alias: string, shortUrl: string) => void;
}

const ITEM_HEIGHT = 180;

export const ShortenedListPresentational: React.FC<
  ShortenedListPresentationalProps
> = ({ items, theme, loadingStates, onCopy, onOpen }) => {
  const renderItem: ListRenderItem<ShortenedUrl> = ({ item }) => {
    const isLoadingCopy = loadingStates[item.alias] === 'copy';
    const isLoadingOpen = loadingStates[item.alias] === 'open';

    return (
      <View
        style={[
          styles.item,
          {
            backgroundColor: theme.colors.card,
            borderLeftColor: theme.colors.primary,
          },
        ]}
        testID="list-item"
      >
        <View style={styles.content}>
          <Text
            style={[styles.alias, { color: theme.colors.text }]}
            numberOfLines={1}
          >
            {item.alias}
          </Text>
          <Text style={[styles.shortUrl, { color: theme.colors.primary }]}>
            {item.shortUrl}
          </Text>
          <Text
            style={[styles.originalUrl, { color: theme.colors.textSecondary }]}
          >
            {item.originalUrl}
          </Text>
        </View>
        <View style={styles.footer}>
          {isLoadingCopy ? (
            <View style={styles.loadingContainer}>
              <Loading theme={theme} />
            </View>
          ) : (
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: theme.colors.primary },
              ]}
              onPress={() => onCopy(item.alias, item.shortUrl)}
              testID="copy-button"
              disabled={isLoadingOpen}
            >
              <Text style={styles.actionButtonText}>Copy</Text>
            </TouchableOpacity>
          )}
          {isLoadingOpen ? (
            <View style={styles.loadingContainer}>
              <Loading theme={theme} />
            </View>
          ) : (
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: theme.colors.primary },
              ]}
              onPress={() => onOpen(item.alias, item.shortUrl)}
              testID="open-button"
              disabled={isLoadingCopy}
            >
              <Text style={styles.actionButtonText}>Open</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const keyExtractor = (item: ShortenedUrl, index: number) =>
    `${item.alias}-${index}`;

  const getItemLayout = (
    _data: ArrayLike<ShortenedUrl> | null | undefined,
    index: number,
  ) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  });

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
          No URLs shortened yet
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      initialNumToRender={10}
      maxToRenderPerBatch={5}
      windowSize={5}
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 16,
    gap: 12,
  },
  item: {
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    height: ITEM_HEIGHT,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    gap: 4,
  },
  alias: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  shortUrl: {
    fontSize: 14,
    marginBottom: 4,
  },
  originalUrl: {
    fontSize: 12,
  },
  footer: {
    flexDirection: 'row',
    gap: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButton: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
  },
});
