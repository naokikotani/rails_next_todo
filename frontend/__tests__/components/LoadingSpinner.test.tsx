import { render, screen } from '@testing-library/react'
import LoadingSpinner from '@/components/LoadingSpinner'

describe('LoadingSpinner', () => {
  it('デフォルトメッセージで表示される', () => {
    render(<LoadingSpinner />)
    
    expect(screen.getByText('読み込み中...')).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('カスタムメッセージで表示される', () => {
    render(<LoadingSpinner message="カスタムメッセージ" />)
    
    expect(screen.getByText('カスタムメッセージ')).toBeInTheDocument()
  })

  it('メッセージなしで表示される', () => {
    render(<LoadingSpinner message="" />)
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
    expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument()
  })

  it('centeredバリアントで表示される', () => {
    render(<LoadingSpinner variant="centered" />)
    
    const container = screen.getByRole('progressbar').closest('div')
    expect(container).toHaveClass('flex-col')
  })

  it('inlineバリアントで表示される', () => {
    render(<LoadingSpinner variant="inline" />)
    
    const container = screen.getByRole('progressbar').closest('div')
    expect(container).toHaveClass('flex')
    expect(container).not.toHaveClass('flex-col')
  })

  it('カスタムサイズで表示される', () => {
    render(<LoadingSpinner size={60} />)
    
    const progressbar = screen.getByRole('progressbar')
    expect(progressbar).toBeInTheDocument()
  })

  it('カスタムクラスが適用される', () => {
    render(<LoadingSpinner className="custom-class" />)
    
    const container = screen.getByRole('progressbar').closest('div')
    expect(container).toHaveClass('custom-class')
  })
})