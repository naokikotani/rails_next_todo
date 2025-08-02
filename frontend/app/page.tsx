'use client'

import { useState, useEffect } from 'react'
import { Container, Typography, Paper, Box, Alert, Snackbar } from '@mui/material'
import TaskForm from '@/components/TaskForm'
import TaskList from '@/components/TaskList'
import { Task } from '@/lib/types'
import { api } from '@/lib/api'

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    try {
      setLoading(true)
      const data = await api.getTasks()
      setTasks(data)
    } catch (err) {
      setError('タスクの取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const handleAddTask = async (title: string, description: string) => {
    try {
      const newTask = await api.createTask({
        title,
        description,
        completed: false,
      })
      setTasks([...tasks, newTask])
      setSuccess('タスクを追加しました')
    } catch (err) {
      setError('タスクの追加に失敗しました')
    }
  }

  const handleToggleTask = async (id: number, completed: boolean) => {
    try {
      const updatedTask = await api.updateTask(id, { completed })
      setTasks(tasks.map((task) => (task.id === id ? updatedTask : task)))
    } catch (err) {
      setError('タスクの更新に失敗しました')
    }
  }

  const handleDeleteTask = async (id: number) => {
    try {
      await api.deleteTask(id)
      setTasks(tasks.filter((task) => task.id !== id))
      setSuccess('タスクを削除しました')
    } catch (err) {
      setError('タスクの削除に失敗しました')
    }
  }

  return (
    <Container maxWidth="md" className="py-8">
      <Typography variant="h3" component="h1" className="text-center mb-8 font-bold">
        タスク管理アプリ
      </Typography>

      <Paper elevation={3} className="p-6 mb-6">
        <Typography variant="h5" component="h2" className="mb-4">
          新しいタスクを追加
        </Typography>
        <TaskForm onSubmit={handleAddTask} />
      </Paper>

      <Paper elevation={3} className="p-6">
        <Typography variant="h5" component="h2" className="mb-4">
          タスク一覧
        </Typography>
        {loading ? (
          <Box className="text-center py-8">
            <Typography>読み込み中...</Typography>
          </Box>
        ) : (
          <TaskList
            tasks={tasks}
            onToggle={handleToggleTask}
            onDelete={handleDeleteTask}
          />
        )}
      </Paper>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={() => setSuccess(null)}
      >
        <Alert severity="success" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      </Snackbar>
    </Container>
  )
}