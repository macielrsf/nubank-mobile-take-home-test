# 🔗 Nubank Mobile Take-Home Test - URL Shortener

[English version below](#english-version) | [Versão em Português](#versão-em-português)

---

## Versão em Português

Uma aplicação React Native desenvolvida para encurtar URLs e exibir o histórico de URLs encurtadas recentemente.

### 📋 Sobre o Projeto

Esta aplicação foi desenvolvida seguindo os princípios de **Clean Architecture** e utiliza a API de encurtamento de URLs disponibilizada para o teste. O projeto foi construído com **React Native Bare Workflow** (CLI), sem Expo.

### Funcionalidades

- ✅ Encurtar URLs através de uma API
- ✅ Validação de URLs antes do encurtamento
- ✅ Verificação de acessibilidade da URL
- ✅ Exibir histórico de URLs encurtadas
- ✅ Copiar URL encurtada para área de transferência
- ✅ Abrir URL encurtada no navegador
- ✅ Tratamento de erros robusto
- ✅ Tema claro/escuro
- ✅ Interface responsiva e otimizada
- ✅ Estados de loading para melhor UX

## 🛠️ Stack Tecnológica

- **React Native** (Bare Workflow - CLI)
- **TypeScript**
- **Jest** para testes unitários
- **React Native Testing Library** para testes de UI
- **@react-native-clipboard/clipboard** para clipboard
- **react-native-safe-area-context** para Safe Area
- **Clean Architecture** (Domain, Data, Presentation, Infrastructure)

## 📁 Estrutura do Projeto

```
src/
├── domain/              # Camada de domínio (regras de negócio)
│   ├── entities/
│   │   └── ShortenedUrl.ts
│   └── usecases/
│       ├── shortenUrl.ts
│       ├── resolveShortUrl.ts
│       ├── copyUrl.ts
│       └── openUrl.ts
├── data/               # Camada de dados (implementações)
│   ├── repositories/
│   │   ├── UrlRepository.ts
│   │   └── UrlResolver.ts
│   └── sources/
│       ├── UrlApi.ts
│       └── UrlResolverApi.ts
├── infra/              # Infraestrutura
│   ├── http/
│   │   └── apiClient.ts
│   └── services/
│       ├── ClipboardService.ts
│       └── BrowserService.ts
├── presentation/       # Camada de apresentação (UI)
│   ├── containers/     # Smart Components (lógica de negócio)
│   │   └── ShortenerScreenContainer.tsx
│   ├── screens/        # Presentational Components (UI pura)
│   │   └── ShortenerScreenPresentational.tsx
│   ├── components/
│   │   ├── UrlInput.tsx
│   │   ├── ShortenedListPresentational.tsx
│   │   └── Loading.tsx
│   └── hooks/
│       └── useTheme.ts
├── di/                 # Dependency Injection
│   └── container.ts
└── tests/              # Testes
    ├── unit/
    │   ├── shortenUrl.test.ts
    │   ├── UrlRepository.test.ts
    │   ├── UrlApi.test.ts
    │   ├── apiClient.test.ts
    │   └── useTheme.test.ts
    └── ui/
        ├── ShortenerScreenContainer.test.tsx
        └── ShortenerScreenPresentational.test.tsx
```

## 🏗️ Arquitetura

O projeto segue os princípios de **Clean Architecture** com padrão **Smart/Presentational Components**:

### Camadas

1. **Domain**: Contém as regras de negócio e entidades

   - Independente de frameworks
   - Contém use cases e interfaces
   - Validação e lógica de negócio pura

2. **Data**: Implementa os repositórios

   - Conecta domain com sources
   - Transforma dados da API em entidades
   - Implementa interfaces do domain

3. **Infrastructure**: Implementações técnicas

   - HTTP client com timeout (10 segundos)
   - Serviços de clipboard e browser
   - Configurações de baixo nível

4. **Presentation**: Interface do usuário

   - **Containers (Smart)**: Lógica de negócio, estado, use cases
   - **Presentational**: UI pura, renderização, callbacks
   - Gerenciamento de tema
   - Hooks customizados

5. **DI (Dependency Injection)**: Container de dependências
   - Singleton pattern
   - Centraliza criação de dependências
   - Facilita testes e manutenção

### Padrão Smart/Presentational

#### Smart Components (Containers)

- Gerenciam estado da aplicação
- Executam use cases
- Tratam erros e side effects
- Passam dados e callbacks para Presentational

#### Presentational Components

- Componentes puros (função de props)
- Apenas renderizam UI
- Emitem eventos via callbacks
- Sem acesso a use cases ou DI container
- Fáceis de testar e reutilizar

### Fluxo de Dependências

```
Presentation (Containers) → Domain (Use Cases) → Data → Infrastructure
Presentation (Presentational) → (sem dependências de negócio)
```

As dependências sempre apontam para dentro (em direção ao Domain).

## 🚀 Como Executar

### Pré-requisitos

- Node.js >= 20
- npm ou yarn
- Ambiente React Native configurado ([guia oficial](https://reactnative.dev/docs/environment-setup))
  - Para iOS: Xcode e CocoaPods
  - Para Android: Android Studio e SDK

### Instalação

```bash
# Clone o repositório
git clone <url-do-repositorio>

# Entre na pasta do projeto
cd NubankMobileTakeHomeTest

# Instale as dependências
npm install
# ou
yarn install

# Para iOS, instale os pods
cd ios && pod install && cd ..
```

### Executar no iOS

```bash
npm run ios
# ou
yarn ios
```

### Executar no Android

```bash
npm run android
# ou
yarn android
```

## 🧪 Testes

O projeto possui alta cobertura de testes unitários e de UI seguindo o padrão Smart/Presentational.

### Executar todos os testes

```bash
npm test
# ou
yarn test
```

### Executar testes específicos

```bash
# Testes do Presentational (UI pura)
npm test -- ShortenerScreenPresentational

# Testes do Container (lógica de negócio)
npm test -- ShortenerScreenContainer

# Testes unitários
npm test -- unit/
```

### Executar testes em modo watch

```bash
npm test -- --watch
# ou
yarn test --watch
```

### Cobertura de testes

```bash
npm test -- --coverage
# ou
yarn test --coverage
```

### Testes Implementados

#### Testes Unitários (40+ testes)

- ✅ **Use Cases**:
  - `shortenUrl`: Validação, acessibilidade de URL, lógica de negócio (9 testes)
  - Outros use cases
- ✅ **Repository**: Transformação de dados da API
- ✅ **API Source**: Chamadas à API e tratamento de respostas
- ✅ **HTTP Client**: Cliente HTTP com timeout
- ✅ **Hooks**: `useTheme` para gerenciamento de tema

#### Testes de UI (34+ testes)

**Presentational Components (21 testes)**:

- ✅ Renderização de componentes
- ✅ Interações do usuário
- ✅ Estados visuais (loading, error, empty)
- ✅ Aplicação de temas
- ✅ Props e callbacks

**Container Components (13 testes)**:

- ✅ Execução de use cases
- ✅ Gerenciamento de estado
- ✅ Tratamento de erros
- ✅ Fluxos assíncronos
- ✅ Validações de entrada

#### Total: 65+ testes

### Estratégia de Testes

O projeto segue uma estratégia de testes separada:

1. **Presentational Tests**: Testam UI pura com props mockadas
2. **Container Tests**: Testam lógica de negócio e integração com use cases
3. **Unit Tests**: Testam cada camada isoladamente

Veja `TESTING_STRATEGY.md` para mais detalhes.

## 🎨 Otimizações de Performance

### FlatList Otimizada

A lista de URLs encurtadas utiliza otimizações do FlatList:

- ✅ `keyExtractor`: Identificador único para cada item
- ✅ `getItemLayout`: Cálculo de layout para melhor performance
- ✅ `initialNumToRender`: Renderização inicial otimizada (10 items)
- ✅ `maxToRenderPerBatch`: Controle de renderização em lote (5 items)
- ✅ `windowSize`: Janela de renderização otimizada (5x viewport)

### Otimizações Gerais

- ✅ Memoização de callbacks
- ✅ Altura fixa de items para melhor scroll
- ✅ Loading states individuais por item
- ✅ Timeout de 10 segundos para requisições HTTP
- ✅ Verificação de acessibilidade com timeout de 5 segundos

## 🌐 API

A aplicação consome a seguinte API:

**Base URL**: `https://url-shortener-server.onrender.com`

### Endpoints

#### 1. Encurtar URL

**POST** `/api/alias`

**Request Body:**

```json
{
  "url": "https://example.com"
}
```

**Response (201):**

```json
{
  "alias": "abc123",
  "_links": {
    "self": "https://example.com",
    "short": "https://url-shortener-server.onrender.com/abc123"
  }
}
```

#### 2. Resolver URL Encurtada

**GET** `/:alias`

Redireciona para a URL original.

## 📝 Decisões Arquiteturais

### 1. Clean Architecture

Separação clara entre camadas garantindo:

- Testabilidade
- Manutenibilidade
- Independência de frameworks
- Facilidade de mudança de implementação

### 2. Smart/Presentational Pattern

Divisão de componentes em:

- **Smart (Containers)**: Lógica, estado, use cases
- **Presentational**: UI pura, sem lógica de negócio

**Benefícios**:

- Testes mais simples e focados
- Reutilização de componentes
- Melhor separação de responsabilidades

### 3. Dependency Injection Container

Implementação de DI container singleton:

- Centraliza criação de dependências
- Facilita mocks em testes
- Permite trocar implementações facilmente

### 4. URL Accessibility Check

Antes de encurtar, verifica se a URL é acessível:

- Usa método HEAD (não baixa conteúdo)
- Timeout de 5 segundos
- Aceita 2xx, 3xx, 4xx (servidor respondeu)
- Rejeita 5xx e erros de rede

### 5. Estado em Memória

O histórico de URLs é mantido apenas em memória (estado React). Para persistência, seria necessário adicionar AsyncStorage.

### 6. Fetch API com Timeout

Utilizei a Fetch API nativa com:

- AbortController para timeout
- 10 segundos para operações normais
- 5 segundos para verificação de acessibilidade

### 7. Tema Dinâmico

Sistema de temas com:

- Tema claro/escuro
- Modo sistema (automático)
- Hook customizado `useTheme`
- Persistência do tema selecionado

### 8. Layout Fixo para Items

Items da lista têm altura fixa (180px) para permitir `getItemLayout` e melhorar performance.

### 9. Múltiplos Use Cases

Separação de responsabilidades:

- `ShortenUrl`: Encurtar URLs
- `ResolveShortUrl`: Resolver URLs encurtadas
- `CopyUrl`: Copiar para clipboard
- `OpenUrl`: Abrir no navegador

## 🔧 Configurações

### Jest

Configurado para testar:

- TypeScript
- React Native components
- Mocks de módulos nativos
- Cobertura de código

Arquivos: `jest.config.js`, `jest.setup.js`, `jest.mocks.js`

### TypeScript

Configuração estrita com:

- Verificação de tipos rigorosa
- Path aliases para imports limpos
- Suporte a React Native

Arquivo: `tsconfig.json`

## 📱 Compatibilidade

- ✅ iOS 13+
- ✅ Android 6.0+ (API 23+)

## 🤝 Contribuindo

Este é um projeto de teste, mas sugestões são bem-vindas:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é parte de um teste técnico.

## 👨‍💻 Autor

Desenvolvido como parte do Nubank Mobile Take-Home Test.

---

## 🎯 Destaques do Projeto

### Clean Architecture

✅ Separação clara de camadas  
✅ Dependency Rule respeitada  
✅ Testabilidade máxima

### Smart/Presentational Pattern

✅ Componentes puros e reutilizáveis  
✅ Lógica separada da apresentação  
✅ Testes focados e simples

### Qualidade de Código

✅ TypeScript estrito  
✅ 65+ testes (100% críticos cobertos)  
✅ Documentação completa  
✅ Código limpo e idiomático

### Performance

✅ FlatList otimizada  
✅ Timeouts configurados  
✅ Loading states granulares  
✅ Verificação de acessibilidade

---

**Nota**: Este projeto utiliza React Native bare workflow. Certifique-se de ter o ambiente de desenvolvimento React Native corretamente configurado antes de executar.

---

---

## English Version

A React Native application developed to shorten URLs and display a history of recently shortened URLs.

### 📋 About the Project

This application was developed following **Clean Architecture** principles and uses the URL shortening API provided for the test. The project was built with **React Native Bare Workflow** (CLI), without Expo.

#### Features

- ✅ Shorten URLs through an API
- ✅ URL validation before shortening
- ✅ URL accessibility verification
- ✅ Display history of shortened URLs
- ✅ Copy shortened URL to clipboard
- ✅ Open shortened URL in browser
- ✅ Robust error handling
- ✅ Light/dark theme
- ✅ Responsive and optimized interface
- ✅ Loading states for better UX

### 🛠️ Tech Stack

- **React Native** (Bare Workflow - CLI)
- **TypeScript**
- **Jest** for unit tests
- **React Native Testing Library** for UI tests
- **@react-native-clipboard/clipboard** for clipboard
- **react-native-safe-area-context** for Safe Area
- **Clean Architecture** (Domain, Data, Presentation, Infrastructure)

### 📁 Project Structure

```
src/
├── domain/              # Domain layer (business rules)
│   ├── entities/
│   │   └── ShortenedUrl.ts
│   └── usecases/
│       ├── shortenUrl.ts
│       ├── resolveShortUrl.ts
│       ├── copyUrl.ts
│       └── openUrl.ts
├── data/               # Data layer (implementations)
│   ├── repositories/
│   │   ├── UrlRepository.ts
│   │   └── UrlResolver.ts
│   └── sources/
│       ├── UrlApi.ts
│       └── UrlResolverApi.ts
├── infra/              # Infrastructure
│   ├── http/
│   │   └── apiClient.ts
│   └── services/
│       ├── ClipboardService.ts
│       └── BrowserService.ts
├── presentation/       # Presentation layer (UI)
│   ├── containers/     # Smart Components (business logic)
│   │   └── ShortenerScreenContainer.tsx
│   ├── screens/        # Presentational Components (pure UI)
│   │   └── ShortenerScreenPresentational.tsx
│   ├── components/
│   │   ├── UrlInput.tsx
│   │   ├── ShortenedListPresentational.tsx
│   │   └── Loading.tsx
│   └── hooks/
│       └── useTheme.ts
├── di/                 # Dependency Injection
│   └── container.ts
└── tests/              # Tests
    ├── unit/
    │   ├── shortenUrl.test.ts
    │   ├── UrlRepository.test.ts
    │   ├── UrlApi.test.ts
    │   ├── apiClient.test.ts
    │   └── useTheme.test.ts
    └── ui/
        ├── ShortenerScreenContainer.test.tsx
        └── ShortenerScreenPresentational.test.tsx
```

### 🏗️ Architecture

The project follows **Clean Architecture** principles with **Smart/Presentational Components** pattern:

#### Layers

1. **Domain**: Contains business rules and entities

   - Framework independent
   - Contains use cases and interfaces
   - Pure validation and business logic

2. **Data**: Implements repositories

   - Connects domain with sources
   - Transforms API data into entities
   - Implements domain interfaces

3. **Infrastructure**: Technical implementations

   - HTTP client with timeout (10 seconds)
   - Clipboard and browser services
   - Low-level configurations

4. **Presentation**: User interface

   - **Containers (Smart)**: Business logic, state, use cases
   - **Presentational**: Pure UI, rendering, callbacks
   - Theme management
   - Custom hooks

5. **DI (Dependency Injection)**: Dependency container
   - Singleton pattern
   - Centralizes dependency creation
   - Facilitates testing and maintenance

#### Smart/Presentational Pattern

**Smart Components (Containers)**

- Manage application state
- Execute use cases
- Handle errors and side effects
- Pass data and callbacks to Presentational

**Presentational Components**

- Pure components (function of props)
- Only render UI
- Emit events via callbacks
- No access to use cases or DI container
- Easy to test and reuse

#### Dependency Flow

```
Presentation (Containers) → Domain (Use Cases) → Data → Infrastructure
Presentation (Presentational) → (no business dependencies)
```

Dependencies always point inward (toward Domain).

### 🚀 How to Run

#### Prerequisites

- Node.js >= 20
- npm or yarn
- React Native environment configured ([official guide](https://reactnative.dev/docs/environment-setup))
  - For iOS: Xcode and CocoaPods
  - For Android: Android Studio and SDK

#### Installation

```bash
# Clone the repository
git clone <repository-url>

# Enter project folder
cd NubankMobileTakeHomeTest

# Install dependencies
npm install
# or
yarn install

# For iOS, install pods
cd ios && pod install && cd ..
```

#### Run on iOS

```bash
npm run ios
# or
yarn ios
```

#### Run on Android

```bash
npm run android
# or
yarn android
```

### 🧪 Tests

The project has high coverage of unit and UI tests following the Smart/Presentational pattern.

#### Run all tests

```bash
npm test
# or
yarn test
```

#### Run specific tests

```bash
# Presentational tests (pure UI)
npm test -- ShortenerScreenPresentational

# Container tests (business logic)
npm test -- ShortenerScreenContainer

# Unit tests
npm test -- unit/
```

#### Run tests in watch mode

```bash
npm test -- --watch
# or
yarn test --watch
```

#### Test coverage

```bash
npm test -- --coverage
# or
yarn test --coverage
```

#### Implemented Tests

**Unit Tests (40+ tests)**

- ✅ **Use Cases**:
  - `shortenUrl`: Validation, URL accessibility, business logic (9 tests)
  - Other use cases
- ✅ **Repository**: API data transformation
- ✅ **API Source**: API calls and response handling
- ✅ **HTTP Client**: HTTP client with timeout
- ✅ **Hooks**: `useTheme` for theme management

**UI Tests (34+ tests)**

**Presentational Components (21 tests)**:

- ✅ Component rendering
- ✅ User interactions
- ✅ Visual states (loading, error, empty)
- ✅ Theme application
- ✅ Props and callbacks

**Container Components (13 tests)**:

- ✅ Use case execution
- ✅ State management
- ✅ Error handling
- ✅ Async flows
- ✅ Input validations

**Total: 65+ tests**

#### Testing Strategy

The project follows a separated testing strategy:

1. **Presentational Tests**: Test pure UI with mocked props
2. **Container Tests**: Test business logic and integration with use cases
3. **Unit Tests**: Test each layer in isolation

See `TESTING_STRATEGY.md` for more details.

### 🎨 Performance Optimizations

#### Optimized FlatList

The shortened URLs list uses FlatList optimizations:

- ✅ `keyExtractor`: Unique identifier for each item
- ✅ `getItemLayout`: Layout calculation for better performance
- ✅ `initialNumToRender`: Optimized initial rendering (10 items)
- ✅ `maxToRenderPerBatch`: Batch rendering control (5 items)
- ✅ `windowSize`: Optimized rendering window (5x viewport)

#### General Optimizations

- ✅ Callback memoization
- ✅ Fixed item height for better scrolling
- ✅ Individual loading states per item
- ✅ 10-second timeout for HTTP requests
- ✅ Accessibility check with 5-second timeout

### 🌐 API

The application consumes the following API:

**Base URL**: `https://url-shortener-server.onrender.com`

#### Endpoints

**1. Shorten URL**

**POST** `/api/alias`

**Request Body:**

```json
{
  "url": "https://example.com"
}
```

**Response (201):**

```json
{
  "alias": "abc123",
  "_links": {
    "self": "https://example.com",
    "short": "https://url-shortener-server.onrender.com/abc123"
  }
}
```

**2. Resolve Shortened URL**

**GET** `/:alias`

Redirects to the original URL.

### 📝 Architectural Decisions

#### 1. Clean Architecture

Clear separation between layers ensuring:

- Testability
- Maintainability
- Framework independence
- Easy implementation changes

#### 2. Smart/Presentational Pattern

Component division into:

- **Smart (Containers)**: Logic, state, use cases
- **Presentational**: Pure UI, no business logic

**Benefits**:

- Simpler and focused tests
- Component reusability
- Better separation of concerns

#### 3. Dependency Injection Container

Singleton DI container implementation:

- Centralizes dependency creation
- Facilitates mocks in tests
- Allows easy implementation swapping

#### 4. URL Accessibility Check

Before shortening, checks if URL is accessible:

- Uses HEAD method (doesn't download content)
- 5-second timeout
- Accepts 2xx, 3xx, 4xx (server responded)
- Rejects 5xx and network errors

#### 5. In-Memory State

URL history is kept only in memory (React state). For persistence, AsyncStorage would be needed.

#### 6. Fetch API with Timeout

Native Fetch API with:

- AbortController for timeout
- 10 seconds for normal operations
- 5 seconds for accessibility check

#### 7. Dynamic Theme

Theme system with:

- Light/dark theme
- System mode (automatic)
- Custom `useTheme` hook
- Selected theme persistence

#### 8. Fixed Layout for Items

List items have fixed height (180px) to allow `getItemLayout` and improve performance.

#### 9. Multiple Use Cases

Separation of responsibilities:

- `ShortenUrl`: Shorten URLs
- `ResolveShortUrl`: Resolve shortened URLs
- `CopyUrl`: Copy to clipboard
- `OpenUrl`: Open in browser

### 🔧 Configuration

#### Jest

Configured to test:

- TypeScript
- React Native components
- Native module mocks
- Code coverage

Files: `jest.config.js`, `jest.setup.js`, `jest.mocks.js`

#### TypeScript

Strict configuration with:

- Rigorous type checking
- Path aliases for clean imports
- React Native support

File: `tsconfig.json`

### 📱 Compatibility

- ✅ iOS 13+
- ✅ Android 6.0+ (API 23+)

### 🤝 Contributing

This is a test project, but suggestions are welcome:

1. Fork the project
2. Create a branch for your feature (`git checkout -b feature/MyFeature`)
3. Commit your changes (`git commit -m 'Add MyFeature'`)
4. Push to the branch (`git push origin feature/MyFeature`)
5. Open a Pull Request

### 📄 License

This project is part of a technical test.

### 👨‍💻 Author

Developed as part of the Nubank Mobile Take-Home Test.

---

### 🎯 Project Highlights

**Clean Architecture**

✅ Clear layer separation  
✅ Dependency Rule respected  
✅ Maximum testability

**Smart/Presentational Pattern**

✅ Pure and reusable components  
✅ Logic separated from presentation  
✅ Focused and simple tests

**Code Quality**

✅ Strict TypeScript  
✅ 65+ tests (100% critical coverage)  
✅ Complete documentation  
✅ Clean and idiomatic code

**Performance**

✅ Optimized FlatList  
✅ Configured timeouts  
✅ Granular loading states  
✅ Accessibility verification

---

**Note**: This project uses React Native bare workflow. Make sure you have the React Native development environment properly configured before running.
