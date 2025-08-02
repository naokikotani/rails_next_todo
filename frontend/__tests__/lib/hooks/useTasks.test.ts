import { renderHook, act, waitFor } from '@testing-library/react'
import { useTasks } from '@/lib/hooks/useTasks'
import { tasksApi } from '@/lib/api'

// APIをモック化
jest.mock('@/lib/api', () => ({
  tasksApi: {
    getTasks: jest.fn(),
    createTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
  },
}))

const mockTasksApi = tasksApi as jest.Mocked<typeof tasksApi>

const mockTasksResponse = {
  tasks: [
    {
      id: 1,
      title: 'テストタスク1',
      description: '説明1',
      completed: false,
      priority: 'medium' as const,
      created_at: '2023-01-01',
      updated_at: '2023-01-01',
      images: [],
    },
    {
      id: 2,
      title: 'テストタスク2',
      description: '説明2',
      completed: true,
      priority: 'high' as const,
      created_at: '2023-01-02',
      updated_at: '2023-01-02',
      images: [],
    },
  ],
  pagination: {
    current_page: 1,
    total_pages: 1,
    total_count: 2,
    per_page: 10,
    next_page: null,
    prev_page: null,
  },
}

describe('useTasks', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('初期状態が正しく設定される', () => {
    mockTasksApi.getTasks.mockResolvedValue(mockTasksResponse)
    
    const { result } = renderHook(() => useTasks())
    
    expect(result.current.tasks).toEqual([])
    expect(result.current.loading).toBe(true)
    expect(result.current.currentPage).toBe(1)
    expect(result.current.perPage).toBe(10)
  })

  it('タスク一覧が正しく読み込まれる', async () => {
    mockTasksApi.getTasks.mockResolvedValue(mockTasksResponse)
    
    const { result } = renderHook(() => useTasks())
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    }, { timeout: 3000 })
    
    expect(result.current.tasks).toEqual(mockTasksResponse.tasks)
    expect(result.current.pagination).toEqual(mockTasksResponse.pagination)
    expect(mockTasksApi.getTasks).toHaveBeenCalledWith({}, 1, 10)
  })

  it('フィルター変更時にタスクが再読み込みされる', async () => {
    mockTasksApi.getTasks.mockResolvedValue(mockTasksResponse)
    
    const { result } = renderHook(() => useTasks())
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    
    const newFilters = { search: 'テスト', priority: 'high' as const }
    
    act(() => {
      result.current.handleFiltersChange(newFilters)
    })
    
    await waitFor(() => {
      expect(mockTasksApi.getTasks).toHaveBeenCalledWith(newFilters, 1, 10)
    })
  })

  it('ページ変更時にタスクが再読み込みされる', async () => {
    mockTasksApi.getTasks.mockResolvedValue(mockTasksResponse)
    
    const { result } = renderHook(() => useTasks())
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    
    act(() => {
      result.current.handlePageChange(2)
    })
    
    await waitFor(() => {
      expect(mockTasksApi.getTasks).toHaveBeenCalledWith({}, 2, 10)
    })
  })

  it('表示件数変更時にタスクが再読み込みされる', async () => {
    mockTasksApi.getTasks.mockResolvedValue(mockTasksResponse)
    
    const { result } = renderHook(() => useTasks())
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    
    act(() => {
      result.current.handlePerPageChange(20)
    })
    
    await waitFor(() => {
      expect(mockTasksApi.getTasks).toHaveBeenCalledWith({}, 1, 20)
    })
    
    expect(result.current.perPage).toBe(20)
    expect(result.current.currentPage).toBe(1) // 表示件数変更時は1ページ目に戻る
  })

  it('タスク作成が正しく実行される', async () => {
    const newTask = {
      id: 3,
      title: '新しいタスク',
      description: '新しい説明',
      completed: false,
      priority: 'low' as const,
      created_at: '2023-01-03',
      updated_at: '2023-01-03',
      images: [],
    }
    
    mockTasksApi.getTasks.mockResolvedValue(mockTasksResponse)
    mockTasksApi.createTask.mockResolvedValue(newTask)
    
    const { result } = renderHook(() => useTasks())
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    
    await act(async () => {
      await result.current.createTask('新しいタスク', '新しい説明', 'low')
    })
    
    expect(mockTasksApi.createTask).toHaveBeenCalledWith({
      title: '新しいタスク',
      description: '新しい説明',
      completed: false,
      priority: 'low',
    }, undefined)
  })

  it('タスク更新が正しく実行される', async () => {
    mockTasksApi.getTasks.mockResolvedValue(mockTasksResponse)
    mockTasksApi.updateTask.mockResolvedValue(mockTasksResponse.tasks[0])
    
    const { result } = renderHook(() => useTasks())
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    
    await act(async () => {
      await result.current.toggleTask(1, true)
    })
    
    expect(mockTasksApi.updateTask).toHaveBeenCalledWith(1, { completed: true })
  })

  it('タスク削除が正しく実行される', async () => {
    mockTasksApi.getTasks.mockResolvedValue(mockTasksResponse)
    mockTasksApi.deleteTask.mockResolvedValue(undefined)
    
    const { result } = renderHook(() => useTasks())
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    
    await act(async () => {
      await result.current.deleteTask(1)
    })
    
    expect(mockTasksApi.deleteTask).toHaveBeenCalledWith(1)
  })

  it('API エラー時にエラーハンドリングが実行される', async () => {
    const error = new Error('API エラー')
    mockTasksApi.getTasks.mockRejectedValue(error)
    
    const { result } = renderHook(() => useTasks())
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    
    // エラーが発生してもアプリケーションがクラッシュしないことを確認
    expect(result.current.tasks).toEqual([])
  })
})