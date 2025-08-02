'use client'

import { FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { COMPLETION_LABELS } from '@/lib/constants'

interface CompletionSelectProps {
  value: boolean | ''
  onChange: (value: boolean | '') => void
}

export default function CompletionSelect({ value, onChange }: CompletionSelectProps) {
  return (
    <FormControl size="small" sx={{ minWidth: 120 }}>
      <InputLabel>状態</InputLabel>
      <Select
        value={value}
        label="状態"
        onChange={(e) => onChange(e.target.value as boolean | '')}
      >
        <MenuItem value="">{COMPLETION_LABELS.all}</MenuItem>
        <MenuItem value={false}>{COMPLETION_LABELS.incomplete}</MenuItem>
        <MenuItem value={true}>{COMPLETION_LABELS.completed}</MenuItem>
      </Select>
    </FormControl>
  )
}