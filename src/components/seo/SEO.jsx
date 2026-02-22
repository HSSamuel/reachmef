import { Helmet } from "react-helmet-async";

export function SEO({ title, description, image, url }) {
  const siteTitle = "ReachMe";
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const defaultDesc =
    "One link for all your content. Create your free profile today.";
  const metaDesc = description || defaultDesc;
  const metaImage = image || `${window.location.origin}/logo.png`;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDesc} />

      {/* Open Graph / Facebook / WhatsApp */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url || window.location.href} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:image" content={metaImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDesc} />
      <meta name="twitter:image" content={metaImage} />
    </Helmet>
  );
}
