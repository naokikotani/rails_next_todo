import { useState, useEffect } from 'react'

// デバウンス（入力の遅延処理）のカスタムフック
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // タイマーを設定
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // クリーンアップ関数でタイマーをクリア
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}