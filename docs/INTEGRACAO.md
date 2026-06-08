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
- Caução: o gate exige `coverage_deposit_paid` mas não há endpoint de pagamento no contrato. Como é setado?
- Apple: não existe `/auth/apple` (só Google). O botão Apple fica sem backend.
- Reativar conta: `POST /auth/undelete` existe, dá pra oferecer no login após exclusão.

## 5. Sequência

1. Fase 1: recarga, preferências de notificação, trocar senha, recuperar senha.
2. Fase 2: editar perfil, foto, email ou telefone, sessões, suporte.
3. Fase 3: vincular moto + telemetria real no Dashboard e na Moto.
4. Fase 4: cadastro + verificação + termos (destrava o gate).
5. Fase 5: Google, push, undelete.
