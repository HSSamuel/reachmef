import { create } from "zustand";
import { api } from "../config/api";

export const useAuthStore = create((set) => ({
  user: null,
  session: !!localStorage.getItem("reachme_token"),
  loading: true,

  // 1. Initialize Auth
  initializeAuth: async () => {
    set({ loading: true });
    const token = localStorage.getItem("reachme_token");

    if (!token) {
      set({ session: false, user: null, loading: false });
      return;
    }

    try {
      const response = await api.get("/auth/me");
      // Map MongoDB _id to id for frontend consistency if needed
      const userData = { ...response.data, id: response.data._id };
      set({ session: true, user: userData, loading: false });
    } catch (error) {
      localStorage.removeItem("reachme_token");
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

      localStorage.setItem("reachme_token", response.data.token);
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

      localStorage.setItem("reachme_token", response.data.token);
      const userData = { ...response.data.user, id: response.data.user.id };
      set({ session: true, user: userData });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Login failed");
    }
  },

  signInWithSocial: async (provider) => {
    throw new Error(
      `Social login with ${provider} is not yet configured on the new backend.`,
    );
  },

  signOut: async () => {
    localStorage.removeItem("reachme_token");
    set({ user: null, session: false });
  },
}));
