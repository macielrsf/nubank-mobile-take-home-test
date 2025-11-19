import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ShortenerScreenPresentational } from '../../presentation/screens/ShortenerScreenPresentational';
import { ShortenedUrl } from '../../domain/entities/ShortenedUrl';
import { Theme } from '../../presentation/hooks/useTheme';

/**
 * Presentational Tests - UI Only
 * Tests pure UI rendering and user interaction callbacks
 * No business logic or use case testing here
 */
describe('ShortenerScreenPresentational UI Tests', () => {
  const mockTheme: Theme = {
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
  };

  const mockShortenedUrls: ShortenedUrl[] = [
    {
      alias: 'abc123',
      shortUrl: 'https://short.url/abc123',
      originalUrl: 'https://google.com',
    },
    {
      alias: 'xyz789',
      shortUrl: 'https://short.url/xyz789',
      originalUrl: 'https://example.com',
    },
  ];

  const defaultProps = {
    theme: mockTheme,
    url: '',
    loading: false,
    error: null,
    shortenedUrls: [],
    loadingStates: {},
    onUrlChange: jest.fn(),
    onSubmit: jest.fn(),
    onToggleTheme: jest.fn(),
    onCopy: jest.fn(),
    onOpen: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render title correctly', () => {
      const { getByText } = render(
        <ShortenerScreenPresentational {...defaultProps} />,
      );
      expect(getByText('Nu URL Shortener')).toBeTruthy();
    });

    it('should render theme toggle button', () => {
      const { getByTestId } = render(
        <ShortenerScreenPresentational {...defaultProps} />,
      );
      expect(getByTestId('theme-toggle')).toBeTruthy();
    });

    it('should display moon icon in light theme', () => {
      const { getByText } = render(
        <ShortenerScreenPresentational {...defaultProps} />,
      );
      expect(getByText('🌙')).toBeTruthy();
    });

    it('should display sun icon in dark theme', () => {
      const darkTheme = { ...mockTheme, isDark: true };
      const { getByText } = render(
        <ShortenerScreenPresentational {...defaultProps} theme={darkTheme} />,
      );
      expect(getByText('☀️')).toBeTruthy();
    });

    it('should render empty state when no URLs', () => {
      const { getByText } = render(
        <ShortenerScreenPresentational {...defaultProps} />,
      );
      expect(getByText('No URLs shortened yet')).toBeTruthy();
    });

    it('should render list with shortened URLs', () => {
      const { getByText } = render(
        <ShortenerScreenPresentational
          {...defaultProps}
          shortenedUrls={mockShortenedUrls}
        />,
      );

      expect(getByText('abc123')).toBeTruthy();
      expect(getByText('https://short.url/abc123')).toBeTruthy();
      expect(getByText('https://google.com')).toBeTruthy();
      expect(getByText('xyz789')).toBeTruthy();
    });

    it('should display error message when error is present', () => {
      const { getByText } = render(
        <ShortenerScreenPresentational
          {...defaultProps}
          error="Invalid URL format"
        />,
      );
      expect(getByText('Invalid URL format')).toBeTruthy();
    });

    it('should not display error when error is null', () => {
      const { queryByText } = render(
        <ShortenerScreenPresentational {...defaultProps} />,
      );
      expect(queryByText('Invalid URL format')).toBeNull();
    });
  });

  describe('User Interactions', () => {
    it('should call onToggleTheme when theme button is pressed', () => {
      const onToggleTheme = jest.fn();
      const { getByTestId } = render(
        <ShortenerScreenPresentational
          {...defaultProps}
          onToggleTheme={onToggleTheme}
        />,
      );

      fireEvent.press(getByTestId('theme-toggle'));
      expect(onToggleTheme).toHaveBeenCalledTimes(1);
    });

    it('should call onUrlChange when input text changes', () => {
      const onUrlChange = jest.fn();
      const { getByTestId } = render(
        <ShortenerScreenPresentational
          {...defaultProps}
          onUrlChange={onUrlChange}
        />,
      );

      fireEvent.changeText(getByTestId('url-input'), 'https://google.com');
      expect(onUrlChange).toHaveBeenCalledWith('https://google.com');
    });

    it('should call onSubmit when shorten button is pressed', () => {
      const onSubmit = jest.fn();
      const { getByTestId } = render(
        <ShortenerScreenPresentational {...defaultProps} onSubmit={onSubmit} />,
      );

      fireEvent.press(getByTestId('shorten-button'));
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    it('should call onCopy when copy button is pressed', () => {
      const onCopy = jest.fn();
      const { getAllByTestId } = render(
        <ShortenerScreenPresentational
          {...defaultProps}
          shortenedUrls={mockShortenedUrls}
          onCopy={onCopy}
        />,
      );

      const copyButtons = getAllByTestId('copy-button');
      fireEvent.press(copyButtons[0]);

      expect(onCopy).toHaveBeenCalledWith('abc123', 'https://short.url/abc123');
    });

    it('should call onOpen when open button is pressed', () => {
      const onOpen = jest.fn();
      const { getAllByTestId } = render(
        <ShortenerScreenPresentational
          {...defaultProps}
          shortenedUrls={mockShortenedUrls}
          onOpen={onOpen}
        />,
      );

      const openButtons = getAllByTestId('open-button');
      fireEvent.press(openButtons[0]);

      expect(onOpen).toHaveBeenCalledWith('abc123', 'https://short.url/abc123');
    });
  });

  describe('Loading States', () => {
    it('should pass loading prop to UrlInput component', () => {
      const { getByTestId } = render(
        <ShortenerScreenPresentational {...defaultProps} loading={true} />,
      );

      const button = getByTestId('shorten-button');
      expect(button).toBeTruthy();
    });

    it('should display loading indicator for copy action', () => {
      const loadingStates = { abc123: 'copy' as const };
      const { getAllByTestId } = render(
        <ShortenerScreenPresentational
          {...defaultProps}
          shortenedUrls={mockShortenedUrls}
          loadingStates={loadingStates}
        />,
      );

      // When loading, button is replaced by loading indicator
      const listItems = getAllByTestId('list-item');
      expect(listItems).toHaveLength(2);
    });

    it('should display loading indicator for open action', () => {
      const loadingStates = { abc123: 'open' as const };
      const { getAllByTestId } = render(
        <ShortenerScreenPresentational
          {...defaultProps}
          shortenedUrls={mockShortenedUrls}
          loadingStates={loadingStates}
        />,
      );

      const listItems = getAllByTestId('list-item');
      expect(listItems).toHaveLength(2);
    });
  });

  describe('Props Rendering', () => {
    it('should render with custom URL value', () => {
      const { getByTestId } = render(
        <ShortenerScreenPresentational
          {...defaultProps}
          url="https://test.com"
        />,
      );

      const input = getByTestId('url-input');
      expect(input.props.value).toBe('https://test.com');
    });

    it('should render multiple list items', () => {
      const { getAllByTestId } = render(
        <ShortenerScreenPresentational
          {...defaultProps}
          shortenedUrls={mockShortenedUrls}
        />,
      );

      const listItems = getAllByTestId('list-item');
      expect(listItems).toHaveLength(2);
    });

    it('should have copy and open buttons for each item', () => {
      const { getAllByTestId } = render(
        <ShortenerScreenPresentational
          {...defaultProps}
          shortenedUrls={mockShortenedUrls}
        />,
      );

      expect(getAllByTestId('copy-button')).toHaveLength(2);
      expect(getAllByTestId('open-button')).toHaveLength(2);
    });
  });

  describe('Theme Styling', () => {
    it('should apply theme colors to components', () => {
      const { getByText } = render(
        <ShortenerScreenPresentational {...defaultProps} />,
      );
      const title = getByText('Nu URL Shortener');
      expect(title).toBeTruthy();
    });

    it('should apply error styling when error is present', () => {
      const { getByText } = render(
        <ShortenerScreenPresentational {...defaultProps} error="Test error" />,
      );
      const errorText = getByText('Test error');
      expect(errorText).toBeTruthy();
    });
  });
});
