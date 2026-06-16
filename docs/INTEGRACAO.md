# Plano de integração com a API

Relação do que já está integrado, do que está mockado e do que dá pra ligar na Brizza API,
com sequência sugerida. Base: 53 endpoints do contrato (`apidocs/openapi.yaml`) cruzados com
os serviços do app e uma sondagem ao vivo com o usuário admin.

## Regra de acesso (gate)

- Whitelist (funciona logo após login): `/auth/*`, `/verify/*`, `/user/me/*`.
- Negócio (`/charging-stations`): exige `(email ∨ telefone verificado) ∧ caução paga ∧ termos vigentes`.

## Estado atual

Integrado (real): login, refresh, logout, perfil (`GET/DELETE /user/me`), termos e privacidade
(`/legal/*`), alertas (`/user/me/notifications` + unread, read, read-all, delete).

Mockado: Dashboard (home), Carregar (charge), Moto (bike).

## 1. Dá pra integrar já (endpoints confirmados respondendo 200)

| Item | Endpoint(s) | Mudança no app | Esforço |
|---|---|---|---|
| Estações de recarga | `GET /charging-stations` + `/{id}/route` | troca o mock do charge | Baixo |
| Preferências de notificação | `GET/PUT /user/me/notification-preferences` | tela nova de ajustes | Baixo |
| Trocar senha | `PUT /user/me/password` | tela em Perfil | Baixo |
| Recuperar senha | `POST /auth/forgot-password` + `/reset-password` | liga o "Esqueci a senha" | Médio |
| Sessões ativas | `GET /auth/sessions` + `DELETE /auth/sessions/{id}` | tela "Segurança" | Médio |
| Editar perfil | `PUT /user/me` + `GET /address/lookup/{cep}` | liga "Dados pessoais" | Médio |
| Suporte (tickets) | `POST/GET /user/me/support/tickets` + `/{id}` | feature de suporte | Médio |
| Foto de perfil | `POST /user/me/photo/upload-url` + `/photo/confirm` | upload no avatar | Médio |
| Trocar email ou telefone | `POST /user/me/{email,phone}` + `/confirm` | telas em Perfil | Médio |

## 2. Integrável com dependência

| Item | Endpoint(s) | Dependência | Esforço |
|---|---|---|---|
| Telemetria (Dashboard + Moto) | `GET /user/me/bike` + `/bike/status` + `/bike/route` | exige moto vinculada (hoje 404 BIKE_NOT_LINKED), precisa do fluxo de vincular moto | Médio |
| Login Google | `POST /auth/google` | SDK nativo + Client IDs + dev build | Médio ou alto |
| Push real | `POST/GET/DELETE /user/me/devices` | Firebase ou FCM + expo-notifications + dev build | Alto |

Nota: o mock do dashboard cita `/vehicles/me/telemetry` (inexistente). O correto é `/user/me/bike/status`.
A telemetria segue mock no servidor (hardware pendente) mas a integração é real e vai ao vivo sozinha.

## 3. Onboarding (destrava o gate de negócio)

`POST /auth/register`, `/verify/request/{email,phone}` + `PUT /verify/{email,phone}`,
`POST /user/me/accept-terms`. Sem isso, usuário novo não acessa as estações.

## 4. Flags para o backend

- `ChargingStation` no OpenAPI está desatualizado: o contrato diz `price_brl` + `availability`,
  mas a API real retorna `price_per_kwh`, `total_slots`, `available_slots`, `is_open`, `city`, `state`.
  O app foi integrado pelo shape real; vale alinhar o contrato.
- `GET /user/me/export` (LGPD) documentado mas respondeu 404. Confirmar implementação.
- `POST /user/me/photo/upload-url` (foto de perfil) documentado mas responde 404. A tela está pronta no app; só falta implementar no backend.
- Caução: o gate exige `coverage_deposit_paid` mas não há endpoint de pagamento no contrato. Como é setado?
- Apple: não existe `/auth/apple` (só Google). O botão Apple fica sem backend.
- Reativar conta: `POST /auth/undelete` existe, dá pra oferecer no login após exclusão.

## 5. Sequência

1. Fase 1: recarga, preferências de notificação, trocar senha, recuperar senha.
2. Fase 2: editar perfil, foto, email ou telefone, sessões, suporte.
3. Fase 3: vincular moto + telemetria real no Dashboard e na Moto.
4. Fase 4: cadastro + verificação + termos (destrava o gate).
5. Fase 5: Google, push, undelete.

## 6. Atualização (2026-06-16): backend implementou os pendentes do PDF

Sondagem ao vivo em `https://brizza-api.fly.dev` (rotas na raiz, sem `/v1`; health em `/healthz`).

Integrado nesta rodada (app):

- **Foto de perfil:** fluxo presign confirmado no ar. `POST /user/me/photo/upload-url` →
  `{upload_url, photo_id, cdn_url}`; `PUT <upload_url>` bytes crus; `POST /user/me/photo/confirm`
  SEM body → `{photo_url}`. Storage é Bunny.net, máx 5 MB (guarda no app).
- **Export LGPD:** `GET /user/me/export` (alias `/user/me/lgpd-export`), JSON inline, rate limit 5/h.
  Nova feature `lgpd-export` (gera arquivo + share). Item "Exportar meus dados" no perfil.
- **Moto:** enum de status alinhado (`pending_activation|active|offline|charging|disabled`);
  "Localizar" abre direções até a moto. Telemetria do servidor segue MOCK; campos ricos
  (saúde, ciclos, specs) seguem em EXTRAS no app até a fonte real.
- **Push/Devices:** feature `push` (registra `fcm_token` em `POST /user/me/devices` ao logar).
  Cliente pronto; entrega real exige Firebase (ver pendências).

Pendências que continuam no backend / config externa:

- **Apple:** `POST /auth/apple` existe no código mas responde **404 em produção** porque só é
  montado quando `APPLE_CLIENT_IDS` está setado no ambiente. Backend precisa configurar o
  bundle ID no fly. Botão Apple no app segue sem ligar até lá.
- **Caução:** sem endpoint self-service. `coverage_deposit_paid` só via `PUT /admin/users/{id}`
  (admin) ou seed. Gateway é TBD. Sem isso o gate de negócio não destrava pelo app.
- **Telemetria real:** `mock_provider.go` no servidor (dados determinísticos). Aguarda hardware.
- **Push (Firebase):** entrega exige `google-services.json` (Android, via `android.googleServicesFile`)
  + chave APNs/Firebase (iOS). Sem isso o token não registra/entrega; o registro falha em silêncio
  (tratado) e o build segue normal.

Deps nativas adicionadas (exigem rebuild do dev client/APK): `expo-notifications`, `expo-device`,
`expo-file-system`, `expo-sharing`.
