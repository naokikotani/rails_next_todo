import { useState, useEffect, useCallback } from 'react'
import { Task, Priority, TaskFilters, PaginationInfo, TasksResponse } from '@/lib/types'
import { api } from '@/lib/api'
import { useNotification } from './useNotification'

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const { showSuccess, showError, ...notification } = useNotification()
  const [filters, setFilters] = useState<TaskFilters>({})
  const [pagination, setPagination] = useState<PaginationInfo>({
    current_page: 1,
    total_pages: 1,
    total_count: 0,
    per_page: 10,
    next_page: null,
    prev_page: null
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)

  // タスク一覧の読み込み
  const loadTasks = useCallback(async () => {
    try {
      setLoading(true)
      const data: TasksResponse = await api.getTasks(filters, currentPage, perPage)
      setTasks(data.tasks)
      setPagination(data.pagination)
    } catch (err) {
      showError('タスクの取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }, [filters, currentPage, perPage, showError])

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
      await api.createTask({
        title,
        description,
        completed: false,
        priority,
      }, images)
      showSuccess('タスクを追加しました')
      await loadTasks() // データを再読み込み
    } catch (err) {
      showError('タスクの追加に失敗しました')
    }
  }, [loadTasks, showSuccess, showError])

  // タスクの完了状態切り替え
  const toggleTask = useCallback(async (id: number, completed: boolean) => {
    try {
      await api.updateTask(id, { completed })
      await loadTasks() // データを再読み込み
    } catch (err) {
      showError('タスクの更新に失敗しました')
    }
  }, [loadTasks, showError])

  // タスク削除
  const deleteTask = useCallback(async (id: number) => {
    try {
      await api.deleteTask(id)
      showSuccess('タスクを削除しました')
      await loadTasks() // データを再読み込み
    } catch (err) {
      showError('タスクの削除に失敗しました')
    }
  }, [loadTasks, showSuccess, showError])

  return {
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
  }
}