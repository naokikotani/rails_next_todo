'use client'

import { Container, Typography, Paper, Box, Alert, Snackbar } from '@mui/material'
import TaskForm from '@/components/TaskForm'
import TaskList from '@/components/TaskList'
import TaskFiltersComponent from '@/components/TaskFilters'
import Pagination from '@/components/Pagination'
import { useTasks } from '@/lib/hooks'

export default function Home() {
  const {
    tasks,
    loading,
    error,
    success,
    pagination,
    createTask,
    toggleTask,
    deleteTask,
    handleFiltersChange,
    handlePageChange,
    handlePerPageChange,
    clearError,
    clearSuccess,
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
          <Box className="text-center py-8">
            <Typography>読み込み中...</Typography>
          </Box>
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

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={clearError}
      >
        <Alert severity="error" onClose={clearError}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={clearSuccess}
      >
        <Alert severity="success" onClose={clearSuccess}>
          {success}
        </Alert>
      </Snackbar>
    </Container>
  )
}
