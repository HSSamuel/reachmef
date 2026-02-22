import { useEffect, useState } from "react";
import { api } from "../config/api"; // ✅ Replaced supabase with api client
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";

export function useProfile() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user?.id]);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/profiles/me");
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    try {
      if (!user) throw new Error("No user logged in");

      // 1. Optimistic Update
      setProfile((prev) => ({ ...prev, ...updates }));

      await api.put("/profiles/me", updates);
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.error || "Failed to update profile");
    }
  };

  const uploadAvatar = async (file) => {
    try {
      if (!user) throw new Error("No user");

      const formData = new FormData();
      formData.append("image", file);

      const { data } = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await updateProfile({ avatar_url: data.url });
      return data.url;
    } catch (error) {
      console.error("Avatar Upload Error:", error);
      toast.error("Failed to upload image");
    }
  };

  return { profile, loading, updateProfile, uploadAvatar };
}
