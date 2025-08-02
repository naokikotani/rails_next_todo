import { AppError, ErrorType, parseApiError, isNetworkError } from '@/lib/errors'

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

// APIリクエストのラッパー関数
export async function apiRequest<T>(
  url: string, 
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, options)
    
    if (!response.ok) {
      throw await parseApiError(response)
    }
    
    // レスポンスボディが空の場合（204 No Content等）は何も返さない
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      return undefined as T
    }
    
    return response.json()
  } catch (error) {
    if (isNetworkError(error)) {
      throw new AppError(
        'ネットワークエラーが発生しました',
        ErrorType.NETWORK_ERROR
      )
    }
    throw error
  }
}

// GET リクエスト用のヘルパー
export async function get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${API_URL}${endpoint}`)
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value)
    })
  }
  
  return apiRequest<T>(url.toString())
}

// POST リクエスト用のヘルパー
export async function post<T>(endpoint: string, data?: any): Promise<T> {
  return apiRequest<T>(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: data ? JSON.stringify(data) : undefined,
  })
}

// POST リクエスト（FormData）用のヘルパー
export async function postFormData<T>(endpoint: string, formData: FormData): Promise<T> {
  return apiRequest<T>(`${API_URL}${endpoint}`, {
    method: 'POST',
    body: formData,
  })
}

// PUT リクエスト用のヘルパー
export async function put<T>(endpoint: string, data?: any): Promise<T> {
  return apiRequest<T>(`${API_URL}${endpoint}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: data ? JSON.stringify(data) : undefined,
  })
}

// DELETE リクエスト用のヘルパー
export async function del<T>(endpoint: string): Promise<T> {
  return apiRequest<T>(`${API_URL}${endpoint}`, {
    method: 'DELETE',
  })
}
