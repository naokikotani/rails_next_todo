import { renderHook, act } from '@testing-library/react'
import { useLoading } from '@/lib/hooks/useLoading'

describe('useLoading', () => {
  it('初期状態はfalse', () => {
    const { result } = renderHook(() => useLoading())
    
    expect(result.current.isLoading).toBe(false)
  })

  it('初期状態をtrueに設定可能', () => {
    const { result } = renderHook(() => useLoading(true))
    
    expect(result.current.isLoading).toBe(true)
  })

  it('startLoading でローディング開始', () => {
    const { result } = renderHook(() => useLoading())
    
    act(() => {
      result.current.startLoading()
    })
    
    expect(result.current.isLoading).toBe(true)
  })

  it('stopLoading でローディング停止', () => {
    const { result } = renderHook(() => useLoading(true))
    
    act(() => {
      result.current.stopLoading()
    })
    
    expect(result.current.isLoading).toBe(false)
  })

  it('toggleLoading でローディング状態を切り替え', () => {
    const { result } = renderHook(() => useLoading())
    
    act(() => {
      result.current.toggleLoading()
    })
    
    expect(result.current.isLoading).toBe(true)
    
    act(() => {
      result.current.toggleLoading()
    })
    
    expect(result.current.isLoading).toBe(false)
  })

  it('withLoading で非同期処理のローディング状態を自動管理', async () => {
    const { result } = renderHook(() => useLoading())
    const mockAsyncFunction = jest.fn().mockResolvedValue('結果')
    
    expect(result.current.isLoading).toBe(false)
    
    let result_value: string
    
    await act(async () => {
      result_value = await result.current.withLoading(mockAsyncFunction)
    })
    
    // 非同期処理完了後はローディング停止
    expect(result.current.isLoading).toBe(false)
    expect(result_value!).toBe('結果')
    expect(mockAsyncFunction).toHaveBeenCalledTimes(1)
  })

  it('withLoading でエラーが発生してもローディング状態は停止', async () => {
    const { result } = renderHook(() => useLoading())
    const mockAsyncFunction = jest.fn().mockRejectedValue(new Error('エラー'))
    
    let error: Error | null = null
    
    await act(async () => {
      try {
        await result.current.withLoading(mockAsyncFunction)
      } catch (e) {
        error = e as Error
      }
    })
    
    expect(result.current.isLoading).toBe(false)
    expect(error?.message).toBe('エラー')
    expect(mockAsyncFunction).toHaveBeenCalledTimes(1)
  })
})