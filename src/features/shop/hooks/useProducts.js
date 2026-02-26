import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../config/api";
import { useProfile } from "../../../hooks/useProfile";
import toast from "react-hot-toast";

export function useProducts() {
  const { profile } = useProfile();
  const queryClient = useQueryClient();

  // 1. FETCH PRODUCTS
  const { data: products = [], isLoading: loading } = useQuery({
    queryKey: ["products", profile?._id],
    queryFn: async () => {
      const response = await api.get("/products");
      return response.data || [];
    },
    enabled: !!profile?._id,
  });

  // 2. ADD PRODUCT
  const { mutateAsync: addProduct } = useMutation({
    mutationFn: async ({ title, price, product_url, image_url }) => {
      const currentLength = products.length;
      const response = await api.post("/products", {
        title,
        price,
        product_url,
        image_url,
        sort_order: currentLength,
      });
      return response.data;
    },
    onSuccess: (newProduct) => {
      queryClient.setQueryData(["products", profile?._id], (old) => [
        ...(old || []),
        newProduct,
      ]);
    },
    onError: (error) => {
      console.error("Add Error:", error);
      toast.error("Failed to add product");
    },
  });

  // 3. DELETE PRODUCT (Optimistic)
  const { mutateAsync: deleteProduct } = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/products/${id}`);
      return id;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["products", profile?._id] });
      const previousProducts = queryClient.getQueryData([
        "products",
        profile?._id,
      ]);

      queryClient.setQueryData(["products", profile?._id], (old) =>
        old?.filter((p) => p._id !== id),
      );

      return { previousProducts };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(
        ["products", profile?._id],
        context.previousProducts,
      );
      toast.error("Failed to delete");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products", profile?._id] });
    },
    onSuccess: () => {
      toast.success("Product deleted");
    },
  });

  // 4. TOGGLE ACTIVE STATUS (Optimistic)
  const { mutateAsync: toggleProductActiveWrapper } = useMutation({
    mutationFn: async ({ id, isActive }) => {
      await api.put(`/products/${id}`, { is_active: isActive });
    },
    onMutate: async ({ id, isActive }) => {
      await queryClient.cancelQueries({ queryKey: ["products", profile?._id] });
      const previousProducts = queryClient.getQueryData([
        "products",
        profile?._id,
      ]);

      queryClient.setQueryData(["products", profile?._id], (old) =>
        old?.map((p) => (p._id === id ? { ...p, is_active: isActive } : p)),
      );

      return { previousProducts };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(
        ["products", profile?._id],
        context.previousProducts,
      );
      toast.error("Update failed");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products", profile?._id] });
    },
  });

  const toggleProductActive = (id, isActive) =>
    toggleProductActiveWrapper({ id, isActive });

  // 5. UPLOAD IMAGE
  const uploadProductImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const uploadRes = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return uploadRes.data.url;
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Image upload failed");
      throw error;
    }
  };

  return {
    products,
    loading,
    addProduct,
    deleteProduct,
    toggleProductActive,
    uploadProductImage,
  };
}
