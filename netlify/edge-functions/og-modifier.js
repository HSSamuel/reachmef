export default async (request, context) => {
  const url = new URL(request.url);
  const path = url.pathname;

  // 1. Skip static assets (like .js, .css, .png) and standard routes
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

  // 2. Extract the username from the URL (e.g., /hssamuel -> hssamuel)
  const username = path.split("/")[1];
  if (!username) return context.next();

  // 3. Get the original React index.html
  const response = await context.next();
  let html = await response.text();

  try {
    // 4. Fetch the specific user's profile from your Render backend
    const apiRes = await fetch(
      `https://reachme-1fqo.onrender.com/api/profiles/${username}`,
    );

    if (apiRes.ok) {
      const profile = await apiRes.json();

      const title = profile.full_name || `@${profile.username}`;
      const desc =
        profile.bio || `Check out ${profile.username}'s profile on ReachMe`;
      const image =
        profile.avatar_url ||
        `https://api.dicebear.com/7.x/initials/png?seed=${profile.username}`;

      // 5. Build the specific meta tags for this user
      const customMetaTags = `
        <meta property="og:title" content="${title}" />
        <meta property="og:description" content="${desc}" />
        <meta property="og:image" content="${image}" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="${title}" />
        <meta name="twitter:description" content="${desc}" />
        <meta name="twitter:image" content="${image}" />
      `;

      // 6. Inject the dynamic tags right before the closing </head> tag
      html = html.replace("</head>", `${customMetaTags}\n</head>`);

      // Update the main page title
      html = html.replace(
        /<title>(.*?)<\/title>/,
        `<title>${title} | ReachMe</title>`,
      );
    }
  } catch (err) {
    console.error("Edge Function Error:", err);
  }

  // 7. Return the modified HTML to the social media bot
  return new Response(html, {
    headers: { "content-type": "text/html" },
  });
};
