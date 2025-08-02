import { render, screen, fireEvent } from '@testing-library/react'
import SearchBar from '@/components/filters/SearchBar'

describe('SearchBar', () => {
  const mockOnChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('検索フィールドが表示される', () => {
    render(<SearchBar value="" onChange={mockOnChange} />)
    
    expect(screen.getByPlaceholderText('タスクを検索...')).toBeInTheDocument()
  })

  it('検索アイコンが表示される', () => {
    render(<SearchBar value="" onChange={mockOnChange} />)
    
    expect(screen.getByTestId('SearchIcon')).toBeInTheDocument()
  })

  it('値が正しく表示される', () => {
    render(<SearchBar value="テスト検索" onChange={mockOnChange} />)
    
    expect(screen.getByDisplayValue('テスト検索')).toBeInTheDocument()
  })

  it('入力変更時にonChangeが呼ばれる', () => {
    render(<SearchBar value="" onChange={mockOnChange} />)
    
    const input = screen.getByPlaceholderText('タスクを検索...')
    fireEvent.change(input, { target: { value: '新しい検索' } })
    
    expect(mockOnChange).toHaveBeenCalledWith('新しい検索')
  })
})