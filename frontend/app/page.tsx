'use client'

import { Container } from '@mui/material'
import AppHeader from '@/components/sections/AppHeader'
import TaskFormSection from '@/components/sections/TaskFormSection'
import TaskListSection from '@/components/sections/TaskListSection'
import TaskFiltersRefactored from '@/components/TaskFiltersRefactored'
import NotificationSnackbar from '@/components/NotificationSnackbar'
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
      <AppHeader />
      
      <TaskFormSection onSubmit={createTask} />

      <TaskFiltersRefactored onFiltersChange={handleFiltersChange} />

      <TaskListSection
        tasks={tasks}
        loading={loading}
        pagination={pagination}
        onToggle={toggleTask}
        onDelete={deleteTask}
        onPageChange={handlePageChange}
        onPerPageChange={handlePerPageChange}
      />

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
