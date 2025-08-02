import { Task, TaskFilters, TasksResponse } from '@/lib/types'
import { get, postFormData, put, del } from './client'

export const tasksApi = {
  async getTasks(filters?: TaskFilters, page?: number, perPage?: number): Promise<TasksResponse> {
    const params: Record<string, string> = {}

    if (filters?.search) {
      params['q[title_cont]'] = filters.search
    }
    if (filters?.priority) {
      params['q[priority_eq]'] = filters.priority
    }
    if (filters?.completed !== undefined) {
      params['q[completed_eq]'] = filters.completed.toString()
    }

    if (page) {
      params['page'] = page.toString()
    }
    if (perPage) {
      params['per_page'] = perPage.toString()
    }

    return get<TasksResponse>('/tasks', params)
  },

  async createTask(
    task: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'images'>, 
    images?: File[]
  ): Promise<Task> {
    const formData = new FormData()
    
    // タスクデータを追加
    formData.append('task[title]', task.title)
    formData.append('task[priority]', task.priority)
    formData.append('task[completed]', task.completed.toString())
    if (task.description) {
      formData.append('task[description]', task.description)
    }
    
    // 画像ファイルを追加
    if (images) {
      images.forEach((image) => {
        formData.append('task[images][]', image)
      })
    }

    return postFormData<Task>('/tasks', formData)
  },

  async updateTask(
    id: number, 
    task: Partial<Omit<Task, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<Task> {
    return put<Task>(`/tasks/${id}`, { task })
  },

  async deleteTask(id: number): Promise<void> {
    return del<void>(`/tasks/${id}`)
  },
}