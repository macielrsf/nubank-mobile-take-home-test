import { Linking } from 'react-native';
import { BrowserService } from '../../domain/usecases/openUrl';

export class BrowserServiceImpl implements BrowserService {
  async canOpen(url: string): Promise<boolean> {
    try {
      // Validate URL format - basic check for http/https
      const urlPattern = /^https?:\/\/.+/i;
      return urlPattern.test(url);
    } catch (error) {
      console.error('Error checking if URL can be opened:', error);
      return false;
    }
  }

  async open(url: string): Promise<void> {
    try {
      // Directly try to open the URL without canOpenURL check
      // canOpenURL on iOS can be restrictive and requires URL schemes to be in Info.plist
      // For http/https URLs, we can safely attempt to open them
      await Linking.openURL(url);
    } catch (error) {
      console.error('Error opening URL:', error);
      throw new Error('Failed to open URL in browser');
    }
  }
}
