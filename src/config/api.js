import axios from "axios";

export const api = axios.create({
  // Fallback ensures it works even if the env var is missing during dev
  baseURL:
    import.meta.env.VITE_API_URL || "https://reachme-1fqo.onrender.com/api",
  withCredentials: true, // ✅ CRITICAL: Required for sending/receiving HttpOnly cookies
});
