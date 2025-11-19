import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { ShortenerScreenContainer } from '../../presentation/containers/ShortenerScreenContainer';
import { dependencies } from '../../di/container';

/**
 * Container Tests - Business Logic
 * Tests state management, use case execution, and side effects
 * No UI testing here - that's in the Presenter tests
 */

// Mock dependencies
jest.mock('../../di/container', () => ({
  dependencies: {
    shortenUrlUseCase: {
      execute: jest.fn(),
    },
    resolveShortUrlUseCase: {
      execute: jest.fn(),
    },
    copyUrlUseCase: {
      execute: jest.fn(),
    },
    openUrlUseCase: {
      execute: jest.fn(),
    },
  },
}));

// Mock Alert
jest.spyOn(Alert, 'alert');

// Mock useTheme hook
jest.mock('../../presentation/hooks/useTheme', () => ({
  useTheme: () => ({
    theme: {
      isDark: false,
      colors: {
        primary: '#820AD1',
        background: '#FFFFFF',
        card: '#F5F5F5',
        text: '#000000',
        textSecondary: '#666666',
        border: '#E0E0E0',
        error: '#D32F2F',
        errorBackground: '#FFEBEE',
        success: '#388E3C',
        inputBackground: '#FFFFFF',
        inputBorder: '#CCCCCC',
      },
    },
    toggleTheme: jest.fn(),
  }),
}));

describe('ShortenerScreenContainer Business Logic Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('URL Shortening', () => {
    it('should call shortenUrlUseCase when submitting a valid URL', async () => {
      const mockResult = {
        alias: 'abc123',
        shortUrl: 'https://short.url/abc123',
        originalUrl: 'https://google.com',
      };

      (dependencies.shortenUrlUseCase.execute as jest.Mock).mockResolvedValue(
        mockResult,
      );

      const { getByTestId, getByText } = render(<ShortenerScreenContainer />);

      const input = getByTestId('url-input');
      const button = getByTestId('shorten-button');

      fireEvent.changeText(input, 'https://google.com');
      fireEvent.press(button);

      await waitFor(() => {
        expect(dependencies.shortenUrlUseCase.execute).toHaveBeenCalledWith(
          'https://google.com',
        );
      });

      await waitFor(() => {
        expect(getByText('abc123')).toBeTruthy();
      });
    });

    it('should add shortened URL to the list', async () => {
      const mockResult = {
        alias: 'test123',
        shortUrl: 'https://short.url/test123',
        originalUrl: 'https://example.com',
      };

      (dependencies.shortenUrlUseCase.execute as jest.Mock).mockResolvedValue(
        mockResult,
      );

      const { getByTestId, getByText } = render(<ShortenerScreenContainer />);

      const input = getByTestId('url-input');
      const button = getByTestId('shorten-button');

      fireEvent.changeText(input, 'https://example.com');
      fireEvent.press(button);

      await waitFor(() => {
        expect(getByText('test123')).toBeTruthy();
        expect(getByText('https://short.url/test123')).toBeTruthy();
        expect(getByText('https://example.com')).toBeTruthy();
      });
    });

    it('should clear input after successful shortening', async () => {
      const mockResult = {
        alias: 'abc123',
        shortUrl: 'https://short.url/abc123',
        originalUrl: 'https://google.com',
      };

      (dependencies.shortenUrlUseCase.execute as jest.Mock).mockResolvedValue(
        mockResult,
      );

      const { getByTestId } = render(<ShortenerScreenContainer />);

      const input = getByTestId('url-input');
      const button = getByTestId('shorten-button');

      fireEvent.changeText(input, 'https://google.com');
      fireEvent.press(button);

      await waitFor(() => {
        expect(input.props.value).toBe('');
      });
    });

    it('should add multiple URLs to the list', async () => {
      const mockResult1 = {
        alias: 'first',
        shortUrl: 'https://short.url/first',
        originalUrl: 'https://google.com',
      };

      const mockResult2 = {
        alias: 'second',
        shortUrl: 'https://short.url/second',
        originalUrl: 'https://example.com',
      };

      (dependencies.shortenUrlUseCase.execute as jest.Mock)
        .mockResolvedValueOnce(mockResult1)
        .mockResolvedValueOnce(mockResult2);

      const { getByTestId, getByText } = render(<ShortenerScreenContainer />);

      const input = getByTestId('url-input');
      const button = getByTestId('shorten-button');

      // First URL
      fireEvent.changeText(input, 'https://google.com');
      fireEvent.press(button);

      await waitFor(() => {
        expect(getByText('first')).toBeTruthy();
      });

      // Second URL
      fireEvent.changeText(input, 'https://example.com');
      fireEvent.press(button);

      await waitFor(() => {
        expect(getByText('second')).toBeTruthy();
      });

      // Both should be in the list
      expect(getByText('first')).toBeTruthy();
      expect(getByText('second')).toBeTruthy();
    });
  });

  describe('Error Handling', () => {
    it('should display error when submitting empty URL', async () => {
      const { getByTestId, getByText } = render(<ShortenerScreenContainer />);

      const button = getByTestId('shorten-button');
      fireEvent.press(button);

      await waitFor(() => {
        expect(getByText('Please enter a URL')).toBeTruthy();
      });

      expect(dependencies.shortenUrlUseCase.execute).not.toHaveBeenCalled();
    });

    it('should display error when use case throws error', async () => {
      (dependencies.shortenUrlUseCase.execute as jest.Mock).mockRejectedValue(
        new Error('HTTP Error: 500'),
      );

      const { getByTestId, getByText } = render(<ShortenerScreenContainer />);

      const input = getByTestId('url-input');
      const button = getByTestId('shorten-button');

      fireEvent.changeText(input, 'https://google.com');
      fireEvent.press(button);

      await waitFor(() => {
        expect(getByText('HTTP Error: 500')).toBeTruthy();
      });
    });

    it('should display generic error for non-Error exceptions', async () => {
      (dependencies.shortenUrlUseCase.execute as jest.Mock).mockRejectedValue(
        'Unknown error',
      );

      const { getByTestId, getByText } = render(<ShortenerScreenContainer />);

      const input = getByTestId('url-input');
      const button = getByTestId('shorten-button');

      fireEvent.changeText(input, 'https://google.com');
      fireEvent.press(button);

      await waitFor(() => {
        expect(getByText('Failed to shorten URL')).toBeTruthy();
      });
    });

    it('should clear previous error on new submission', async () => {
      const mockResult = {
        alias: 'abc123',
        shortUrl: 'https://short.url/abc123',
        originalUrl: 'https://google.com',
      };

      (dependencies.shortenUrlUseCase.execute as jest.Mock)
        .mockRejectedValueOnce(new Error('First error'))
        .mockResolvedValueOnce(mockResult);

      const { getByTestId, getByText, queryByText } = render(
        <ShortenerScreenContainer />,
      );

      const input = getByTestId('url-input');
      const button = getByTestId('shorten-button');

      // First attempt - error
      fireEvent.changeText(input, 'https://google.com');
      fireEvent.press(button);

      await waitFor(() => {
        expect(getByText('First error')).toBeTruthy();
      });

      // Second attempt - success
      fireEvent.changeText(input, 'https://google.com');
      fireEvent.press(button);

      await waitFor(() => {
        expect(queryByText('First error')).toBeNull();
      });
    });
  });

  describe('Copy URL Action', () => {
    it('should call resolveShortUrlUseCase and copyUrlUseCase when copying', async () => {
      const mockResult = {
        alias: 'abc123',
        shortUrl: 'https://short.url/abc123',
        originalUrl: 'https://google.com',
      };

      (dependencies.shortenUrlUseCase.execute as jest.Mock).mockResolvedValue(
        mockResult,
      );
      (
        dependencies.resolveShortUrlUseCase.execute as jest.Mock
      ).mockResolvedValue('https://google.com');

      const { getByTestId, getAllByTestId } = render(
        <ShortenerScreenContainer />,
      );

      const input = getByTestId('url-input');
      const button = getByTestId('shorten-button');

      fireEvent.changeText(input, 'https://google.com');
      fireEvent.press(button);

      await waitFor(() => {
        expect(getAllByTestId('copy-button')).toHaveLength(1);
      });

      const copyButton = getAllByTestId('copy-button')[0];
      fireEvent.press(copyButton);

      await waitFor(() => {
        expect(
          dependencies.resolveShortUrlUseCase.execute,
        ).toHaveBeenCalledWith('https://short.url/abc123');
        expect(dependencies.copyUrlUseCase.execute).toHaveBeenCalledWith(
          'https://google.com',
        );
      });
    });

    it('should show error alert when copy fails', async () => {
      const mockResult = {
        alias: 'abc123',
        shortUrl: 'https://short.url/abc123',
        originalUrl: 'https://google.com',
      };

      (dependencies.shortenUrlUseCase.execute as jest.Mock).mockResolvedValue(
        mockResult,
      );
      (
        dependencies.resolveShortUrlUseCase.execute as jest.Mock
      ).mockRejectedValue(new Error('Network error'));

      const { getByTestId, getAllByTestId } = render(
        <ShortenerScreenContainer />,
      );

      const input = getByTestId('url-input');
      const button = getByTestId('shorten-button');

      fireEvent.changeText(input, 'https://google.com');
      fireEvent.press(button);

      await waitFor(() => {
        expect(getAllByTestId('copy-button')).toHaveLength(1);
      });

      const copyButton = getAllByTestId('copy-button')[0];
      fireEvent.press(copyButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Error', 'Network error');
      });
    });
  });

  describe('Open URL Action', () => {
    it('should call resolveShortUrlUseCase and openUrlUseCase when opening', async () => {
      const mockResult = {
        alias: 'abc123',
        shortUrl: 'https://short.url/abc123',
        originalUrl: 'https://google.com',
      };

      (dependencies.shortenUrlUseCase.execute as jest.Mock).mockResolvedValue(
        mockResult,
      );
      (
        dependencies.resolveShortUrlUseCase.execute as jest.Mock
      ).mockResolvedValue('https://google.com');

      const { getByTestId, getAllByTestId } = render(
        <ShortenerScreenContainer />,
      );

      const input = getByTestId('url-input');
      const button = getByTestId('shorten-button');

      fireEvent.changeText(input, 'https://google.com');
      fireEvent.press(button);

      await waitFor(() => {
        expect(getAllByTestId('open-button')).toHaveLength(1);
      });

      const openButton = getAllByTestId('open-button')[0];
      fireEvent.press(openButton);

      await waitFor(() => {
        expect(
          dependencies.resolveShortUrlUseCase.execute,
        ).toHaveBeenCalledWith('https://short.url/abc123');
        expect(dependencies.openUrlUseCase.execute).toHaveBeenCalledWith(
          'https://google.com',
        );
      });
    });

    it('should show error alert when open fails', async () => {
      const mockResult = {
        alias: 'abc123',
        shortUrl: 'https://short.url/abc123',
        originalUrl: 'https://google.com',
      };

      (dependencies.shortenUrlUseCase.execute as jest.Mock).mockResolvedValue(
        mockResult,
      );
      (
        dependencies.resolveShortUrlUseCase.execute as jest.Mock
      ).mockRejectedValue(new Error('Cannot open URL'));

      const { getByTestId, getAllByTestId } = render(
        <ShortenerScreenContainer />,
      );

      const input = getByTestId('url-input');
      const button = getByTestId('shorten-button');

      fireEvent.changeText(input, 'https://google.com');
      fireEvent.press(button);

      await waitFor(() => {
        expect(getAllByTestId('open-button')).toHaveLength(1);
      });

      const openButton = getAllByTestId('open-button')[0];
      fireEvent.press(openButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Error', 'Cannot open URL');
      });
    });
  });

  describe('Loading States', () => {
    it('should show loading state while shortening', async () => {
      const mockResult = {
        alias: 'abc123',
        shortUrl: 'https://short.url/abc123',
        originalUrl: 'https://google.com',
      };

      (dependencies.shortenUrlUseCase.execute as jest.Mock).mockImplementation(
        () =>
          new Promise(resolve => setTimeout(() => resolve(mockResult), 100)),
      );

      const { getByTestId, getByText } = render(<ShortenerScreenContainer />);

      const input = getByTestId('url-input');
      const button = getByTestId('shorten-button');

      fireEvent.changeText(input, 'https://google.com');
      fireEvent.press(button);

      // Should show loading text
      expect(getByText('Shortening...')).toBeTruthy();

      await waitFor(() => {
        expect(getByText('Shorten')).toBeTruthy();
      });
    });
  });
});
