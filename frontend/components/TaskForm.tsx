'use client'

import { useState } from 'react'
import { TextField, Button, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import ImageUpload from './ImageUpload'

import { Priority } from '@/lib/types'
import { UI_TEXT, PRIORITY_LABELS, IMAGE_CONFIG } from '@/lib/constants'

interface TaskFormProps {
  onSubmit: (title: string, description: string, priority: Priority, images?: File[]) => void
}

export default function TaskForm({ onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [images, setImages] = useState<File[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onSubmit(title, description, priority, images.length > 0 ? images : undefined)
      setTitle('')
      setDescription('')
      setPriority('medium')
      setImages([])
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} className="mb-6">
      <TextField
        fullWidth
        label={UI_TEXT.TASK_TITLE_LABEL}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        variant="outlined"
        className="mb-4"
        required
      />
      <TextField
        fullWidth
        label={UI_TEXT.TASK_DESCRIPTION_LABEL}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        variant="outlined"
        multiline
        rows={3}
        className="mb-4"
      />
      <FormControl fullWidth className="mb-4">
        <InputLabel id="priority-label">{UI_TEXT.PRIORITY_LABEL}</InputLabel>
        <Select
          labelId="priority-label"
          value={priority}
          label={UI_TEXT.PRIORITY_LABEL}
          onChange={(e) => setPriority(e.target.value as Priority)}
        >
          <MenuItem value="low">{PRIORITY_LABELS.low}</MenuItem>
          <MenuItem value="medium">{PRIORITY_LABELS.medium}</MenuItem>
          <MenuItem value="high">{PRIORITY_LABELS.high}</MenuItem>
        </Select>
      </FormControl>
      
      <Box className="mb-4">
        <ImageUpload 
          images={images}
          onImagesChange={setImages}
          maxImages={IMAGE_CONFIG.MAX_IMAGES}
        />
      </Box>
      
      <Button
        type="submit"
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        fullWidth
        size="large"
      >
        {UI_TEXT.ADD_TASK_BUTTON}
      </Button>
    </Box>
  )
}