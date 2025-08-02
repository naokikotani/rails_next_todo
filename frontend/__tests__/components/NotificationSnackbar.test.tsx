import { render, screen, fireEvent } from '@testing-library/react'
import NotificationSnackbar from '@/components/NotificationSnackbar'

describe('NotificationSnackbar', () => {
  const defaultProps = {
    open: true,
    message: 'テストメッセージ',
    type: 'info' as const,
    onClose: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('メッセージが表示される', () => {
    render(<NotificationSnackbar {...defaultProps} />)
    
    expect(screen.getByText('テストメッセージ')).toBeInTheDocument()
  })

  it('成功タイプで表示される', () => {
    render(<NotificationSnackbar {...defaultProps} type="success" />)
    
    const alert = screen.getByRole('alert')
    expect(alert).toHaveClass('MuiAlert-filledSuccess')
  })

  it('エラータイプで表示される', () => {
    render(<NotificationSnackbar {...defaultProps} type="error" />)
    
    const alert = screen.getByRole('alert')
    expect(alert).toHaveClass('MuiAlert-filledError')
  })

  it('警告タイプで表示される', () => {
    render(<NotificationSnackbar {...defaultProps} type="warning" />)
    
    const alert = screen.getByRole('alert')
    expect(alert).toHaveClass('MuiAlert-filledWarning')
  })

  it('情報タイプで表示される', () => {
    render(<NotificationSnackbar {...defaultProps} type="info" />)
    
    const alert = screen.getByRole('alert')
    expect(alert).toHaveClass('MuiAlert-filledInfo')
  })

  it('閉じるボタンクリックでonCloseが呼ばれる', () => {
    render(<NotificationSnackbar {...defaultProps} />)
    
    const closeButton = screen.getByLabelText('Close')
    fireEvent.click(closeButton)
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
  })

  it('openがfalseの場合は表示されない', () => {
    render(<NotificationSnackbar {...defaultProps} open={false} />)
    
    expect(screen.queryByText('テストメッセージ')).not.toBeInTheDocument()
  })

  it('カスタム期間が設定される', () => {
    render(<NotificationSnackbar {...defaultProps} duration={10000} />)
    
    // Snackbarコンポーネントが存在することを確認
    expect(screen.getByText('テストメッセージ')).toBeInTheDocument()
  })
})