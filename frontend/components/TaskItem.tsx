'use client'

import { Task } from '@/lib/types'
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Checkbox,
  Typography,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

interface TaskItemProps {
  task: Task
  onToggle: (id: number, completed: boolean) => void
  onDelete: (id: number) => void
}

export default function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <ListItem className="bg-white rounded-lg shadow-sm mb-2 hover:shadow-md transition-shadow">
      <Checkbox
        checked={task.completed}
        onChange={() => onToggle(task.id, !task.completed)}
        color="primary"
      />
      <ListItemText
        primary={
          <Typography
            variant="h6"
            className={task.completed ? 'line-through text-gray-500' : ''}
          >
            {task.title}
          </Typography>
        }
        secondary={
          task.description && (
            <Typography
              variant="body2"
              className={task.completed ? 'line-through text-gray-400' : 'text-gray-600'}
            >
              {task.description}
            </Typography>
          )
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