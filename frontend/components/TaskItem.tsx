'use client'

import { Task, Priority } from '@/lib/types'
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Checkbox,
  Typography,
  Chip,
  Box,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import TaskImages from './TaskImages'
import { PRIORITY_LABELS } from '@/lib/constants'

interface TaskItemProps {
  task: Task
  onToggle: (id: number, completed: boolean) => void
  onDelete: (id: number) => void
}

export default function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const getPriorityColor = (priority: Priority): 'error' | 'warning' | 'success' => {
    switch (priority) {
      case 'high': return 'error'
      case 'medium': return 'warning'
      case 'low': return 'success'
    }
  }

  const getPriorityLabel = (priority: Priority): string => {
    return PRIORITY_LABELS[priority]
  }
  return (
    <ListItem className="bg-white rounded-lg shadow-sm mb-2 hover:shadow-md transition-shadow">
      <Checkbox
        checked={task.completed}
        onChange={() => onToggle(task.id, !task.completed)}
        color="primary"
      />
      <ListItemText
        primary={
          <Box className="flex items-center gap-2 mb-1">
            <Typography
              variant="h6"
              className={task.completed ? 'line-through text-gray-500' : ''}
            >
              {task.title}
            </Typography>
            <Chip
              label={getPriorityLabel(task.priority)}
              color={getPriorityColor(task.priority)}
              size="small"
              variant="outlined"
            />
          </Box>
        }
        secondary={
          <Box>
            {task.description && (
              <Typography
                variant="body2"
                className={task.completed ? 'line-through text-gray-400' : 'text-gray-600'}
              >
                {task.description}
              </Typography>
            )}
            {task.images && task.images.length > 0 && (
              <TaskImages images={task.images} compact={true} />
            )}
          </Box>
        }
      />
      <ListItemSecondaryAction>
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={() => onDelete(task.id)}
          color="error"
        >
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  )
}