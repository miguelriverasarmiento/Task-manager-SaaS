import { useEffect, useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { useTaskStore } from '../store/taskStore'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { TaskForm } from '../components/tasks/TaskForm'
import { TaskList } from '../components/tasks/TaskList'
import type { Task } from '../types/task'

export function Dashboard() {
  const { user, logout } = useAuthStore()
  const { tasks, loading, fetchTasks, createTask, updateTask, deleteTask, toggleComplete } = useTaskStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  useEffect(() => {
    if (user) {
      fetchTasks(user.id)
    }
  }, [user, fetchTasks])

  const handleCreateTask = async (title: string, description: string) => {
    if (!user) return
    await createTask(title, description, user.id)
    setIsModalOpen(false)
  }

  const handleUpdateTask = async (title: string, description: string) => {
    if (!editingTask) return
    await updateTask(editingTask.id, title, description)
    setEditingTask(null)
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      await deleteTask(id)
    }
  }

  const handleToggleComplete = async (id: string, completed: boolean) => {
    await toggleComplete(id, completed)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingTask(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">TaskFlow</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {user?.email}
              </span>
              <Button variant="secondary" size="sm" onClick={logout}>
                Cerrar sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Mis Tareas
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {tasks.length} {tasks.length === 1 ? 'tarea' : 'tareas'} en total
            </p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nueva tarea
          </Button>
        </div>

        <TaskList
          tasks={tasks}
          loading={loading}
          onToggleComplete={handleToggleComplete}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>

      <Modal
        isOpen={isModalOpen} // El modal de creación se abre cuando isModalOpen es true
        onClose={closeModal}
        title="Nueva tarea"
      >
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={closeModal}
        />
      </Modal>

      <Modal
        isOpen={!!editingTask}// Si editingTask es null, el modal estará cerrado, si tiene un valor, estará abierto
        onClose={closeModal}
        title="Editar tarea"
      >
        {editingTask && (// Solo renderizamos el formulario si hay una tarea para editar
          <TaskForm
            task={editingTask} // Pasamos la tarea que queremos editar al formulario para que pueda mostrar sus datos
            onSubmit={handleUpdateTask}
            onCancel={closeModal}
          />
        )}
      </Modal>
    </div>
  )
}
