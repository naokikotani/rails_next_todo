'use client'

import { useState, useEffect, useCallback } from 'react'
import { Container, Typography, Paper, Box, Alert, Snackbar } from '@mui/material'
import TaskForm from '@/components/TaskForm'
import TaskList from '@/components/TaskList'
import TaskFiltersComponent from '@/components/TaskFilters'
import Pagination from '@/components/Pagination'
import { Task, Priority, TaskFilters, PaginationInfo, TasksResponse } from '@/lib/types'
import { api } from '@/lib/api'

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
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

  useEffect(() => {
    loadTasks()
  }, [filters, currentPage, perPage])

  const loadTasks = async () => {
    try {
      setLoading(true)
      const data: TasksResponse = await api.getTasks(filters, currentPage, perPage)
      setTasks(data.tasks)
      setPagination(data.pagination)
    } catch (err) {
      setError('タスクの取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const handleFiltersChange = useCallback((newFilters: TaskFilters) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }, [])

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const handlePerPageChange = useCallback((newPerPage: number) => {
    setPerPage(newPerPage)
    setCurrentPage(1)
  }, [])

  const handleAddTask = async (title: string, description: string, priority: Priority, images?: File[]) => {
    try {
      await api.createTask({
        title,
        description,
        completed: false,
        priority,
      }, images)
      setSuccess('タスクを追加しました')
      loadTasks()
    } catch (err) {
      setError('タスクの追加に失敗しました')
    }
  }

  const handleToggleTask = async (id: number, completed: boolean) => {
    try {
      await api.updateTask(id, { completed })
      loadTasks()
    } catch (err) {
      setError('タスクの更新に失敗しました')
    }
  }

  const handleDeleteTask = async (id: number) => {
    try {
      await api.deleteTask(id)
      setSuccess('タスクを削除しました')
      loadTasks()
    } catch (err) {
      setError('タスクの削除に失敗しました')
    }
  }

  return (
    <Container maxWidth="md" className="py-8">
      <Typography variant="h3" component="h1" className="text-center mb-8 font-bold">
        タスク管理アプリ
      </Typography>

      <Paper elevation={3} className="p-6 mb-6">
        <Typography variant="h5" component="h2" className="mb-4">
          新しいタスクを追加
        </Typography>
        <TaskForm onSubmit={handleAddTask} />
      </Paper>

      <TaskFiltersComponent onFiltersChange={handleFiltersChange} />

      <Paper elevation={3} className="p-6">
        <Typography variant="h5" component="h2" className="mb-4">
          タスク一覧
        </Typography>
        {loading ? (
          <Box className="text-center py-8">
            <Typography>読み込み中...</Typography>
          </Box>
        ) : (
          <>
            <TaskList
              tasks={tasks}
              onToggle={handleToggleTask}
              onDelete={handleDeleteTask}
            />
            <Pagination
              pagination={pagination}
              onPageChange={handlePageChange}
              onPerPageChange={handlePerPageChange}
            />
          </>
        )}
      </Paper>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={() => setSuccess(null)}
      >
        <Alert severity="success" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      </Snackbar>
    </Container>
  )
}
