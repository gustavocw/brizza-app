// One texts file per screen/area (home.texts.ts, profile.texts.ts…). Each exports
// an object keyed by locale. Consume with useTexts(commonTexts).

const ptBR = {
  actions: { save: 'salvar', cancel: 'cancelar', confirm: 'confirmar', delete: 'excluir', retry: 'tentar de novo' },
  states: { loading: 'carregando…', empty: 'nada aqui ainda', error: 'algo deu errado' },
} as const

const enUS = {
  actions: { save: 'save', cancel: 'cancel', confirm: 'confirm', delete: 'delete', retry: 'try again' },
  states: { loading: 'loading…', empty: 'nothing here yet', error: 'something went wrong' },
} as const

export const commonTexts = { 'pt-BR': ptBR, 'en-US': enUS } as const
export type CommonTexts = typeof ptBR
