// エラータイプの定義
export enum ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export class AppError extends Error {
  public type: ErrorType
  public statusCode?: number
  public details?: any

  constructor(
    message: string,
    type: ErrorType = ErrorType.UNKNOWN_ERROR,
    statusCode?: number,
    details?: any
  ) {
    super(message)
    this.name = 'AppError'
    this.type = type
    this.statusCode = statusCode
    this.details = details
  }
}

// HTTPステータスコードからエラータイプを判定
export function getErrorTypeFromStatus(status: number): ErrorType {
  if (status >= 400 && status < 500) {
    switch (status) {
      case 400:
      case 422:
        return ErrorType.VALIDATION_ERROR
      case 401:
      case 403:
        return ErrorType.AUTHORIZATION_ERROR
      case 404:
        return ErrorType.NOT_FOUND_ERROR
      default:
        return ErrorType.VALIDATION_ERROR
    }
  }
  
  if (status >= 500) {
    return ErrorType.SERVER_ERROR
  }

  return ErrorType.UNKNOWN_ERROR
}

// エラーメッセージの日本語化
export function getErrorMessage(error: AppError): string {
  switch (error.type) {
    case ErrorType.NETWORK_ERROR:
      return 'ネットワークエラーが発生しました。インターネット接続を確認してください。'
    case ErrorType.VALIDATION_ERROR:
      return error.message || '入力内容に問題があります。'
    case ErrorType.AUTHORIZATION_ERROR:
      return 'アクセス権限がありません。'
    case ErrorType.NOT_FOUND_ERROR:
      return 'リソースが見つかりません。'
    case ErrorType.SERVER_ERROR:
      return 'サーバーエラーが発生しました。しばらく時間をおいてから再試行してください。'
    default:
      return '予期しないエラーが発生しました。'
  }
}

// APIエラーレスポンスを解析してAppErrorを作成
export async function parseApiError(response: Response): Promise<AppError> {
  const errorType = getErrorTypeFromStatus(response.status)
  
  try {
    const errorData = await response.json()
    const message = errorData.message || errorData.error || 'APIエラー'
    return new AppError(message, errorType, response.status, errorData)
  } catch {
    // レスポンスがJSONでない場合
    const message = `HTTP ${response.status}: ${response.statusText}`
    return new AppError(message, errorType, response.status)
  }
}

// ネットワークエラーの判定
export function isNetworkError(error: any): boolean {
  return (
    error instanceof TypeError &&
    (error.message.includes('fetch') || 
     error.message.includes('network') ||
     error.message.includes('Failed to fetch'))
  )
}