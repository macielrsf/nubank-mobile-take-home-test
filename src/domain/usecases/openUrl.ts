export interface OpenUrlUseCase {
  execute(url: string): Promise<void>;
}

export interface BrowserService {
  canOpen(url: string): Promise<boolean>;
  open(url: string): Promise<void>;
}

export class OpenUrl implements OpenUrlUseCase {
  constructor(private browserService: BrowserService) {}

  async execute(url: string): Promise<void> {
    const canOpen = await this.browserService.canOpen(url);
    if (!canOpen) {
      throw new Error('Cannot open URL');
    }
    await this.browserService.open(url);
  }
}
