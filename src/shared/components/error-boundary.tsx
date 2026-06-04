import { Component, type ReactNode } from 'react'
import { View } from 'react-native'
import { Button } from '@/shared/components/ui/button'
import { Paragraph } from '@/shared/components/ui/paragraph'
import { Title } from '@/shared/components/ui/title'

type Props = { children: ReactNode; fallback?: ReactNode }
type State = { hasError: boolean }

/** Catches render errors below it and shows a recover screen. Wrap the navigator. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    console.error('[ErrorBoundary]', error)
  }

  reset = () => this.setState({ hasError: false })

  render() {
    if (!this.state.hasError) return this.props.children
    return (
      this.props.fallback ?? (
        <View className="flex-1 items-center justify-center gap-3 bg-background p-8">
          <Title className="text-center text-lg">Algo deu errado</Title>
          <Paragraph appear={false} className="text-center text-muted">
            Tente novamente.
          </Paragraph>
          <Button full={false} label="Recarregar" onPress={this.reset} />
        </View>
      )
    )
  }
}
