'use client'

import { Snackbar, Alert } from '@mui/material'
import { NotificationType } from '@/lib/hooks/useNotification'
import { NOTIFICATION_CONFIG } from '@/lib/constants'

interface NotificationSnackbarProps {
  open: boolean
  message: string
  type: NotificationType
  duration?: number
  onClose: () => void
}

const getDefaultDuration = (type: NotificationType): number => {
  return NOTIFICATION_CONFIG.DURATION[type.toUpperCase() as keyof typeof NOTIFICATION_CONFIG.DURATION] || NOTIFICATION_CONFIG.DURATION.INFO
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
      anchorOrigin={{ 
        vertical: NOTIFICATION_CONFIG.POSITION.VERTICAL, 
        horizontal: NOTIFICATION_CONFIG.POSITION.HORIZONTAL 
      }}
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