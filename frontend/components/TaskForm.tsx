'use client'

import { useState } from 'react'
import { TextField, Button, Box } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

interface TaskFormProps {
  onSubmit: (title: string, description: string) => void
}

export default function TaskForm({ onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onSubmit(title, description)
      setTitle('')
      setDescription('')
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} className="mb-6">
      <TextField
        fullWidth
        label="タスクのタイトル"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        variant="outlined"
        className="mb-4"
        required
      />
      <TextField
        fullWidth
        label="タスクの説明（任意）"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        variant="outlined"
        multiline
        rows={3}
        className="mb-4"
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        fullWidth
        size="large"
      >
        タスクを追加
      </Button>
    </Box>
  )
}