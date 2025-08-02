import { useState, useCallback } from 'react'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

interface Notification {
  message: string
  type: NotificationType
  duration?: number
}

export function useNotification() {
  const [notification, setNotification] = useState<Notification | null>(null)

  const showNotification = useCallback((
    message: string, 
    type: NotificationType = 'info',
    duration?: number
  ) => {
    setNotification({ message, type, duration })
  }, [])

  const showSuccess = useCallback((message: string, duration?: number) => {
    showNotification(message, 'success', duration)
  }, [showNotification])

  const showError = useCallback((message: string, duration?: number) => {
    showNotification(message, 'error', duration)
  }, [showNotification])

  const showWarning = useCallback((message: string, duration?: number) => {
    showNotification(message, 'warning', duration)
  }, [showNotification])

  const showInfo = useCallback((message: string, duration?: number) => {
    showNotification(message, 'info', duration)
  }, [showNotification])

  const clearNotification = useCallback(() => {
    setNotification(null)
  }, [])

  return {
    notification,
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    clearNotification,
  }
}