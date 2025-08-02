'use client'

import { useState, useEffect, useCallback } from 'react'
import { useDebounce } from '@/lib/hooks'
import { Box, Typography, Paper } from '@mui/material'
import { TaskFilters, Priority } from '@/lib/types'
import { UI_TEXT, FILTER_CONFIG } from '@/lib/constants'
import SearchBar from './filters/SearchBar'
import PrioritySelect from './filters/PrioritySelect'
import CompletionSelect from './filters/CompletionSelect'
import ActiveFiltersDisplay from './filters/ActiveFiltersDisplay'

interface TaskFiltersProps {
  onFiltersChange: (filters: TaskFilters) => void
}

export default function TaskFiltersRefactored({ onFiltersChange }: TaskFiltersProps) {
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

  return (
    <Paper elevation={2} className="p-4 mb-6">
      <Typography variant="h6" className="mb-3">
        {UI_TEXT.SEARCH_FILTERS}
      </Typography>
      
      <Box className="flex flex-col md:flex-row gap-4">
        <SearchBar value={search} onChange={setSearch} />
        <PrioritySelect value={priority} onChange={setPriority} />
        <CompletionSelect value={completed} onChange={setCompleted} />
      </Box>

      <ActiveFiltersDisplay
        search={debouncedSearch}
        priority={priority}
        completed={completed}
        onClearSearch={() => setSearch('')}
        onClearPriority={() => setPriority('')}
        onClearCompleted={() => setCompleted('')}
        onClearAll={clearFilters}
      />
    </Paper>
  )
}