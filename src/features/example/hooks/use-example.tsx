import { useCallback } from 'react'
import { useBottomSheet } from '@/providers/overlay/use-bottom-sheet'
import { CreateExampleForm } from '../components/create-example-form'
import { useDeleteExample, useExamplesQuery } from './use-example-query'

/**
 * The feature "controller": owns ALL state, data and handlers. The view
 * (index.tsx) just renders what this returns — no logic in the JSX.
 */
export function useExample() {
  const { data: examples = [], isLoading, isRefetching, refetch } = useExamplesQuery()
  const deleteExample = useDeleteExample()
  const sheet = useBottomSheet()

  const onAdd = useCallback(() => {
    sheet.open({
      snapToContent: true,
      // Render fn → the form can close its own sheet via `close`.
      children: ({ close }) => <CreateExampleForm onDone={close} />,
    })
  }, [sheet])

  const onDelete = useCallback(
    (id: string) => {
      deleteExample.mutate(id)
    },
    [deleteExample],
  )

  return {
    examples,
    isLoading,
    isRefetching,
    refetch,
    onAdd,
    onDelete,
  }
}
