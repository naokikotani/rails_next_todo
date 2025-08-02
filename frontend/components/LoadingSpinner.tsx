'use client'

import { Box, CircularProgress, Typography } from '@mui/material'

interface LoadingSpinnerProps {
  message?: string
  size?: number
  className?: string
  variant?: 'centered' | 'inline'
}

export default function LoadingSpinner({ 
  message = '読み込み中...', 
  size = 40,
  className = '',
  variant = 'centered'
}: LoadingSpinnerProps) {
  const content = (
    <>
      <CircularProgress size={size} color="primary" />
      {message && (
        <Typography 
          variant="body1" 
          color="text.secondary"
          className={variant === 'centered' ? 'mt-2' : 'ml-2'}
        >
          {message}
        </Typography>
      )}
    </>
  )

  if (variant === 'inline') {
    return (
      <Box className={`flex items-center ${className}`}>
        {content}
      </Box>
    )
  }

  return (
    <Box className={`flex flex-col items-center justify-center py-8 ${className}`}>
      {content}
    </Box>
  )
}