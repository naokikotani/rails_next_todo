import { renderHook, act } from '@testing-library/react'
import { useDebounce } from '@/lib/hooks/useDebounce'

// タイマーをモック化
describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('初期値が正しく設定される', () => {
    const { result } = renderHook(() => useDebounce('初期値', 500))
    
    expect(result.current).toBe('初期値')
  })

  it('値が変更されてもデバウンス期間中は更新されない', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: '初期値', delay: 500 } }
    )
    
    expect(result.current).toBe('初期値')
    
    // 値を変更
    rerender({ value: '新しい値', delay: 500 })
    
    // まだデバウンス期間中なので古い値のまま
    expect(result.current).toBe('初期値')
  })

  it('デバウンス期間経過後に値が更新される', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: '初期値', delay: 500 } }
    )
    
    expect(result.current).toBe('初期値')
    
    // 値を変更
    rerender({ value: '新しい値', delay: 500 })
    
    // デバウンス期間経過
    act(() => {
      jest.advanceTimersByTime(500)
    })
    
    expect(result.current).toBe('新しい値')
  })

  it('短期間で複数回値が変更された場合、最後の値のみが反映される', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: '初期値', delay: 500 } }
    )
    
    expect(result.current).toBe('初期値')
    
    // 短期間で複数回変更
    rerender({ value: '値1', delay: 500 })
    
    act(() => {
      jest.advanceTimersByTime(100)
    })
    
    rerender({ value: '値2', delay: 500 })
    
    act(() => {
      jest.advanceTimersByTime(100)
    })
    
    rerender({ value: '値3', delay: 500 })
    
    // デバウンス期間経過
    act(() => {
      jest.advanceTimersByTime(500)
    })
    
    // 最後の値のみが反映される
    expect(result.current).toBe('値3')
  })

  it('異なるデバウンス期間を設定可能', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: '初期値', delay: 1000 } }
    )
    
    rerender({ value: '新しい値', delay: 1000 })
    
    // 500ms経過（まだ更新されない）
    act(() => {
      jest.advanceTimersByTime(500)
    })
    
    expect(result.current).toBe('初期値')
    
    // 1000ms経過（更新される）
    act(() => {
      jest.advanceTimersByTime(500)
    })
    
    expect(result.current).toBe('新しい値')
  })
})