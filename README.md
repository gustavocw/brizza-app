# Brizze

App mobile das motos elétricas Brizze. O usuário acompanha a moto pelo celular: bateria, autonomia, localização e carregamento. Tudo em poucos toques.

> **Estágio:** MVP com dados mockados. A telemetria real da moto (bateria e GPS) é a integração que falta fechar.

## Funcionalidades

- **Login** por CPF e senha, ou pelo Google e pela Apple.
- **Dashboard** com nível de bateria, autonomia estimada, status do motor e total rodado.
- **Localização** da moto no mapa do Google, com o endereço atual.
- **Navegação por abas** numa tab bar flutuante (Início, Moto, Carregar, Alertas, Perfil).

Hoje tudo roda com dados simulados. A troca pela GoBrisa API acontece nos services de cada feature.

## Stack

| Camada | Tecnologia |
| --- | --- |
| Runtime | Expo SDK 56, React Native 0.85, React 19.2 (New Architecture) |
| Navegação | expo-router 6 (roteamento por arquivos) |
| Estilo | NativeWind com tokens em fonte única |
| Dados do servidor | TanStack Query |
| Estado do cliente | Zustand |
| HTTP | axios |
| Formulários | react-hook-form e zod |
| Mapas | react-native-maps (Google) |
| Ícones | iconsax |
| Tipografia | DM Sans e DM Mono |
| Animação | Reanimated |
| Qualidade | TypeScript, ESLint, Prettier e Jest |

## Arquitetura

Cada parte tem um lugar.

- `app/` cuida só do roteamento. Cada arquivo importa uma feature e a renderiza.
- `src/features/<feature>/` é autocontida. A view (`index.tsx`) não tem lógica. Ela vive toda no controller (`use<Feature>()`), junto dos services e das queries.
- `src/shared/` guarda o que duas ou mais features usam: componentes de UI, hooks, stores e constantes.

Convenções que valem sempre. Leitura de dados usa `useQuery` e escrita usa `useMutation`. Toda tela fica dentro de `<Screen>`, então o teclado nunca cobre o input. Cor sai sempre de token, nunca de hex solto.

## Como rodar

Requisitos: Node 20 ou superior, pnpm, e o ambiente nativo do Expo (Xcode no iOS, Android Studio no Android).

1. Instale as dependências.

```bash
pnpm install
```

2. Crie o `.env` a partir do exemplo e preencha as chaves.

```bash
cp .env.example .env
```

| Variável | Para quê serve |
| --- | --- |
| `EXPO_PUBLIC_API_URL` | URL da GoBrisa API |
| `GOOGLE_MAPS_API_KEY` | Chave do Google Maps. Habilite "Maps SDK for Android" e "Maps SDK for iOS" |

3. Rode no simulador ou emulador. O primeiro build já gera os projetos nativos.

```bash
pnpm ios
# ou
pnpm android
```

O `react-native-maps` é módulo nativo, então o mapa aparece só depois desse build. Mudou alguma config nativa? Rode `pnpm prebuild` antes.

## Scripts

| Comando | O que faz |
| --- | --- |
| `pnpm start` | sobe o Metro |
| `pnpm ios` ou `pnpm android` | build nativo e roda no device |
| `pnpm run typecheck` | checagem de tipos com `tsc` |
| `pnpm run lint` | ESLint |
| `pnpm test` | testes com Jest |
| `pnpm run format` | Prettier |
| `pnpm run build:prod:ios` | build de produção iOS via EAS |
| `pnpm run build:prod:android` | build de produção Android via EAS |

## Estrutura

```
app/                 rotas do expo-router
  (public)/          login
  (tabs)/            abas autenticadas
src/
  features/          cada tela, autocontida
    auth/            login
    home/            dashboard
  shared/            ui, hooks, stores, constantes
  lib/               api, query client, query keys
  providers/         overlays, toast, config
  theme/             tokens, cores, fontes
```

## Marca

Verde primário `#1E6B41`, verde ação `#3AAD68`, verde noite `#0D2B1F`, fundo `#F7F8F6`. Para remarcar o app, edite `src/theme/tokens.js`.

## Licença

Veja o arquivo [LICENSE](LICENSE).
