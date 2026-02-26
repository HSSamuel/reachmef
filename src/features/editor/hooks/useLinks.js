import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../config/api";
import { useProfile } from "../../../hooks/useProfile";
import toast from "react-hot-toast";

export function useLinks() {
  const { profile } = useProfile();
  const queryClient = useQueryClient();

  // 1. FETCH LINKS (React Query)
  const { data: links = [], isLoading: loading } = useQuery({
    queryKey: ["links", profile?._id],
    queryFn: async () => {
      const { data } = await api.get("/links");
      return data || [];
    },
    enabled: !!profile?._id, // Only fetch if profile exists
  });

  // 2. ADD LINK
  const { mutateAsync: addLink } = useMutation({
    mutationFn: async (payload) => {
      const currentLength = links.length;
      const { data } = await api.post("/links", {
        ...payload,
        is_active: true,
        sort_order: currentLength,
      });
      return data;
    },
    onSuccess: (newLink) => {
      // Instantly update the UI cache
      queryClient.setQueryData(["links", profile?._id], (old) => [...(old || []), newLink]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Error adding link");
    },
  });

  // 3. UPDATE LINK (Optimistic Update)
  const { mutateAsync: updateLinkWrapper } = useMutation({
    mutationFn: async ({ id, updates }) => {
      const { data } = await api.put(`/links/${id}`, updates);
      return data;
    },
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: ["links", profile?._id] });
      const previousLinks = queryClient.getQueryData(["links", profile?._id]);

      // Optimistically update to the new value instantly
      queryClient.setQueryData(["links", profile?._id], (old) =>
        old?.map((link) => (link._id === id ? { ...link, ...updates } : link))
      );

      return { previousLinks };
    },
    onError: (err, variables, context) => {
      // Revert if mutation fails
      queryClient.setQueryData(["links", profile?._id], context.previousLinks);
      toast.error("Failed to update link");
    },
    onSettled: () => {
      // Sync with server in background
      queryClient.invalidateQueries({ queryKey: ["links", profile?._id] });
    },
  });

  const updateLink = (id, updates) => updateLinkWrapper({ id, updates });

  // 4. DELETE LINK (Optimistic Update)
  const { mutateAsync: deleteLink } = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/links/${id}`);
      return id;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["links", profile?._id] });
      const previousLinks = queryClient.getQueryData(["links", profile?._id]);

      queryClient.setQueryData(["links", profile?._id], (old) =>
        old?.filter((link) => link._id !== id)
      );

      return { previousLinks };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["links", profile?._id], context.previousLinks);
      toast.error("Failed to delete link");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["links", profile?._id] });
    },
  });

  // 5. UPLOAD THUMBNAIL
  const uploadThumbnail = async (id, file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const { data } = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await updateLink(id, { thumbnail_url: data.url });
      return data.url;
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Image upload failed");
      throw error;
    }
  };

  // 6. REORDER LINKS (Optimistic Update)
  const { mutateAsync: reorderLinks } = useMutation({
    mutationFn: async (newLinks) => {
      const updates = newLinks.map((link, index) => ({
        id: link._id,
        sort_order: index,
      }));
      await api.put("/links/reorder", { updates });
    },
    onMutate: async (newLinks) => {
      await queryClient.cancelQueries({ queryKey: ["links", profile?._id] });
      const previousLinks = queryClient.getQueryData(["links", profile?._id]);
      
      // Instantly update UI order
      queryClient.setQueryData(["links", profile?._id], newLinks);
      
      return { previousLinks };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["links", profile?._id], context.previousLinks);
      toast.error("Failed to save order");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["links", profile?._id] });
    },
  });

  // 7. SYNC DYNAMIC LINK
  const { mutateAsync: syncLink } = useMutation({
    mutationFn: async (id) => {
      const { data } = await api.post(`/links/${id}/sync`);
      return data;
    },
    onSuccess: (data, id) => {
      queryClient.setQueryData(["links", profile?._id], (old) =>
        old?.map((link) => (link._id === id ? { ...link, ...data } : link))
      );
    },
  });

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