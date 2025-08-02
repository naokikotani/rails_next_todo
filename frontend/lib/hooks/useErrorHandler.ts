import { useCallback } from 'react'
import { AppError, ErrorType, getErrorMessage, parseApiError, isNetworkError } from '@/lib/errors'
import { useNotification } from './useNotification'

export function useErrorHandler() {
  const { showError, showWarning } = useNotification()

  // エラーをログに記録（本番環境では外部サービスに送信）
  const logError = useCallback((error: AppError, context?: string) => {
    console.error('Application Error:', {
      message: error.message,
      type: error.type,
      statusCode: error.statusCode,
      details: error.details,
      context,
      timestamp: new Date().toISOString(),
    })
    
    // 本番環境では Sentry, LogRocket などの外部サービスに送信
    // if (process.env.NODE_ENV === 'production') {
    //   sentryCapture(error)
    // }
  }, [])

  // APIエラーを処理
  const handleApiError = useCallback(async (
    response: Response, 
    context?: string
  ): Promise<AppError> => {
    const appError = await parseApiError(response)
    logError(appError, context)
    
    const userMessage = getErrorMessage(appError)
    
    // エラータイプに応じて通知の種類を変更
    if (appError.type === ErrorType.VALIDATION_ERROR) {
      showWarning(userMessage)
    } else {
      showError(userMessage)
    }
    
    return appError
  }, [logError, showError, showWarning])

  // 一般的なエラーを処理
  const handleError = useCallback((
    error: any, 
    context?: string,
    userMessage?: string
  ): AppError => {
    let appError: AppError

    if (error instanceof AppError) {
      appError = error
    } else if (isNetworkError(error)) {
      appError = new AppError(
        'ネットワークエラー',
        ErrorType.NETWORK_ERROR
      )
    } else {
      appError = new AppError(
        error.message || '不明なエラー',
        ErrorType.UNKNOWN_ERROR
      )
    }

    logError(appError, context)
    
    const displayMessage = userMessage || getErrorMessage(appError)
    showError(displayMessage)
    
    return appError
  }, [logError, showError])

  // 非同期処理でのエラーハンドリング
  const withErrorHandling = useCallback(async <T>(
    asyncFunction: () => Promise<T>,
    context?: string,
    customErrorMessage?: string
  ): Promise<T | null> => {
    try {
      return await asyncFunction()
    } catch (error) {
      handleError(error, context, customErrorMessage)
      return null
    }
  }, [handleError])

  return {
    handleApiError,
    handleError,
    withErrorHandling,
    logError,
  }
}
