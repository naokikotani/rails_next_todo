export type Priority = 'low' | 'medium' | 'high'

export interface Task {
  id: number
  title: string
  description?: string
  completed: boolean
  priority: Priority
  created_at: string
  updated_at: string
}