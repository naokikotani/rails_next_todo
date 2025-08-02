'use client'

import { Paper, Typography } from '@mui/material'
import TaskList from '../TaskList'
import Pagination from '../Pagination'
import LoadingSpinner from '../LoadingSpinner'
import { Task, PaginationInfo } from '@/lib/types'
import { UI_TEXT, LOADING_MESSAGES } from '@/lib/constants'

interface TaskListSectionProps {
  tasks: Task[]
  loading: boolean
  pagination: PaginationInfo
  onToggle: (id: number, completed: boolean) => void
  onDelete: (id: number) => void
  onPageChange: (page: number) => void
  onPerPageChange: (perPage: number) => void
}

export default function TaskListSection({
  tasks,
  loading,
  pagination,
  onToggle,
  onDelete,
  onPageChange,
  onPerPageChange,
}: TaskListSectionProps) {
  return (
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
            onToggle={onToggle}
            onDelete={onDelete}
          />
          <Pagination
            pagination={pagination}
            onPageChange={onPageChange}
            onPerPageChange={onPerPageChange}
          />
        </>
      )}
    </Paper>
  )
}