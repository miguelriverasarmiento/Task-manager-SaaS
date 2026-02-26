import type { Task } from "../types/task";

export const formatDate = (date: string) => 
  new Intl.DateTimeFormat("es-ES", { year: "numeric", month: "short", day: "numeric" }).format(new Date(date));

export const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validatePassword = (password: string) => 
  password.length < 6 ? { valid: false, message: "Mínimo 6 caracteres" } : { valid: true, message: "" };

export const validateTaskTitle = (title: string) => {
  const t = title.trim();
  return !t ? { valid: false, message: "Título requerido" } 
    : t.length > 100 ? { valid: false, message: "Máximo 100 caracteres" }
    : { valid: true, message: "" };
};

export const getTaskStats = (tasks: Task[]) => {
  const completed = tasks.filter(t => t.completed).length;
  return { total: tasks.length, completed, pending: tasks.length - completed, completionRate: tasks.length ? Math.round(completed / tasks.length * 100) : 0 };
};
