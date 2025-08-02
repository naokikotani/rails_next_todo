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

export interface TaskFilters {
  search?: string
  priority?: Priority
  completed?: boolean
}

export interface PaginationInfo {
  current_page: number
  total_pages: number
  total_count: number
  per_page: number
  next_page: number | null
  prev_page: number | null
}

export interface TasksResponse {
  tasks: Task[]
  pagination: PaginationInfo
}