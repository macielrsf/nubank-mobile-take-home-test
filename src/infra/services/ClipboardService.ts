import Clipboard from '@react-native-clipboard/clipboard';
import { ClipboardService } from '../../domain/usecases/copyUrl';

export class ClipboardServiceImpl implements ClipboardService {
  copy(text: string): void {
    Clipboard.setString(text);
  }
}
