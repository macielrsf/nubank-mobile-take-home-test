import { ShortenUrl } from '../domain/usecases/shortenUrl';
import { ResolveShortUrl } from '../domain/usecases/resolveShortUrl';
import { CopyUrl } from '../domain/usecases/copyUrl';
import { OpenUrl } from '../domain/usecases/openUrl';
import { UrlRepositoryImpl } from '../data/repositories/UrlRepository';
import { UrlResolverImpl } from '../data/repositories/UrlResolver';
import { UrlApi } from '../data/sources/UrlApi';
import { UrlResolverApiImpl } from '../data/sources/UrlResolverApi';
import { FetchHttpClient } from '../infra/http/apiClient';
import { ClipboardServiceImpl } from '../infra/services/ClipboardService';
import { BrowserServiceImpl } from '../infra/services/BrowserService';

export interface DependencyContainer {
  shortenUrlUseCase: ShortenUrl;
  resolveShortUrlUseCase: ResolveShortUrl;
  copyUrlUseCase: CopyUrl;
  openUrlUseCase: OpenUrl;
}

class DIContainer {
  private static instance: DIContainer;
  private container: DependencyContainer;

  private constructor() {
    // Infrastructure Layer
    const httpClient = new FetchHttpClient();
    const clipboardService = new ClipboardServiceImpl();
    const browserService = new BrowserServiceImpl();

    // Data Layer - Sources
    const urlApi = new UrlApi(httpClient);
    const urlResolverApi = new UrlResolverApiImpl(httpClient);

    // Data Layer - Repositories
    const urlRepository = new UrlRepositoryImpl(urlApi);
    const urlResolver = new UrlResolverImpl(urlResolverApi);

    // Domain Layer - Use Cases
    const shortenUrlUseCase = new ShortenUrl(urlRepository);
    const resolveShortUrlUseCase = new ResolveShortUrl(urlResolver);
    const copyUrlUseCase = new CopyUrl(clipboardService);
    const openUrlUseCase = new OpenUrl(browserService);

    this.container = {
      shortenUrlUseCase,
      resolveShortUrlUseCase,
      copyUrlUseCase,
      openUrlUseCase,
    };
  }

  public static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  public getDependencies(): DependencyContainer {
    return this.container;
  }
}

export const dependencies = DIContainer.getInstance().getDependencies();
