/**
 * Nubank Mobile Take-Home Test
 * URL Shortener Application
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ShortenerScreenContainer } from './src/presentation/containers/ShortenerScreenContainer';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ShortenerScreenContainer />
    </SafeAreaProvider>
  );
}

export default App;
