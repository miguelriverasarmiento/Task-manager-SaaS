export type { Task } from "./task";

export interface User {
  id: string;
  email: string;
}

export interface AuthResponse {
  user: User | null;
  session: unknown;
  error: string | null;
}
