'use client'

import { Task } from '@/lib/types'
import { List, Typography, Box } from '@mui/material'
import TaskItem from './TaskItem'

interface TaskListProps {
  tasks: Task[]
  onToggle: (id: number, completed: boolean) => void
  onDelete: (id: number) => void
}

export default function TaskList({ tasks, onToggle, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <Box className="text-center py-8">
        <Typography variant="h6" color="textSecondary">
          タスクがありません
        </Typography>
        <Typography variant="body2" color="textSecondary" className="mt-2">
          新しいタスクを追加してください
        </Typography>
      </Box>
    )
  }

  return (
    <List>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </List>
  )
}