'use client'

import { useState, useEffect, useCallback } from 'react'
import { useDebounce } from '@/lib/hooks'
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Typography,
  Paper,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { TaskFilters, Priority } from '@/lib/types'
import { PRIORITY_LABELS, COMPLETION_LABELS, UI_TEXT, FILTER_CONFIG } from '@/lib/constants'

interface TaskFiltersProps {
  onFiltersChange: (filters: TaskFilters) => void
}

export default function TaskFiltersComponent({ onFiltersChange }: TaskFiltersProps) {
  const [search, setSearch] = useState('')
  const [priority, setPriority] = useState<Priority | ''>('')
  const [completed, setCompleted] = useState<boolean | ''>('')

  // 検索クエリを遅延させる（debounce）
  const debouncedSearch = useDebounce(search, FILTER_CONFIG.DEBOUNCE_DELAY)

  // フィルター変更時にコールバックを実行
  useEffect(() => {
    const filters: TaskFilters = {}

    if (debouncedSearch.trim()) {
      filters.search = debouncedSearch.trim()
    }
    if (priority) {
      filters.priority = priority
    }
    if (completed !== '') {
      filters.completed = completed as boolean
    }

    onFiltersChange(filters)
  }, [debouncedSearch, priority, completed]) // onFiltersChangeを依存配列から除外

  const clearFilters = useCallback(() => {
    setSearch('')
    setPriority('')
    setCompleted('')
  }, [])

  const hasActiveFilters = debouncedSearch.trim() || priority || completed !== ''

  return (
    <Paper elevation={2} className="p-4 mb-6">
      <Typography variant="h6" className="mb-3">
        {UI_TEXT.SEARCH_FILTERS}
      </Typography>
      
      <Box className="flex flex-col md:flex-row gap-4">
        {/* 検索バー */}
        <TextField
          fullWidth
          placeholder={UI_TEXT.SEARCH_PLACEHOLDER}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon className="mr-2 text-gray-400" />,
          }}
          variant="outlined"
          size="small"
        />

        {/* 優先度フィルター */}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>{UI_TEXT.PRIORITY_LABEL}</InputLabel>
          <Select
            value={priority}
            label={UI_TEXT.PRIORITY_LABEL}
            onChange={(e) => setPriority(e.target.value as Priority | '')}
          >
            <MenuItem value="">{COMPLETION_LABELS.all}</MenuItem>
            <MenuItem value="high">{PRIORITY_LABELS.high}</MenuItem>
            <MenuItem value="medium">{PRIORITY_LABELS.medium}</MenuItem>
            <MenuItem value="low">{PRIORITY_LABELS.low}</MenuItem>
          </Select>
        </FormControl>

        {/* 完了状態フィルター */}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>状態</InputLabel>
          <Select
            value={completed}
            label="状態"
            onChange={(e) => setCompleted(e.target.value as boolean | '')}
          >
            <MenuItem value="">{COMPLETION_LABELS.all}</MenuItem>
            <MenuItem value={false}>{COMPLETION_LABELS.incomplete}</MenuItem>
            <MenuItem value={true}>{COMPLETION_LABELS.completed}</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* アクティブフィルターの表示 */}
      {hasActiveFilters && (
        <Box className="mt-3 flex flex-wrap gap-2 items-center">
          <Typography variant="body2" className="text-gray-600">
            {UI_TEXT.ACTIVE_FILTERS}
          </Typography>
          {debouncedSearch.trim() && (
            <Chip
              label={`検索: "${debouncedSearch}"`}
              onDelete={() => setSearch('')}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
          {priority && (
            <Chip
              label={`${UI_TEXT.PRIORITY_LABEL}: ${PRIORITY_LABELS[priority]}`}
              onDelete={() => setPriority('')}
              size="small"
              color="secondary"
              variant="outlined"
            />
          )}
          {completed !== '' && (
            <Chip
              label={`状態: ${completed ? COMPLETION_LABELS.completed : COMPLETION_LABELS.incomplete}`}
              onDelete={() => setCompleted('')}
              size="small"
              color="success"
              variant="outlined"
            />
          )}
          <Chip
            label={UI_TEXT.CLEAR_ALL_FILTERS}
            onClick={clearFilters}
            size="small"
            color="default"
            variant="outlined"
            className="cursor-pointer"
          />
        </Box>
      )}
    </Paper>
  )
}
