export default async (request, context) => {
  const url = new URL(request.url);
  const path = url.pathname;

  // 1. Skip static assets and standard routes
  if (
    path.includes(".") || 
    path.startsWith("/api/") || 
    path === "/" || 
    path === "/login" || 
    path === "/register" || 
    path === "/dashboard"
  ) {
    return context.next();
  }

  // 2. Extract the username from the URL
  const username = path.split("/")[1];
  if (!username) return context.next();

  // 3. Get the original React index.html
  const response = await context.next();
  let html = await response.text();

  try {
    // 4. Fetch the specific user's profile from your Render backend
    const apiRes = await fetch(`https://reachme-1fqo.onrender.com/api/profiles/${username}`);
    
    if (apiRes.ok) {
      const profile = await apiRes.json();

      const title = profile.full_name || `@${profile.username}`;
      const image = profile.avatar_url || `https://api.dicebear.com/7.x/initials/png?seed=${profile.username}`;
      const profileUrl = `https://reachme.netlify.app/${username}`;

      // Create a fallback description > 100 characters for LinkedIn
      const defaultDesc = `Check out ${profile.username}'s official ReachMe profile. Discover all my latest links, exclusive products, social media content, and seamless ways to get in touch with me in one convenient place.`;
      
      let desc = profile.bio || "";
      if (desc.length < 100) {
        desc = desc ? `${desc} | ${defaultDesc}` : defaultDesc;
      }

      // 5. Build the specific meta tags
      const customMetaTags = `
        <meta property="og:title" content="${title}" />
        <meta property="og:description" content="${desc}" />
        <meta property="og:image" content="${image}" />
        <meta property="og:url" content="${profileUrl}" />
        <meta property="og:type" content="profile" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="${title}" />
        <meta name="twitter:description" content="${desc}" />
        <meta name="twitter:image" content="${image}" />
        <link rel="canonical" href="${profileUrl}" />
      `;

      // ✅ THE MAGIC FIX: Aggressively strip out ALL existing default tags so LinkedIn doesn't get confused
      html = html.replace(/<meta property="og:[^>]*>/gi, '');
      html = html.replace(/<meta name="twitter:[^>]*>/gi, '');
      html = html.replace(/<link rel="canonical"[^>]*>/gi, '');
      html = html.replace(/<meta name="description"[^>]*>/gi, '');
      
      // 6. Inject the dynamic tags safely
      html = html.replace("</head>", `${customMetaTags}\n</head>`);
      
      // Update the main page title
      html = html.replace(/<title>(.*?)<\/title>/, `<title>${title} | ReachMe</title>`);
    }
  } catch (err) {
    console.error("Edge Function Error:", err);
  }

  return new Response(html, {
    headers: { "content-type": "text/html" },
  });
};