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

interface TaskFiltersProps {
  onFiltersChange: (filters: TaskFilters) => void
}

export default function TaskFiltersComponent({ onFiltersChange }: TaskFiltersProps) {
  const [search, setSearch] = useState('')
  const [priority, setPriority] = useState<Priority | ''>('')
  const [completed, setCompleted] = useState<boolean | ''>('')

  // 検索クエリを500ms遅延させる（debounce）
  const debouncedSearch = useDebounce(search, 500)

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

  const clearFilters = () => {
    setSearch('')
    setPriority('')
    setCompleted('')
  }

  const hasActiveFilters = debouncedSearch.trim() || priority || completed !== ''

  return (
    <Paper elevation={2} className="p-4 mb-6">
      <Typography variant="h6" className="mb-3">
        検索・フィルター
      </Typography>
      
      <Box className="flex flex-col md:flex-row gap-4">
        {/* 検索バー */}
        <TextField
          fullWidth
          placeholder="タスクを検索..."
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
          <InputLabel>優先度</InputLabel>
          <Select
            value={priority}
            label="優先度"
            onChange={(e) => setPriority(e.target.value as Priority | '')}
          >
            <MenuItem value="">すべて</MenuItem>
            <MenuItem value="high">高</MenuItem>
            <MenuItem value="medium">中</MenuItem>
            <MenuItem value="low">低</MenuItem>
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
            <MenuItem value="">すべて</MenuItem>
            <MenuItem value={false}>未完了</MenuItem>
            <MenuItem value={true}>完了済み</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* アクティブフィルターの表示 */}
      {hasActiveFilters && (
        <Box className="mt-3 flex flex-wrap gap-2 items-center">
          <Typography variant="body2" className="text-gray-600">
            アクティブフィルター:
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
              label={`優先度: ${priority === 'high' ? '高' : priority === 'medium' ? '中' : '低'}`}
              onDelete={() => setPriority('')}
              size="small"
              color="secondary"
              variant="outlined"
            />
          )}
          {completed !== '' && (
            <Chip
              label={`状態: ${completed ? '完了済み' : '未完了'}`}
              onDelete={() => setCompleted('')}
              size="small"
              color="success"
              variant="outlined"
            />
          )}
          <Chip
            label="すべてクリア"
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
