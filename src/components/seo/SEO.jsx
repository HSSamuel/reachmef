import { Helmet } from "react-helmet-async";

export function SEO({ title, description, image, url }) {
  const siteTitle = "ReachMe";
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const defaultDesc =
    "One link for all your content. Create your free profile today.";
  const metaDesc = description || defaultDesc;
  const metaImage = image || `${window.location.origin}/logo.png`;
  const finalUrl = url || window.location.href;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDesc} />

      {/* Open Graph / Facebook / WhatsApp */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:site_name" content="ReachMe" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDesc} />
      <meta name="twitter:image" content={metaImage} />
      <meta name="twitter:domain" content="reachme.netlify.app" />
      
      <link rel="canonical" href={finalUrl} />
    </Helmet>
  );
}