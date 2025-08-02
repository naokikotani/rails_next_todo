'use client'

import { Snackbar, Alert } from '@mui/material'
import { NotificationType } from '@/lib/hooks/useNotification'

interface NotificationSnackbarProps {
  open: boolean
  message: string
  type: NotificationType
  duration?: number
  onClose: () => void
}

const getDefaultDuration = (type: NotificationType): number => {
  switch (type) {
    case 'error':
      return 6000
    case 'warning':
      return 5000
    case 'success':
      return 3000
    case 'info':
      return 4000
    default:
      return 4000
  }
}

export default function NotificationSnackbar({
  open,
  message,
  type,
  duration,
  onClose,
}: NotificationSnackbarProps) {
  const autoHideDuration = duration ?? getDefaultDuration(type)

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert 
        severity={type} 
        onClose={onClose}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  )
}