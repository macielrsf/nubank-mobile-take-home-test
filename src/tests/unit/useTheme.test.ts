import { renderHook, act } from '@testing-library/react-native';
import { useColorScheme } from 'react-native';
import { useTheme } from '../../presentation/hooks/useTheme';

// Mock useColorScheme
jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('useTheme Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should start with system theme mode', () => {
      (useColorScheme as jest.Mock).mockReturnValue('light');

      const { result } = renderHook(() => useTheme());

      expect(result.current.themeMode).toBe('system');
      expect(result.current.theme.isDark).toBe(false);
    });

    it('should use dark theme when system is dark', () => {
      (useColorScheme as jest.Mock).mockReturnValue('dark');

      const { result } = renderHook(() => useTheme());

      expect(result.current.theme.isDark).toBe(true);
      expect(result.current.theme.colors.primary).toBe('#A855F7');
      expect(result.current.theme.colors.background).toBe('#121212');
    });

    it('should use light theme when system is light', () => {
      (useColorScheme as jest.Mock).mockReturnValue('light');

      const { result } = renderHook(() => useTheme());

      expect(result.current.theme.isDark).toBe(false);
      expect(result.current.theme.colors.primary).toBe('#820AD1');
      expect(result.current.theme.colors.background).toBe('#FFFFFF');
    });
  });

  describe('Toggle Theme', () => {
    it('should toggle from system/light to dark', () => {
      (useColorScheme as jest.Mock).mockReturnValue('light');

      const { result } = renderHook(() => useTheme());

      expect(result.current.theme.isDark).toBe(false);

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.themeMode).toBe('dark');
      expect(result.current.theme.isDark).toBe(true);
    });

    it('should toggle from dark to light', () => {
      (useColorScheme as jest.Mock).mockReturnValue('light');

      const { result } = renderHook(() => useTheme());

      // Toggle to dark
      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.themeMode).toBe('dark');

      // Toggle back to light
      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.themeMode).toBe('light');
      expect(result.current.theme.isDark).toBe(false);
    });
  });

  describe('Set Theme', () => {
    it('should set theme to light explicitly', () => {
      (useColorScheme as jest.Mock).mockReturnValue('dark');

      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme('light');
      });

      expect(result.current.themeMode).toBe('light');
      expect(result.current.theme.isDark).toBe(false);
    });

    it('should set theme to dark explicitly', () => {
      (useColorScheme as jest.Mock).mockReturnValue('light');

      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme('dark');
      });

      expect(result.current.themeMode).toBe('dark');
      expect(result.current.theme.isDark).toBe(true);
    });

    it('should set theme back to system', () => {
      (useColorScheme as jest.Mock).mockReturnValue('dark');

      const { result } = renderHook(() => useTheme());

      // Set to light
      act(() => {
        result.current.setTheme('light');
      });

      // Set back to system
      act(() => {
        result.current.setTheme('system');
      });

      expect(result.current.themeMode).toBe('system');
      expect(result.current.theme.isDark).toBe(true); // System is dark
    });
  });

  describe('Theme Colors', () => {
    it('should have correct light theme colors', () => {
      (useColorScheme as jest.Mock).mockReturnValue('light');

      const { result } = renderHook(() => useTheme());

      expect(result.current.theme.colors).toEqual({
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
      });
    });

    it('should have correct dark theme colors', () => {
      (useColorScheme as jest.Mock).mockReturnValue('dark');

      const { result } = renderHook(() => useTheme());

      expect(result.current.theme.colors).toEqual({
        primary: '#A855F7',
        background: '#121212',
        card: '#1E1E1E',
        text: '#FFFFFF',
        textSecondary: '#B0B0B0',
        border: '#2C2C2C',
        error: '#EF5350',
        errorBackground: '#3A1F1F',
        success: '#66BB6A',
        inputBackground: '#1E1E1E',
        inputBorder: '#3C3C3C',
      });
    });
  });

  describe('Theme Persistence', () => {
    it('should maintain manual theme selection regardless of system changes', () => {
      (useColorScheme as jest.Mock).mockReturnValue('light');

      const { result, rerender } = renderHook(() => useTheme());

      // Manually set to dark
      act(() => {
        result.current.setTheme('dark');
      });

      expect(result.current.theme.isDark).toBe(true);

      // Simulate system theme change
      (useColorScheme as jest.Mock).mockReturnValue('dark');
      rerender({});

      // Should still be dark (manual setting)
      expect(result.current.theme.isDark).toBe(true);
      expect(result.current.themeMode).toBe('dark');
    });

    it('should follow system theme changes when in system mode', () => {
      (useColorScheme as jest.Mock).mockReturnValue('light');

      const { result, rerender } = renderHook(() => useTheme());

      expect(result.current.theme.isDark).toBe(false);

      // Simulate system theme change
      (useColorScheme as jest.Mock).mockReturnValue('dark');
      rerender({});

      expect(result.current.theme.isDark).toBe(true);
    });
  });
});
