'use client'

import { FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { Priority } from '@/lib/types'
import { PRIORITY_LABELS, COMPLETION_LABELS, UI_TEXT } from '@/lib/constants'

interface PrioritySelectProps {
  value: Priority | ''
  onChange: (value: Priority | '') => void
}

export default function PrioritySelect({ value, onChange }: PrioritySelectProps) {
  return (
    <FormControl size="small" sx={{ minWidth: 120 }}>
      <InputLabel>{UI_TEXT.PRIORITY_LABEL}</InputLabel>
      <Select
        value={value}
        label={UI_TEXT.PRIORITY_LABEL}
        onChange={(e) => onChange(e.target.value as Priority | '')}
      >
        <MenuItem value="">{COMPLETION_LABELS.all}</MenuItem>
        <MenuItem value="high">{PRIORITY_LABELS.high}</MenuItem>
        <MenuItem value="medium">{PRIORITY_LABELS.medium}</MenuItem>
        <MenuItem value="low">{PRIORITY_LABELS.low}</MenuItem>
      </Select>
    </FormControl>
  )
}