'use client'

import { Container, Typography, Paper } from '@mui/material'
import TaskForm from '@/components/TaskForm'
import TaskList from '@/components/TaskList'
import TaskFiltersComponent from '@/components/TaskFilters'
import Pagination from '@/components/Pagination'
import NotificationSnackbar from '@/components/NotificationSnackbar'
import LoadingSpinner from '@/components/LoadingSpinner'
import { useTasks } from '@/lib/hooks'

export default function Home() {
  const {
    tasks,
    loading,
    pagination,
    createTask,
    toggleTask,
    deleteTask,
    handleFiltersChange,
    handlePageChange,
    handlePerPageChange,
    notification,
    clearNotification,
  } = useTasks()

  return (
    <Container maxWidth="md" className="py-8">
      <Typography variant="h3" component="h1" className="text-center mb-8 font-bold">
        タスク管理アプリ
      </Typography>

      <Paper elevation={3} className="p-6 mb-6">
        <Typography variant="h5" component="h2" className="mb-4">
          新しいタスクを追加
        </Typography>
        <TaskForm onSubmit={createTask} />
      </Paper>

      <TaskFiltersComponent onFiltersChange={handleFiltersChange} />

      <Paper elevation={3} className="p-6">
        <Typography variant="h5" component="h2" className="mb-4">
          タスク一覧
        </Typography>
        {loading ? (
          <LoadingSpinner message="タスクを読み込み中..." />
        ) : (
          <>
            <TaskList
              tasks={tasks}
              onToggle={toggleTask}
              onDelete={deleteTask}
            />
            <Pagination
              pagination={pagination}
              onPageChange={handlePageChange}
              onPerPageChange={handlePerPageChange}
            />
          </>
        )}
      </Paper>

      <NotificationSnackbar
        open={!!notification}
        message={notification?.message || ''}
        type={notification?.type || 'info'}
        duration={notification?.duration}
        onClose={clearNotification}
      />
    </Container>
  )
}
