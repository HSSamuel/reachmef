import { useEffect, useState } from "react";
import { api } from "../../../config/api"; // ✅ Replaced supabase with api client
import { useProfile } from "../../../hooks/useProfile";
import toast from "react-hot-toast";

export function useLinks() {
  const { profile } = useProfile();
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. FETCH LINKS
  useEffect(() => {
    if (!profile?._id) return; // ✅ MONGODB FIX: Use _id

    const fetchLinks = async () => {
      try {
        const { data } = await api.get("/links");
        setLinks(data || []);
      } catch (error) {
        console.error("Fetch Error:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, [profile?._id]); // ✅ MONGODB FIX

  // 2. ADD LINK
  const addLink = async (payload) => {
    try {
      if (!profile?._id) throw new Error("Profile not loaded");

      // New link goes to the bottom
      const currentLength = links.length;

      const { data } = await api.post("/links", {
        ...payload,
        is_active: true,
        sort_order: currentLength,
      });

      setLinks((prev) => [...prev, data]);
      return data;
    } catch (error) {
      toast.error(error.response?.data?.error || "Error adding link");
      throw error;
    }
  };

  // 3. UPDATE LINK
  const updateLink = async (id, updates) => {
    try {
      // Optimistic Update
      setLinks(
        (prev) =>
          prev.map((link) =>
            link._id === id ? { ...link, ...updates } : link,
          ), // ✅ MONGODB FIX: link._id
      );

      await api.put(`/links/${id}`, updates);
    } catch (error) {
      console.error("Update error", error);
      toast.error("Failed to update");
    }
  };

  // 4. DELETE LINK
  const deleteLink = async (id) => {
    try {
      setLinks((prev) => prev.filter((link) => link._id !== id)); // ✅ MONGODB FIX: link._id
      await api.delete(`/links/${id}`);
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  // 5. UPLOAD THUMBNAIL
  const uploadThumbnail = async (id, file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const { data } = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const publicUrl = data.url;

      await updateLink(id, { thumbnail_url: publicUrl });
      return publicUrl;
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Image upload failed");
      throw error;
    }
  };

  // 6. REORDER LINKS
  const reorderLinks = async (newLinks) => {
    // 1. Optimistic Update (Update UI instantly)
    setLinks(newLinks);

    try {
      // 2. Create payload for Express backend
      const updates = newLinks.map((link, index) => ({
        id: link._id, // ✅ MONGODB FIX
        sort_order: index,
      }));

      // Execute bulk update
      await api.put("/links/reorder", { updates });
    } catch (error) {
      console.error("Reorder Error:", error);
      toast.error("Failed to save order");
    }
  };

  // 7. SYNC DYNAMIC LINK (RSS)
  const syncLink = async (id) => {
    try {
      const { data } = await api.post(`/links/${id}/sync`);
      // Update link in state with the newly fetched RSS data
      setLinks((prev) =>
        prev.map((link) => (link._id === id ? { ...link, ...data } : link)),
      );
      return data;
    } catch (error) {
      throw error;
    }
  };

  return {
    links,
    loading,
    addLink,
    updateLink,
    deleteLink,
    uploadThumbnail,
    reorderLinks,
    syncLink,
  };
}
