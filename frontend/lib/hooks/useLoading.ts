import { useState, useCallback } from 'react'

export function useLoading(initialState = false) {
  const [isLoading, setIsLoading] = useState(initialState)

  const startLoading = useCallback(() => {
    setIsLoading(true)
  }, [])

  const stopLoading = useCallback(() => {
    setIsLoading(false)
  }, [])

  const toggleLoading = useCallback(() => {
    setIsLoading(prev => !prev)
  }, [])

  // 非同期処理を実行してローディング状態を自動管理
  const withLoading = useCallback(async <T>(
    asyncFunction: () => Promise<T>
  ): Promise<T> => {
    try {
      setIsLoading(true)
      return await asyncFunction()
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    isLoading,
    startLoading,
    stopLoading,
    toggleLoading,
    withLoading,
  }
}