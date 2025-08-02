'use client'

import { Backdrop, CircularProgress, Typography, Box } from '@mui/material'

interface LoadingOverlayProps {
  open: boolean
  message?: string
}

export default function LoadingOverlay({ 
  open, 
  message = '処理中...' 
}: LoadingOverlayProps) {
  return (
    <Backdrop
      sx={{ 
        color: '#fff', 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        flexDirection: 'column'
      }}
      open={open}
    >
      <CircularProgress color="inherit" size={60} />
      <Box mt={2}>
        <Typography variant="h6" color="inherit">
          {message}
        </Typography>
      </Box>
    </Backdrop>
  )
}