export default async (request, context) => {
  const url = new URL(request.url);
  const path = url.pathname;

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

  const username = path.split("/")[1];
  if (!username) return context.next();

  const response = await context.next();
  let html = await response.text();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); 

    const apiRes = await fetch(
      `https://reachme-1fqo.onrender.com/api/profiles/${username}`,
      { signal: controller.signal }
    );

    clearTimeout(timeoutId);

    if (apiRes.ok) {
      const data = await apiRes.json();
      const profile = data.profile;

      if (profile) {
        const escapeQuotes = (str) => (str ? str.replace(/"/g, '&quot;') : "");

        const title = escapeQuotes(profile.full_name || `@${profile.username}`);
        
        let imageUrl = profile.avatar_url;
        if (!imageUrl || imageUrl.includes("share.google") || imageUrl.includes("drive.google")) {
            imageUrl = `https://api.dicebear.com/7.x/initials/png?seed=${profile.username}`;
        }
        const image = escapeQuotes(imageUrl);
        
        const profileUrl = `https://reachme.netlify.app/${profile.username}`;
        
        // ✅ FIX: No more artificial padding! If they have a bio, use exactly that. 
        // If it's empty, use a short default. This stops WhatsApp from adding "..."
        let rawDesc = profile.bio && profile.bio.trim() !== "" 
          ? profile.bio 
          : `Check out ${profile.username}'s official profile.`;
          
        const desc = escapeQuotes(rawDesc);

        const customMetaTags = `
          <meta property="og:title" content="${title}" />
          <meta property="og:description" content="${desc}" />
          <meta property="og:image" content="${image}" />
          <meta property="og:image:secure_url" content="${image}" />
          <meta property="og:image:type" content="image/jpeg" />
          <meta property="og:url" content="${profileUrl}" />
          <meta property="og:site_name" content="ReachMe" />
          <meta property="og:type" content="profile" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="${title}" />
          <meta name="twitter:description" content="${desc}" />
          <meta name="twitter:image" content="${image}" />
          <meta name="twitter:domain" content="reachme.netlify.app" />
          <link rel="canonical" href="${profileUrl}" />
        `;

        html = html.replace(/<meta property="og:[^>]*>/gi, "");
        html = html.replace(/<meta name="twitter:[^>]*>/gi, "");
        html = html.replace(/<link rel="canonical"[^>]*>/gi, "");
        html = html.replace(/<meta name="description"[^>]*>/gi, "");

        html = html.replace("</head>", `${customMetaTags}\n</head>`);
        html = html.replace(/<title>(.*?)<\/title>/, `<title>${title} | ReachMe</title>`);
      }
    }
  } catch (err) {
    console.error("Edge Function Error or Timeout:", err);
  }

  return new Response(html, {
    headers: { "content-type": "text/html" },
  });
};