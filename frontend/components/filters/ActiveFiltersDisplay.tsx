'use client'

import { Box, Typography, Chip } from '@mui/material'
import { Priority } from '@/lib/types'
import { PRIORITY_LABELS, COMPLETION_LABELS, UI_TEXT } from '@/lib/constants'

interface ActiveFiltersDisplayProps {
  search: string
  priority: Priority | ''
  completed: boolean | ''
  onClearSearch: () => void
  onClearPriority: () => void
  onClearCompleted: () => void
  onClearAll: () => void
}

export default function ActiveFiltersDisplay({
  search,
  priority,
  completed,
  onClearSearch,
  onClearPriority,
  onClearCompleted,
  onClearAll,
}: ActiveFiltersDisplayProps) {
  const hasActiveFilters = search.trim() || priority || completed !== ''

  if (!hasActiveFilters) return null

  return (
    <Box className="mt-3 flex flex-wrap gap-2 items-center">
      <Typography variant="body2" className="text-gray-600">
        {UI_TEXT.ACTIVE_FILTERS}
      </Typography>
      {search.trim() && (
        <Chip
          label={`検索: "${search}"`}
          onDelete={onClearSearch}
          size="small"
          color="primary"
          variant="outlined"
        />
      )}
      {priority && (
        <Chip
          label={`${UI_TEXT.PRIORITY_LABEL}: ${PRIORITY_LABELS[priority]}`}
          onDelete={onClearPriority}
          size="small"
          color="secondary"
          variant="outlined"
        />
      )}
      {completed !== '' && (
        <Chip
          label={`状態: ${completed ? COMPLETION_LABELS.completed : COMPLETION_LABELS.incomplete}`}
          onDelete={onClearCompleted}
          size="small"
          color="success"
          variant="outlined"
        />
      )}
      <Chip
        label={UI_TEXT.CLEAR_ALL_FILTERS}
        onClick={onClearAll}
        size="small"
        color="default"
        variant="outlined"
        className="cursor-pointer"
      />
    </Box>
  )
}