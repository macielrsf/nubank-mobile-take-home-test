import { Linking } from 'react-native';
import { BrowserService } from '../../domain/usecases/openUrl';

export class BrowserServiceImpl implements BrowserService {
  async canOpen(url: string): Promise<boolean> {
    return Linking.canOpenURL(url);
  }

  async open(url: string): Promise<void> {
    await Linking.openURL(url);
  }
}
