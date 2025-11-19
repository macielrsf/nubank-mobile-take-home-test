import { useState } from 'react';
import { useColorScheme } from 'react-native';

export interface Theme {
  isDark: boolean;
  colors: {
    primary: string;
    background: string;
    card: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    errorBackground: string;
    success: string;
    inputBackground: string;
    inputBorder: string;
  };
}

const lightTheme: Theme = {
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

const darkTheme: Theme = {
  isDark: true,
  colors: {
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
  },
};

export const useTheme = () => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>(
    'system',
  );

  const getCurrentTheme = (): Theme => {
    if (themeMode === 'system') {
      return systemColorScheme === 'dark' ? darkTheme : lightTheme;
    }
    return themeMode === 'dark' ? darkTheme : lightTheme;
  };

  const theme = getCurrentTheme();

  const toggleTheme = () => {
    setThemeMode(prev => {
      if (prev === 'system' || prev === 'light') {
        return 'dark';
      }
      return 'light';
    });
  };

  const setTheme = (mode: 'light' | 'dark' | 'system') => {
    setThemeMode(mode);
  };

  return {
    theme,
    themeMode,
    toggleTheme,
    setTheme,
  };
};
