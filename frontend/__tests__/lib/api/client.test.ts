import { apiRequest, get, post, postFormData, put, del } from '@/lib/api/client'
import { AppError, ErrorType } from '@/lib/errors'

// fetchをモック化
global.fetch = jest.fn()

describe('API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('apiRequest', () => {
    it('正常なJSONレスポンスを処理', async () => {
      const mockResponse = {
        ok: true,
        headers: {
          get: jest.fn().mockReturnValue('application/json'),
        },
        json: jest.fn().mockResolvedValue({ data: 'test' }),
      }
      ;(fetch as jest.Mock).mockResolvedValue(mockResponse)

      const result = await apiRequest('http://test.com')

      expect(result).toEqual({ data: 'test' })
      expect(mockResponse.json).toHaveBeenCalledTimes(1)
    })

    it('Content-Typeがapplication/jsonでない場合はundefinedを返す', async () => {
      const mockResponse = {
        ok: true,
        headers: {
          get: jest.fn().mockReturnValue('text/plain'),
        },
      }
      ;(fetch as jest.Mock).mockResolvedValue(mockResponse)

      const result = await apiRequest('http://test.com')

      expect(result).toBeUndefined()
    })

    it('Content-Typeがnullの場合はundefinedを返す', async () => {
      const mockResponse = {
        ok: true,
        headers: {
          get: jest.fn().mockReturnValue(null),
        },
      }
      ;(fetch as jest.Mock).mockResolvedValue(mockResponse)

      const result = await apiRequest('http://test.com')

      expect(result).toBeUndefined()
    })

    it('HTTPエラーレスポンスでAppErrorをthrow', async () => {
      const mockResponse = {
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: jest.fn().mockResolvedValue({ message: 'バリデーションエラー' }),
      }
      ;(fetch as jest.Mock).mockResolvedValue(mockResponse)

      await expect(apiRequest('http://test.com')).rejects.toThrow(AppError)
    })

    it('ネットワークエラーでAppErrorをthrow', async () => {
      ;(fetch as jest.Mock).mockRejectedValue(new TypeError('Failed to fetch'))

      await expect(apiRequest('http://test.com')).rejects.toThrow(AppError)
    })
  })

  describe('get', () => {
    it('GETリクエストを正しく送信', async () => {
      const mockResponse = {
        ok: true,
        headers: {
          get: jest.fn().mockReturnValue('application/json'),
        },
        json: jest.fn().mockResolvedValue({ data: 'test' }),
      }
      ;(fetch as jest.Mock).mockResolvedValue(mockResponse)

      await get('/test')

      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/test', undefined)
    })

    it('クエリパラメータを正しく追加', async () => {
      const mockResponse = {
        ok: true,
        headers: {
          get: jest.fn().mockReturnValue('application/json'),
        },
        json: jest.fn().mockResolvedValue({}),
      }
      ;(fetch as jest.Mock).mockResolvedValue(mockResponse)

      await get('/test', { param1: 'value1', param2: 'value2' })

      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/test?param1=value1&param2=value2', undefined)
    })
  })

  describe('post', () => {
    it('POSTリクエストを正しく送信', async () => {
      const mockResponse = {
        ok: true,
        headers: {
          get: jest.fn().mockReturnValue('application/json'),
        },
        json: jest.fn().mockResolvedValue({}),
      }
      ;(fetch as jest.Mock).mockResolvedValue(mockResponse)

      await post('/test', { data: 'test' })

      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: 'test' }),
      })
    })
  })

  describe('postFormData', () => {
    it('FormDataでPOSTリクエストを送信', async () => {
      const mockResponse = {
        ok: true,
        headers: {
          get: jest.fn().mockReturnValue('application/json'),
        },
        json: jest.fn().mockResolvedValue({}),
      }
      ;(fetch as jest.Mock).mockResolvedValue(mockResponse)

      const formData = new FormData()
      formData.append('file', 'test')

      await postFormData('/test', formData)

      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/test', {
        method: 'POST',
        body: formData,
      })
    })
  })

  describe('put', () => {
    it('PUTリクエストを正しく送信', async () => {
      const mockResponse = {
        ok: true,
        headers: {
          get: jest.fn().mockReturnValue('application/json'),
        },
        json: jest.fn().mockResolvedValue({}),
      }
      ;(fetch as jest.Mock).mockResolvedValue(mockResponse)

      await put('/test', { data: 'test' })

      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/test', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: 'test' }),
      })
    })
  })

  describe('del', () => {
    it('DELETEリクエストを正しく送信', async () => {
      const mockResponse = {
        ok: true,
        headers: {
          get: jest.fn().mockReturnValue(null), // No Content-Type for DELETE
        },
      }
      ;(fetch as jest.Mock).mockResolvedValue(mockResponse)

      const result = await del('/test')

      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/test', {
        method: 'DELETE',
      })
      expect(result).toBeUndefined()
    })
  })
})