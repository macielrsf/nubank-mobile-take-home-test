import '@testing-library/jest-native/extend-expect';

// Mock global fetch
global.fetch = jest.fn();
