import { Task } from './types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export const api = {
  async getTasks(): Promise<Task[]> {
    const response = await fetch(`${API_URL}/tasks`)
    if (!response.ok) throw new Error('Failed to fetch tasks')
    return response.json()
  },

  async createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task> {
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ task }),
    })
    if (!response.ok) throw new Error('Failed to create task')
    return response.json()
  },

  async updateTask(id: number, task: Partial<Omit<Task, 'id' | 'created_at' | 'updated_at'>>): Promise<Task> {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ task }),
    })
    if (!response.ok) throw new Error('Failed to update task')
    return response.json()
  },

  async deleteTask(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error('Failed to delete task')
  },
}