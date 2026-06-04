import { render, screen, fireEvent } from '@testing-library/react-native'
import { ExampleCard } from '../components/example-card'

describe('ExampleCard', () => {
  const example = { id: '1', title: 'comprar leite', done: false }

  it('renders the title', () => {
    render(<ExampleCard example={example} onDelete={() => {}} />)
    expect(screen.getByText('comprar leite')).toBeTruthy()
  })

  it('calls onDelete when Delete is pressed', () => {
    const onDelete = jest.fn()
    render(<ExampleCard example={example} onDelete={onDelete} />)
    fireEvent.press(screen.getByText('Delete'))
    expect(onDelete).toHaveBeenCalledTimes(1)
  })
})
