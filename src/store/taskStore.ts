import { create } from 'zustand'
import { supabase } from '../services/supabase'
import type { Task } from '../types/task'

interface TaskState {
  tasks: Task[]
  loading: boolean
  error: string | null
  fetchTasks: (userId: string) => Promise<void>
  createTask: (title: string, description: string, userId: string) => Promise<void>
  updateTask: (id: string, title: string, description: string) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  toggleComplete: (id: string, completed: boolean) => Promise<void>
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  loading: false,
  error: null,

  fetchTasks: async (userId: string) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      set({ tasks: data || [], loading: false })
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch tasks'
      set({ error: message, loading: false })
    }
  },

  createTask: async (title: string, description: string, userId: string) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{ title, description, user_id: userId }])
        .select()
      
      if (error) throw error
      set({ tasks: [data[0], ...get().tasks], loading: false })
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to create task'
      set({ error: message, loading: false })
      throw error
    }
  },

  updateTask: async (id: string, title: string, description: string) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({ title, description })
        .eq('id', id)
        .select()
      
      if (error) throw error
      set({
        tasks: get().tasks.map((t) => (t.id === id ? data[0] : t)),
        loading: false,
      })
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update task'
      set({ error: message, loading: false })
      throw error
    }
  },

  deleteTask: async (id: string) => {
    set({ loading: true, error: null })
    try {
      const { error } = await supabase.from('tasks').delete().eq('id', id)
      if (error) throw error
      set({ tasks: get().tasks.filter((t) => t.id !== id), loading: false })
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete task'
      set({ error: message, loading: false })
      throw error
    }
  },

  toggleComplete: async (id: string, completed: boolean) => {
    const task = get().tasks.find((t) => t.id === id)
    if (!task) return

    const previousTasks = get().tasks
    set({
      tasks: get().tasks.map((t) =>
        t.id === id ? { ...t, completed } : t
      ),
    })

    try {
      const { error } = await supabase
        .from('tasks')
        .update({ completed })
        .eq('id', id)
      
      if (error) throw error
    } catch (error: unknown) {
      set({ tasks: previousTasks })
      const message = error instanceof Error ? error.message : 'Failed to update task'
      set({ error: message })
    }
  },
}))
