import { create } from "zustand";
import { api } from "../config/api";

export const useAuthStore = create((set) => ({
  user: null,
  session: false,
  loading: true,

  // 1. Initialize Auth
  initializeAuth: async () => {
    set({ loading: true });

    try {
      const response = await api.get("/auth/me");
      // Map MongoDB _id to id for frontend consistency if needed
      const userData = { ...response.data, id: response.data._id };
      set({ session: true, user: userData, loading: false });
    } catch (error) {
      set({ session: false, user: null, loading: false });
    }
  },

  // 2. Register Action
  register: async (email, password, name) => {
    try {
      const response = await api.post("/auth/register", {
        email,
        password,
        full_name: name,
      });

      const userData = { ...response.data.user, id: response.data.user.id };
      set({ session: true, user: userData });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Registration failed");
    }
  },

  // 3. Login Action
  login: async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });

      const userData = { ...response.data.user, id: response.data.user.id };
      set({ session: true, user: userData });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Login failed");
    }
  },

  signInWithSocial: async (provider) => {
    // Redirects directly to backend to handle OAuth. Backend handles cookie setting.
    window.location.href = `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/auth/${provider}`;
  },

  signOut: async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      set({ user: null, session: false });
    }
  },
}));
