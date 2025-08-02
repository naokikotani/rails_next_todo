'use client'

import { Typography } from '@mui/material'
import { UI_TEXT } from '@/lib/constants'

export default function AppHeader() {
  return (
    <Typography variant="h3" component="h1" className="text-center mb-8 font-bold">
      {UI_TEXT.APP_TITLE}
    </Typography>
  )
}