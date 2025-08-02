'use client'

import { TextField } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { UI_TEXT } from '@/lib/constants'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <TextField
      fullWidth
      placeholder={UI_TEXT.SEARCH_PLACEHOLDER}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      InputProps={{
        startAdornment: <SearchIcon className="mr-2 text-gray-400" />,
      }}
      variant="outlined"
      size="small"
    />
  )
}