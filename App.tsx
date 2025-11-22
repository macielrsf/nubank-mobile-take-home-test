/**
 * Nubank Mobile Take-Home Test
 * URL Shortener Application
 */

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ShortenerScreenContainer } from './src/presentation/containers/ShortenerScreenContainer';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <ShortenerScreenContainer />
    </SafeAreaProvider>
  );
}

export default App;
