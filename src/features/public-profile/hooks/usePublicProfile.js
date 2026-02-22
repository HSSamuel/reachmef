import { useState, useEffect } from "react";
import axios from "axios"; // ✅ Using axios directly because this is a public route (no token required)

export const usePublicProfile = (username) => {
  const [profile, setProfile] = useState(null);
  const [links, setLinks] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!username) return;

    async function fetchData() {
      try {
        setLoading(true);
        // 1. Get Profile
        const profileRes = await axios.get(
          `http://localhost:5000/api/profiles/${username}`,
        );
        const profileData = profileRes.data;

        if (!profileData) throw new Error("Profile not found");

        // 2. Get Links and Products
        const [linksRes, productsRes] = await Promise.all([
          axios.get(
            `http://localhost:5000/api/links/public/${profileData._id}`,
          ),
          axios.get(
            `http://localhost:5000/api/products/public/${profileData._id}`,
          ),
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
