import mockClipboard from '@react-native-clipboard/clipboard/jest/clipboard-mock.js';

// Mock Clipboard
jest.mock('@react-native-clipboard/clipboard', () => mockClipboard);
