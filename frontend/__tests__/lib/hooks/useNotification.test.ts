import { renderHook, act } from '@testing-library/react'
import { useNotification } from '@/lib/hooks/useNotification'

describe('useNotification', () => {
  it('初期状態では通知はnull', () => {
    const { result } = renderHook(() => useNotification())
    
    expect(result.current.notification).toBeNull()
  })

  it('showSuccess で成功通知を表示', () => {
    const { result } = renderHook(() => useNotification())
    
    act(() => {
      result.current.showSuccess('成功メッセージ')
    })
    
    expect(result.current.notification).toEqual({
      message: '成功メッセージ',
      type: 'success',
      duration: undefined
    })
  })

  it('showError でエラー通知を表示', () => {
    const { result } = renderHook(() => useNotification())
    
    act(() => {
      result.current.showError('エラーメッセージ', 5000)
    })
    
    expect(result.current.notification).toEqual({
      message: 'エラーメッセージ',
      type: 'error',
      duration: 5000
    })
  })

  it('showWarning で警告通知を表示', () => {
    const { result } = renderHook(() => useNotification())
    
    act(() => {
      result.current.showWarning('警告メッセージ')
    })
    
    expect(result.current.notification).toEqual({
      message: '警告メッセージ',
      type: 'warning',
      duration: undefined
    })
  })

  it('showInfo で情報通知を表示', () => {
    const { result } = renderHook(() => useNotification())
    
    act(() => {
      result.current.showInfo('情報メッセージ')
    })
    
    expect(result.current.notification).toEqual({
      message: '情報メッセージ',
      type: 'info',
      duration: undefined
    })
  })

  it('clearNotification で通知をクリア', () => {
    const { result } = renderHook(() => useNotification())
    
    act(() => {
      result.current.showSuccess('成功メッセージ')
    })
    
    expect(result.current.notification).not.toBeNull()
    
    act(() => {
      result.current.clearNotification()
    })
    
    expect(result.current.notification).toBeNull()
  })

  it('新しい通知は前の通知を上書き', () => {
    const { result } = renderHook(() => useNotification())
    
    act(() => {
      result.current.showSuccess('最初のメッセージ')
    })
    
    expect(result.current.notification?.message).toBe('最初のメッセージ')
    
    act(() => {
      result.current.showError('2番目のメッセージ')
    })
    
    expect(result.current.notification?.message).toBe('2番目のメッセージ')
    expect(result.current.notification?.type).toBe('error')
  })
})