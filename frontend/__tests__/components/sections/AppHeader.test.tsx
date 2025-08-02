import { render, screen } from '@testing-library/react'
import AppHeader from '@/components/sections/AppHeader'

describe('AppHeader', () => {
  it('アプリタイトルが表示される', () => {
    render(<AppHeader />)
    
    expect(screen.getByText('タスク管理アプリ')).toBeInTheDocument()
  })

  it('h1タグでレンダリングされる', () => {
    render(<AppHeader />)
    
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent('タスク管理アプリ')
  })

  it('正しいスタイルクラスが適用される', () => {
    render(<AppHeader />)
    
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveClass('text-center', 'mb-8', 'font-bold')
  })
})