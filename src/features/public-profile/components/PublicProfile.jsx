import { useParams } from "react-router-dom";
import { usePublicProfile } from "../hooks/usePublicProfile";
import { PublicLink } from "./PublicLink";
import {
  Loader2,
  AlertCircle,
  ShoppingBag,
  Heart,
  UserPlus,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Instagram,
  Twitter,
  Linkedin,
  Github,
  Youtube,
  Phone,
  Facebook,
  Music2,
  Ghost,
  Gamepad2,
  Mic2,
  Twitch,
  Mail,
} from "lucide-react";
import { SEO } from "../../../components/seo/SEO";
import { SubscribeBlock } from "./SubscribeBlock";

export function PublicProfile() {
  const { username } = useParams();
  const { profile, links, products, loading, error } =
    usePublicProfile(username);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-slate-300" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
        <h1 className="text-2xl font-bold text-slate-900">Profile Not Found</h1>
      </div>
    );
  }

  const getFontStack = (font) => {
    switch (font) {
      case "Playfair Display":
        return '"Playfair Display", serif';
      case "Space Mono":
        return '"Space Mono", monospace';
      case "Pacifico":
        return '"Pacifico", cursive';
      case "DM Sans":
        return '"DM Sans", sans-serif';
      default:
        return '"Inter", sans-serif';
    }
  };

  const getContrastYIQ = (hexcolor) => {
    if (!hexcolor) return "black";
    hexcolor = hexcolor.replace("#", "");
    var r = parseInt(hexcolor.substr(0, 2), 16);
    var g = parseInt(hexcolor.substr(2, 2), 16);
    var b = parseInt(hexcolor.substr(4, 2), 16);
    var yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? "black" : "white";
  };

  const getSocialLink = (platform, value) => {
    if (!value) return null;
    if (platform === "phone") return `tel:${value}`;
    if (platform === "email") {
      return `mailto:${value}`;
    }
    if (value.startsWith("http") || value.startsWith("//")) return value;
    return `https://${value}`;
  };

  const bgStyle = profile.background_url
    ? {
        backgroundImage: `url(${profile.background_url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }
    : { backgroundColor: profile.background_color || "#f8fafc" };

  const isDarkTheme =
    !profile.background_url &&
    getContrastYIQ(profile.background_color || "#f8fafc") === "white";

  const isDarkBg = profile.background_url || isDarkTheme;

  const displayAvatar =
    profile.avatar_url ||
    `https://api.dicebear.com/7.x/initials/png?seed=${profile.username}`;

  const handleSaveContact = () => {
    const socialUrls = [
      profile.social_instagram,
      profile.social_twitter,
      profile.social_linkedin,
      profile.social_youtube,
      profile.social_github,
    ]
      .filter(Boolean)
      .join("\\n");

    const vCardData = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${profile.full_name || profile.username}`,
      `N:;${profile.full_name || profile.username};;;`,
      `NICKNAME:${profile.username}`,
      `NOTE:${profile.bio || "ReachMe Profile"}\\n\\nSocials:\\n${socialUrls}`,
      `URL:${window.location.href}`,
      profile.social_phone ? `TEL;TYPE=CELL:${profile.social_phone}` : "",
      displayAvatar ? `PHOTO;VALUE=URI:${displayAvatar}` : "", 
      "END:VCARD",
    ]
      .filter(Boolean)
      .join("\n");

    const blob = new Blob([vCardData], { type: "text/vcard;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${profile.username}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const tippingBgColor = profile.theme_color || "#ec4899";
  const tippingTextColor = getContrastYIQ(tippingBgColor);

  return (
    <>
      <SEO
        title={profile.full_name || `@${profile.username}`}
        description={
          profile.bio || `Check out ${profile.username}'s profile on ReachMe`
        }
        image={displayAvatar}
        url={window.location.href}
      />

      <div
        className="min-h-screen w-full overflow-x-hidden transition-colors duration-500 flex flex-col items-center justify-center py-8 sm:py-12 px-4"
        style={{
          ...bgStyle,
          fontFamily: getFontStack(profile.font_family),
        }}
      >
        {profile.background_url && (
          <div className="fixed inset-0 bg-black/40 pointer-events-none" />
        )}

        <div
          className={`relative z-10 w-full max-w-[600px] min-h-[500px] rounded-[2.5rem] p-6 sm:p-8 transition-all duration-500 shadow-2xl ${
            isDarkBg
              ? "bg-black/20 backdrop-blur-xl border border-white/10"
              : "bg-white/20 backdrop-blur-xl border border-white/20"
          }`}
        >
          {/* 1. Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center mb-8 w-full"
          >
            <div className="w-24 h-24 sm:w-28 h-28 rounded-full border-[3px] border-white shadow-xl overflow-hidden mb-4 bg-white">
              <img
                src={displayAvatar}
                alt={profile.username}
                className="w-full h-full object-cover"
              />
            </div>

            <h1
              className={`text-3xl md:text-4xl font-extrabold mb-2 tracking-tight transition-colors duration-300 ${
                isDarkBg ? "text-white" : "text-slate-900"
              }`}
            >
              {profile.full_name || `@${profile.username}`}
            </h1>

            {profile.bio && (
              <p
                className={`font-medium text-sm sm:text-base max-w-xs leading-relaxed transition-colors duration-300 ${
                  isDarkBg ? "text-white/80" : "text-slate-600"
                }`}
              >
                {profile.bio}
              </p>
            )}
          </motion.div>

          {/* SOCIAL ICONS */}
          <div className="flex items-center justify-center gap-3 flex-wrap mb-6">
            {profile.social_email && (
              <SocialLink
                Icon={Mail}
                url={getSocialLink("email", profile.social_email)}
                isDark={isDarkBg}
                color="#EA4335"
              />
            )}
            {profile.social_phone && (
              <SocialLink
                Icon={Phone}
                url={getSocialLink("phone", profile.social_phone)}
                isDark={isDarkBg}
                color="#16a34a"
              />
            )}
            {profile.social_whatsapp && (
              <SocialLink
                Icon={WhatsApp} // ✅ Official WhatsApp Icon
                url={profile.social_whatsapp}
                isDark={isDarkBg}
                color="#25D366"
              />
            )}
            {profile.social_instagram && (
              <SocialLink
                Icon={Instagram}
                url={profile.social_instagram}
                isDark={isDarkBg}
                color="#E1306C"
              />
            )}
            {profile.social_tiktok && (
              <SocialLink
                Icon={Music2}
                url={profile.social_tiktok}
                isDark={isDarkBg}
                color="#000000"
              />
            )}
            {profile.social_twitter && (
              <SocialLink
                Icon={Twitter}
                url={profile.social_twitter}
                isDark={isDarkBg}
                color="#1DA1F2"
              />
            )}
            {profile.social_facebook && (
              <SocialLink
                Icon={Facebook}
                url={profile.social_facebook}
                isDark={isDarkBg}
                color="#1877F2"
              />
            )}
            {profile.social_linkedin && (
              <SocialLink
                Icon={Linkedin}
                url={profile.social_linkedin}
                isDark={isDarkBg}
                color="#0077B5"
              />
            )}
            {profile.social_github && (
              <SocialLink
                Icon={Github}
                url={profile.social_github}
                isDark={isDarkBg}
              />
            )}
            {profile.social_youtube && (
              <SocialLink
                Icon={Youtube}
                url={profile.social_youtube}
                isDark={isDarkBg}
                color="#FF0000"
              />
            )}
            {profile.social_snapchat && (
              <SocialLink
                Icon={Ghost}
                url={profile.social_snapchat}
                isDark={isDarkBg}
                color="#FFFC00"
              />
            )}
            {profile.social_discord && (
              <SocialLink
                Icon={Gamepad2}
                url={profile.social_discord}
                isDark={isDarkBg}
                color="#5865F2"
              />
            )}
            {profile.social_spotify && (
              <SocialLink
                Icon={Mic2}
                url={profile.social_spotify}
                isDark={isDarkBg}
                color="#1DB954"
              />
            )}
            {profile.social_twitch && (
              <SocialLink
                Icon={Twitch}
                url={profile.social_twitch}
                isDark={isDarkBg}
                color="#9146FF"
              />
            )}
          </div>

          {/* SAVE CONTACT BUTTON */}
          <div className="flex justify-center mb-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSaveContact}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm shadow-lg transition-all border ${
                isDarkBg
                  ? "bg-white text-slate-900 border-white hover:bg-slate-100"
                  : "bg-slate-900 text-white border-slate-900 hover:bg-slate-800"
              }`}
            >
              <UserPlus size={16} />
              Save Contact
            </motion.button>
          </div>

          {/* Tipping Button */}
          {profile.tipping_enabled && profile.tipping_url && (
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href={profile.tipping_url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center gap-2 w-full max-w-[95%] mx-auto py-2 rounded-xl font-bold shadow-lg mb-8 transition-opacity hover:opacity-90 border border-black/5`}
              style={{
                backgroundColor: tippingBgColor,
                color: tippingTextColor === "black" ? "#0f172a" : "#ffffff",
              }}
            >
              <Heart size={18} fill="currentColor" />
              {profile.tipping_title || "Support Me"}
            </motion.a>
          )}

          {/* Newsletter */}
          {profile.newsletter_enabled && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.02 }}
              className="mb-8 w-full"
            >
              <SubscribeBlock
                profileId={profile._id} 
                title={profile.newsletter_title}
                themeColor={profile.theme_color}
              />
            </motion.div>
          )}

          {/* Product Grid */}
          {products.length > 0 && (
            <div className="w-full mb-8">
              <div className="flex items-center gap-3 mb-4 opacity-80">
                <div
                  className={`h-px flex-1 ${
                    isDarkBg ? "bg-white/30" : "bg-slate-300"
                  }`}
                ></div>
                <h3
                  className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${
                    isDarkBg ? "text-white" : "text-slate-500"
                  }`}
                >
                  <ShoppingBag size={12} /> Shop
                </h3>
                <div
                  className={`h-px flex-1 ${
                    isDarkBg ? "bg-white/30" : "bg-slate-300"
                  }`}
                ></div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {products.map((p) => (
                  <motion.a
                    key={p._id} 
                    href={p.product_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -4 }}
                    className={`p-3 rounded-xl shadow-sm border block group overflow-hidden relative transition-all ${
                      isDarkBg
                        ? "bg-slate-800 border-slate-700 hover:bg-slate-700"
                        : "bg-white border-slate-200 hover:bg-slate-50 hover:shadow-md"
                    }`}
                  >
                    <div className="aspect-square bg-slate-50 rounded-lg mb-2 overflow-hidden">
                      {p.image_url ? (
                        <img
                          src={p.image_url}
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <ShoppingBag />
                        </div>
                      )}
                    </div>
                    <div
                      className={`font-bold text-xs truncate mb-1 ${
                        isDarkBg ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {p.title}
                    </div>

                    <div
                      className={`font-bold text-xs px-2 py-1.5 rounded-lg inline-block shadow-sm ${
                        isDarkBg
                          ? "bg-white text-slate-800"
                          : "bg-slate-800 text-white"
                      }`}
                    >
                      {p.price}
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>
          )}

          {/* Links List */}
          <div className="space-y-3">
            {links.map((link) => (
              <PublicLink
                key={link._id} 
                link={link}
                buttonStyle={profile.button_style}
                themeColor={profile.theme_color}
                isDark={isDarkBg}
              />
            ))}
          </div>

          {/* Footer */}
          <div className="mt-12 text-center">
            <a
              href="/"
              className={`inline-flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity text-xs font-medium ${
                isDarkBg ? "text-white" : "text-slate-900"
              }`}
            >
              <span>Powered by</span>
              <span className="font-bold">ReachMe</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

// Helper for Social Icons
function SocialLink({ Icon, url, isDark, color }) {
  const textColor = color ? color : isDark ? "white" : "#334155";
  return (
    <motion.a
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      href={url}
      target="_blank"
      className={`p-2.5 rounded-full backdrop-blur-sm transition-colors shadow-sm ${
        isDark
          ? "bg-slate-800 border border-slate-700 hover:bg-slate-700"
          : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200"
      }`}
      style={{ color: textColor }}
    >
      <Icon size={20} fill={color === "#FFFC00" ? "currentColor" : "none"} />
    </motion.a>
  );
}

// ✅ Official Custom WhatsApp SVG Component
const WhatsApp = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.305-.885-.653-1.48-1.459-1.653-1.756-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
);