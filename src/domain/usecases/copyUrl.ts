export interface CopyUrlUseCase {
  execute(url: string): Promise<void>;
}

export interface ClipboardService {
  copy(text: string): void;
}

export class CopyUrl implements CopyUrlUseCase {
  constructor(private clipboardService: ClipboardService) {}

  async execute(url: string): Promise<void> {
    this.clipboardService.copy(url);
  }
}
