# Brizze

App mobile das motos elétricas Brizze (Minas Brisa). O usuário acompanha a moto pelo celular: bateria, autonomia, localização, estações de recarga e alertas.

> **Estágio (2026-09-14):** conta, perfil e suporte estão integrados na Brizze API. Moto, dashboard, estações e alertas rodam com **dados mockados no app** até a telemetria real do rastreador entrar (ver `docs/INTEGRACAO.md`).

## Funcionalidades

- **Login** por e-mail ou telefone + senha, ou Google (nativo). Apple fica escondido até o backend ligar `APPLE_CLIENT_IDS`.
- **Cadastro** completo (nome, e-mail, telefone, CPF, senha, endereço com busca de CEP), reativar conta excluída, esqueci a senha.
- **Moto** (aba inicial): foto, bateria, saúde da bateria, localização em mapa Google, odômetro, autonomia, velocidade média, CO₂, motor, próxima revisão, ficha técnica e checagens. Seletor de moto no header (4 motos mock).
- **Carregar**: mapa Google com balões de distância + lista; busca; card da estação com rota desenhada no mapa (Google Routes API); favoritos locais.
- **Alertas**: feed com paginação por cursor, marcar lida / todas, excluir (optimistic updates). Push registrado em `POST /user/me/devices` ao logar (entrega real exige Firebase no build).
- **Perfil**: foto (presign → Bunny), dados pessoais, trocar e-mail/telefone com código, verificar e-mail/telefone, preferências de notificação, alterar senha, sessões ativas, suporte (tickets), termos e privacidade, exportar dados (LGPD), excluir conta.
- Tab bar flutuante com 4 abas: **Moto, Carregar, Alertas, Perfil**.

## Stack

| Camada | Tecnologia |
| --- | --- |
| Runtime | Expo SDK 56, React Native 0.85, React 19.2 (New Architecture) |
| Navegação | expo-router (rotas por arquivo em `app/`) |
| Estilo | NativeWind 4 com tokens em `src/theme/tokens.js`; fonte Montserrat |
| Dados do servidor | TanStack Query 5 (`src/lib/query-keys.ts` centraliza as chaves) |
| Estado do cliente | Zustand (auth + moto selecionada, persistidos em AsyncStorage) |
| HTTP | axios (`src/lib/api.ts`): Bearer automático, refresh single-flight com rotação, bridge de 401 pra logout |
| Formulários | react-hook-form + zod |
| Mapas | react-native-maps (Google) + Google Routes API + Street View estático |
| Ícones / animação | iconsax, Reanimated 4, Lottie |
| Push | expo-notifications + expo-device |
| Qualidade | TypeScript, ESLint, Prettier, Jest |

## Arquitetura

- `app/` só roteia. Grupos `(public)` (sign-in, register, forgot-password, undelete), `(tabs)` (motorcycle, charge, alerts, profile) e `(private)` (edit-profile, change-password, change-contact/[kind], verify/[kind], notification-settings, sessions, support, legal/[kind], lgpd-export, link-bike).
- `src/features/<feature>/` é autocontida: `index.tsx` (view sem lógica), `hooks/` (controller `use<Feature>()` + queries/mutations), `services/` (`*.service.ts` chama a API e `*.dto.ts` tipa o contrato), `components/`.
- `src/shared/` guarda UI, hooks, stores, constantes e utils compartilhados. `src/providers/` compõe gesture handler, keyboard, safe area, Query, config, toast e overlays.

Convenções: leitura com `useQuery`, escrita com `useMutation`; services retornam `ApiResponse` (nunca lançam) e os hooks desembrulham; toda tela dentro de `<Screen>`; cor sempre via token; textos em pt-BR.

### O que é mock hoje

| Feature | Arquivo | Estado |
| --- | --- | --- |
| Lista/seleção de motos | `src/features/bike/services/bike.service.ts` | 4 motos canned (`Z1 City`, `Z1 Fun`, `Z1 Ventus`, `Z4`) com fotos em `assets/motos/` |
| Dashboard | `src/features/home/services/dashboard.service.ts` | snapshot canned por moto |
| Estações | `src/features/charge/services/charge.service.ts` | 8 estações posicionadas em offsets ao redor do usuário |
| Alertas | `src/features/alerts/services/notification.service.ts` | 5 notificações canned |
| Localização do usuário | `src/shared/hooks/use-user-location.ts` | geocodifica o endereço cadastrado (Nominatim) — provisório até o GPS da moto |

Os hooks e views já estão prontos pros endpoints reais (`GET /user/me/bike`, `/user/me/bike/status`, `/charging-stations`, `/user/me/notifications`); a troca é só no service.

## Como rodar

Requisitos: Node 20+, pnpm, ambiente nativo do Expo (Xcode / Android Studio). `react-native-maps`, câmera, notificações e Google Sign-In são módulos nativos — o app não roda no Expo Go.

```bash
pnpm install
cp .env.example .env      # preencher as chaves
pnpm ios    # ou pnpm android — o primeiro build gera ios/ e android/
```

| Variável | Para quê |
| --- | --- |
| `EXPO_PUBLIC_API_URL` | URL da Brizze API (`http://localhost:8080` no simulador iOS, `http://10.0.2.2:8080` no emulador Android, `https://brizze-api.fly.dev` em prod) |
| `GOOGLE_MAPS_API_KEY` | Maps SDK iOS/Android + Routes API + Street View Static |
| `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` | audience que o backend verifica no login Google |
| `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID` | exigido pelo `GoogleSignin.configure` no iOS |

Builds EAS (`eas.json`): perfis `development`, `preview` (APK) e `production` já injetam essas variáveis. Versão atual `1.0.20` (build 20).

## Scripts

| Comando | O que faz |
| --- | --- |
| `pnpm start` | Metro |
| `pnpm ios` / `pnpm android` | build nativo + roda |
| `pnpm typecheck` / `pnpm lint` / `pnpm test` | qualidade |
| `pnpm build:preview:android` | APK interno via EAS |
| `pnpm build:prod:ios` / `pnpm submit:ios` | loja |
