import { useEffect, useState } from "react";
import { api } from "../../../config/api"; // <-- Replaced supabase with your new api client
import { useProfile } from "../../../hooks/useProfile";
import toast from "react-hot-toast";

export function useProducts() {
  const { profile } = useProfile();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. FETCH PRODUCTS
  useEffect(() => {
    if (!profile?._id) return; // MONGODB FIX: Using _id

    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        setProducts(response.data || []);
      } catch (error) {
        console.error("Fetch Error:", error.message);
        toast.error("Could not load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [profile?._id]); // MONGODB FIX: Using _id

  // 2. ADD PRODUCT
  const addProduct = async ({ title, price, product_url, image_url }) => {
    try {
      // Optimistic Update (Optional: handled by state update below)
      const currentLength = products.length;

      const response = await api.post("/products", {
        title,
        price,
        product_url,
        image_url,
        sort_order: currentLength,
      });

      // Update local state immediately
      setProducts((prev) => [...prev, response.data]);
      return response.data;
    } catch (error) {
      console.error("Add Error:", error);
      toast.error("Failed to add product");
      throw error;
    }
  };

  // 3. DELETE PRODUCT
  const deleteProduct = async (id) => {
    try {
      // Optimistic UI update
      // MONGODB FIX: Using _id
      setProducts((prev) => prev.filter((p) => p._id !== id));

      await api.delete(`/products/${id}`);

      toast.success("Product deleted");
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Failed to delete");
      // Optional: Re-fetch products here if delete fails to sync state
    }
  };

  // 4. TOGGLE ACTIVE STATUS
  const toggleProductActive = async (id, isActive) => {
    try {
      // Optimistic UI update
      // MONGODB FIX: Using _id
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, is_active: isActive } : p)),
      );

      await api.put(`/products/${id}`, { is_active: isActive });
    } catch (error) {
      console.error("Update Error:", error);
      toast.error("Update failed");
    }
  };

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
