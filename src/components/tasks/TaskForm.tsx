import { useState, type FormEvent } from 'react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import type { Task } from '../../types/task'

interface TaskFormProps {
  task?: Task
  onSubmit: (title: string, description: string) => Promise<void>
  onCancel?: () => void
}

export function TaskForm({ task, onSubmit, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title || '')
  const [description, setDescription] = useState(task?.description || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('El título es requerido')
      return
    }

    setLoading(true)
    setError('')
    try {
      await onSubmit(title.trim(), description.trim())
      if (!task) {
        setTitle('')
        setDescription('')
      }
    } catch {
      setError('Error al guardar la tarea')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Ingresa el título de la tarea"
        error={error && !title.trim() ? error : undefined}
      />
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Descripción
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ingresa la descripción (opcional)"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white resize-none"
        />
      </div>
      <div className="flex gap-3 justify-end">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" loading={loading}>
          {task ? 'Actualizar' : 'Crear'}
        </Button>
      </div>
    </form>
  )
}
