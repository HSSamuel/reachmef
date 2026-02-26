import { useState, useEffect } from "react";
import { api } from "../../../config/api"; 

export const usePublicProfile = (username) => {
  const [profile, setProfile] = useState(null);
  const [links, setLinks] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!username) return;

    if (username.toLowerCase() === "me") {
      setError("Invalid profile URL");
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        setLoading(true);
        // ✅ ONE single request gets everything
        const { data } = await api.get(`/profiles/${username}`);

        if (!data.profile) throw new Error("Profile not found");

        setProfile(data.profile);
        setLinks(data.links || []);
        setProducts(data.products || []);
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