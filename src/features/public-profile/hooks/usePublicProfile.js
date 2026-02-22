import { useState, useEffect } from "react";
import { api } from "../../../config/api"; // ✅ Use the configured API instance

export const usePublicProfile = (username) => {
  const [profile, setProfile] = useState(null);
  const [links, setLinks] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!username) return;

    // ✅ EDGE CASE FIX: Prevent collision with the private "/me" route
    if (username.toLowerCase() === "me") {
      setError("Invalid profile URL");
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        setLoading(true);
        // 1. Get Profile (Using 'api' automatically uses your Render URL in production)
        const profileRes = await api.get(`/profiles/${username}`);
        const profileData = profileRes.data;

        if (!profileData) throw new Error("Profile not found");

        // 2. Get Links and Products
        const [linksRes, productsRes] = await Promise.all([
          api.get(`/links/public/${profileData._id}`),
          api.get(`/products/public/${profileData._id}`),
        ]);

        setProfile(profileData);
        setLinks(linksRes.data || []);
        setProducts(productsRes.data || []);
      } catch (err) {
        console.error("Public Profile Error:", err);
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [username]);

  return { profile, links, products, loading, error };
};
