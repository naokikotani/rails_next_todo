'use client'

import { Container, Typography, Paper } from '@mui/material'
import TaskForm from '@/components/TaskForm'
import TaskList from '@/components/TaskList'
import TaskFiltersComponent from '@/components/TaskFilters'
import Pagination from '@/components/Pagination'
import NotificationSnackbar from '@/components/NotificationSnackbar'
import LoadingSpinner from '@/components/LoadingSpinner'
import { useTasks } from '@/lib/hooks'
import { UI_TEXT, LOADING_MESSAGES } from '@/lib/constants'

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
        {UI_TEXT.APP_TITLE}
      </Typography>

      <Paper elevation={3} className="p-6 mb-6">
        <Typography variant="h5" component="h2" className="mb-4">
          {UI_TEXT.ADD_NEW_TASK}
        </Typography>
        <TaskForm onSubmit={createTask} />
      </Paper>

      <TaskFiltersComponent onFiltersChange={handleFiltersChange} />

      <Paper elevation={3} className="p-6">
        <Typography variant="h5" component="h2" className="mb-4">
          {UI_TEXT.TASK_LIST}
        </Typography>
        {loading ? (
          <LoadingSpinner message={LOADING_MESSAGES.LOADING_TASKS} />
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
