import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "../services/supabase";
import type { User, Session } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      loading: true,
      error: null,

      initialize: async () => {
        try { const { data: { session }} = await supabase.auth.getSession();
          set({ session, user: session?.user ?? null, loading: false });
          supabase.auth.onAuthStateChange(async (_event, session) => {
          set({ session, user: session?.user ?? null })
        });
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message: "Failed to initialize auth";
          set({ loading: false, error: message });
        }
      },

      login: async (email: string, password: string) => {
        set({ loading: true, error: null });
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (error) throw error;
          set({ user: data.user, session: data.session, loading: false });
        } catch (error: unknown) {
          const message =
            error instanceof Error ? error.message : "Login failed";
          set({ error: message, loading: false });
          throw error;
        }
      },

      register: async (email: string, password: string) => {
        set({ loading: true, error: null });
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
          });
          if (error) throw error;
          set({ user: data.user, session: data.session, loading: false });
        } catch (error: unknown) {
          const message =
            error instanceof Error ? error.message : "Registration failed";
          set({ error: message, loading: false });
          throw error;
        }
      },

      logout: async () => {
        set({ loading: true });
        try {
          await supabase.auth.signOut();
          set({ user: null, session: null, loading: false });
        } catch (error: unknown) {
          const message =
            error instanceof Error ? error.message : "Logout failed";
          set({ error: message, loading: false });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ session: state.session }),
    },
  ),
);
