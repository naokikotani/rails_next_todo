'use client'

import { Paper, Typography } from '@mui/material'
import TaskForm from '../TaskForm'
import { Priority } from '@/lib/types'
import { UI_TEXT } from '@/lib/constants'

interface TaskFormSectionProps {
  onSubmit: (title: string, description: string, priority: Priority, images?: File[]) => void
}

export default function TaskFormSection({ onSubmit }: TaskFormSectionProps) {
  return (
    <Paper elevation={3} className="p-6 mb-6">
      <Typography variant="h5" component="h2" className="mb-4">
        {UI_TEXT.ADD_NEW_TASK}
      </Typography>
      <TaskForm onSubmit={onSubmit} />
    </Paper>
  )
}