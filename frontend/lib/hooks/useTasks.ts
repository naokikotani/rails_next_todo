import { useState, useEffect, useCallback, useMemo } from 'react'
import { Task, Priority, TaskFilters, PaginationInfo, TasksResponse } from '@/lib/types'
import { tasksApi } from '@/lib/api'
import { useNotification } from './useNotification'
import { useLoading } from './useLoading'
import { useErrorHandler } from './useErrorHandler'
import { SUCCESS_MESSAGES, ERROR_MESSAGES, PAGINATION_CONFIG } from '@/lib/constants'

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const { isLoading: loading, withLoading } = useLoading(true)
  const { showSuccess, ...notification } = useNotification()
  const { handleError } = useErrorHandler()
  const [filters, setFilters] = useState<TaskFilters>({})
  const [pagination, setPagination] = useState<PaginationInfo>({
    current_page: 1,
    total_pages: 1,
    total_count: 0,
    per_page: PAGINATION_CONFIG.DEFAULT_PER_PAGE,
    next_page: null,
    prev_page: null
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(PAGINATION_CONFIG.DEFAULT_PER_PAGE)

  // タスク一覧の読み込み
  const loadTasks = useCallback(async () => {
    try {
      const data: TasksResponse = await withLoading(() => 
        tasksApi.getTasks(filters, currentPage, perPage)
      )
      setTasks(data.tasks)
      setPagination(data.pagination)
    } catch (err) {
      handleError(err, 'タスク一覧の読み込み', ERROR_MESSAGES.TASK_FETCH_FAILED)
    }
  }, [filters, currentPage, perPage, withLoading])

  // 初回読み込みと依存関係の変更時に実行
  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  // フィルター変更ハンドラー
  const handleFiltersChange = useCallback((newFilters: TaskFilters) => {
    setFilters(newFilters)
    setCurrentPage(1) // フィルター変更時は1ページ目に戻る
  }, [])

  // ページ変更ハンドラー
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  // 表示件数変更ハンドラー
  const handlePerPageChange = useCallback((newPerPage: number) => {
    setPerPage(newPerPage)
    setCurrentPage(1) // 表示件数変更時は1ページ目に戻る
  }, [])

  // タスク作成
  const createTask = useCallback(async (
    title: string,
    description: string,
    priority: Priority,
    images?: File[]
  ) => {
    try {
      await tasksApi.createTask({
        title,
        description,
        completed: false,
        priority,
      }, images)
      showSuccess(SUCCESS_MESSAGES.TASK_CREATED)
      await loadTasks() // データを再読み込み
    } catch (err) {
      handleError(err, 'タスクの作成', ERROR_MESSAGES.TASK_CREATE_FAILED)
    }
  }, [loadTasks])

  // タスクの完了状態切り替え
  const toggleTask = useCallback(async (id: number, completed: boolean) => {
    try {
      await tasksApi.updateTask(id, { completed })
      await loadTasks() // データを再読み込み
    } catch (err) {
      handleError(err, 'タスクの更新', ERROR_MESSAGES.TASK_UPDATE_FAILED)
    }
  }, [loadTasks])

  // タスク削除
  const deleteTask = useCallback(async (id: number) => {
    try {
      await tasksApi.deleteTask(id)
      showSuccess(SUCCESS_MESSAGES.TASK_DELETED)
      await loadTasks() // データを再読み込み
    } catch (err) {
      handleError(err, 'タスクの削除', ERROR_MESSAGES.TASK_DELETE_FAILED)
    }
  }, [loadTasks])

  return useMemo(() => ({
    // 状態
    tasks,
    loading,
    filters,
    pagination,
    currentPage,
    perPage,
    
    // アクション
    loadTasks,
    createTask,
    toggleTask,
    deleteTask,
    handleFiltersChange,
    handlePageChange,
    handlePerPageChange,
    
    // 通知
    ...notification,
  }), [
    tasks,
    loading,
    filters,
    pagination,
    currentPage,
    perPage,
    loadTasks,
    createTask,
    toggleTask,
    deleteTask,
    handleFiltersChange,
    handlePageChange,
    handlePerPageChange,
    notification,
  ])
}