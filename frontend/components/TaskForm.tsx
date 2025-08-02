'use client'

import { useState } from 'react'
import { TextField, Button, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

import { Priority } from '@/lib/types'

interface TaskFormProps {
  onSubmit: (title: string, description: string, priority: Priority) => void
}

export default function TaskForm({ onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onSubmit(title, description, priority)
      setTitle('')
      setDescription('')
      setPriority('medium')
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
      <FormControl fullWidth className="mb-4">
        <InputLabel id="priority-label">優先度</InputLabel>
        <Select
          labelId="priority-label"
          value={priority}
          label="優先度"
          onChange={(e) => setPriority(e.target.value as Priority)}
        >
          <MenuItem value="low">低</MenuItem>
          <MenuItem value="medium">中</MenuItem>
          <MenuItem value="high">高</MenuItem>
        </Select>
      </FormControl>
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