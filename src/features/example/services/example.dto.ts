export type Example = {
  id: string
  title: string
  done: boolean
}

export type CreateExampleDto = {
  title: string
}

export type ListExamplesDto = {
  page?: number
  limit?: number
  search?: string
}
