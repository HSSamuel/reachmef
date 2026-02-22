import { useLinks } from "../../editor/hooks/useLinks";
import { useProducts } from "../../shop/hooks/useProducts";
import { useAuthStore } from "../../../store/authStore";
import { PublicLink } from "../../public-profile/components/PublicLink";
import { SubscribeBlock } from "../../public-profile/components/SubscribeBlock";
import {
  Instagram,
  Twitter,
  Linkedin,
  Github,
  Youtube,
  Facebook,
  MessageCircle,
  Heart,
  Phone,
  Music2,
  Ghost,
  Gamepad2,
  Mic2,
  Mail,
} from "lucide-react";

export function PhonePreview({ profile }) {
  const { user } = useAuthStore();
  const { links } = useLinks();

  if (!profile)
    return (
      <div className="w-[320px] h-[650px] bg-slate-900 rounded-[3rem] border-[12px] border-slate-900 flex items-center justify-center text-slate-500 font-bold">
        Loading...
      </div>
    );

  // ✅ MONGODB FIX: Fallback logic without user_metadata
  const displayName = profile.full_name || profile.username || "Creator";

  const bgStyle = profile.background_url
    ? {
        backgroundImage: `url(${profile.background_url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : { backgroundColor: profile.background_color || "#f8fafc" };

  const isDarkTheme =
    !profile.background_url &&
    getContrastYIQ(profile.background_color || "#f8fafc") === "white";

  const getSocialLink = (platform, value) => {
    if (!value) return null;
    if (platform === "phone") return `tel:${value}`;
    if (platform === "email") {
      return `https://mail.google.com/mail/?view=cm&fs=1&to=${value}`;
    }
    if (value.startsWith("http") || value.startsWith("//")) return value;
    return `https://${value}`;
  };

  return (
    <div className="w-[320px] h-[650px] border-[12px] border-slate-900 rounded-[3rem] bg-slate-900 shadow-2xl overflow-hidden ring-4 ring-slate-200 mx-auto origin-top scale-[0.8] sm:scale-100 transition-transform relative">
      {/* Dynamic Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-xl z-30 flex justify-center items-end pb-1.5">
        <div className="w-12 h-1 bg-slate-800 rounded-full"></div>
      </div>

      <div
        className="w-full h-full overflow-y-auto no-scrollbar pb-24 pt-12 px-4 transition-colors duration-300 scrollbar-hide relative"
        style={{ ...bgStyle, fontFamily: profile.font_family || "Inter" }}
      >
        {profile.background_url && (
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/5 pointer-events-none z-0"></div>
        )}

        <div className="relative z-10 flex flex-col gap-5">
          {/* 1. PROFILE HEADER */}
          <div className="flex flex-col items-center text-center mt-2">
            <div className="w-20 h-20 rounded-full border-[3px] border-white shadow-lg overflow-hidden mb-3 bg-white shrink-0">
              <img
                src={
                  profile.avatar_url ||
                  `https://api.dicebear.com/7.x/initials/svg?seed=${displayName}`
                }
                className="w-full h-full object-cover"
                alt="Avatar"
              />
            </div>

            <div
              className={`px-4 py-2 rounded-2xl transition-colors duration-300 ${
                profile.background_url
                  ? "bg-white/80 backdrop-blur-md shadow-sm border border-white/40"
                  : ""
              }`}
            >
              <h2
                className={`font-bold text-sm leading-tight transition-colors duration-300 ${
                  isDarkTheme ? "text-white" : "text-slate-900"
                }`}
              >
                {displayName}
              </h2>

              {profile.bio && (
                <p
                  className={`text-[10px] mt-1 leading-relaxed max-w-[200px] mx-auto transition-colors duration-300 ${
                    isDarkTheme ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  {profile.bio}
                </p>
              )}
            </div>
          </div>

          {/* 2. SOCIAL ICONS */}
          <div className="flex items-center justify-center gap-2.5 flex-wrap px-2">
            <SocialIcon
              Icon={Mail}
              url={getSocialLink("email", profile.social_email)}
              color="#EA4335"
            />
            <SocialIcon
              Icon={Phone}
              url={getSocialLink("phone", profile.social_phone)}
              color="#16a34a"
            />
            <SocialIcon
              Icon={MessageCircle}
              url={profile.social_whatsapp}
              color="#25D366"
            />
            <SocialIcon
              Icon={Instagram}
              url={profile.social_instagram}
              color="#E1306C"
            />
            <SocialIcon
              Icon={Music2}
              url={profile.social_tiktok}
              color="#000000"
            />
            <SocialIcon
              Icon={Twitter}
              url={profile.social_twitter}
              color="#1DA1F2"
            />
            <SocialIcon
              Icon={Youtube}
              url={profile.social_youtube}
              color="#FF0000"
            />
            <SocialIcon
              Icon={Facebook}
              url={profile.social_facebook}
              color="#1877F2"
            />
            <SocialIcon
              Icon={Linkedin}
              url={profile.social_linkedin}
              color="#0077B5"
            />
            <SocialIcon
              Icon={Ghost}
              url={profile.social_snapchat}
              color="#FFFC00"
            />
            <SocialIcon
              Icon={Gamepad2}
              url={profile.social_discord}
              color="#5865F2"
            />
            <SocialIcon
              Icon={Mic2}
              url={profile.social_spotify}
              color="#1DB954"
            />
            <SocialIcon
              Icon={Github}
              url={profile.social_github}
              color="#181717"
            />
          </div>

          {/* 3. FEATURES */}
          {(profile.tipping_enabled || profile.newsletter_enabled) && (
            <div className="space-y-3">
              {profile.tipping_enabled && (
                <button className="w-full max-w-[95%] mx-auto flex items-center justify-center gap-2 bg-white shadow-sm border border-slate-100 text-slate-800 px-4 py-2.5 rounded-xl font-bold text-xs hover:scale-[1.02] transition-transform active:scale-95">
                  <Heart size={14} className="text-red-500 fill-red-500" />
                  {profile.tipping_title || "Support Me"}
                </button>
              )}

              {profile.newsletter_enabled && (
                <div className="w-full">
                  <SubscribeBlock
                    title={profile.newsletter_title}
                    themeColor={profile.theme_color}
                    profileId={profile._id} // ✅ MONGODB FIX
                  />
                </div>
              )}
            </div>
          )}

          {/* 4. SHOP CAROUSEL */}
          <ProductGrid isDarkTheme={isDarkTheme} />

          {/* 5. LINKS LIST */}
          <div className="space-y-3 pb-8">
            {links
              .filter((l) => l.is_active)
              .map((link) => (
                <PublicLink
                  key={link._id} // ✅ MONGODB FIX
                  link={link}
                  buttonStyle={profile.button_style}
                  themeColor={profile.theme_color}
                  isDark={isDarkTheme}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---
function ProductGrid({ isDarkTheme }) {
  const { products } = useProducts();
  const activeProducts = products.filter((p) => p.is_active);

  if (activeProducts.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-2 opacity-60 px-1">
        <div
          className={`h-px flex-1 transition-colors ${isDarkTheme ? "bg-white/30" : "bg-slate-300"}`}
        ></div>
        <span
          className={`text-[9px] font-bold uppercase tracking-widest transition-colors ${isDarkTheme ? "text-white/70" : "text-slate-500"}`}
        >
          Shop
        </span>
        <div
          className={`h-px flex-1 transition-colors ${isDarkTheme ? "bg-white/30" : "bg-slate-300"}`}
        ></div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {activeProducts.map((product) => (
          <a
            key={product._id} // ✅ MONGODB FIX
            href={product.product_url}
            target="_blank"
            rel="noreferrer"
            className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all block group border border-slate-100"
          >
            <div className="aspect-square bg-slate-50 relative overflow-hidden">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  className="w-full h-full object-cover"
                  alt=""
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-200 font-bold text-[8px]">
                  NO IMG
                </div>
              )}
              {product.price && (
                <div className="absolute bottom-1 right-1 bg-black/60 backdrop-blur-sm text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                  {product.price}
                </div>
              )}
            </div>
            <div className="p-2">
              <p className="text-[10px] font-bold text-slate-800 truncate group-hover:text-indigo-600">
                {product.title}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

function SocialIcon({ Icon, url, color }) {
  if (!url) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="w-8 h-8 bg-white rounded-full shadow-sm border border-slate-100 hover:scale-110 transition-transform flex items-center justify-center"
      style={{ color: color }}
    >
      <Icon size={16} fill={color === "#FFFC00" ? "currentColor" : "none"} />
    </a>
  );
}

function getContrastYIQ(hexcolor) {
  if (!hexcolor) return "black";
  hexcolor = hexcolor.replace("#", "");
  var r = parseInt(hexcolor.substr(0, 2), 16);
  var g = parseInt(hexcolor.substr(2, 2), 16);
  var b = parseInt(hexcolor.substr(4, 2), 16);
  var yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "black" : "white";
}
