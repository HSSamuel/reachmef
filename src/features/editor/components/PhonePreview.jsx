import { useState } from "react";
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
  Heart,
  Phone,
  Music2,
  Ghost,
  Gamepad2,
  Mic2,
  Mail,
  X,
  Play,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function PhonePreview({ profile }) {
  const { user } = useAuthStore();
  const { links } = useLinks();

  const [isVideoOpen, setIsVideoOpen] = useState(false);

  if (!profile)
    return (
      <div className="w-[320px] h-[650px] bg-slate-900 rounded-[3rem] border-[12px] border-slate-900 flex items-center justify-center text-slate-500 font-bold">
        Loading...
      </div>
    );

  const displayName = profile.full_name || profile.username || "Creator";

  const getContrastYIQ = (colorString) => {
    if (!colorString) return "black";

    const hexMatch = colorString.match(/#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})/);
    let hexcolor = hexMatch ? hexMatch[0] : "#ffffff";

    hexcolor = hexcolor.replace("#", "");
    if (hexcolor.length === 3) {
      hexcolor = hexcolor
        .split("")
        .map((char) => char + char)
        .join("");
    }

    var r = parseInt(hexcolor.substr(0, 2), 16);
    var g = parseInt(hexcolor.substr(2, 2), 16);
    var b = parseInt(hexcolor.substr(4, 2), 16);
    var yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? "black" : "white";
  };

  const bgStyle = profile.background_url
    ? {
        backgroundImage: `url(${profile.background_url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : { background: profile.background_color || "#f8fafc" };

  const isDarkTheme =
    !profile.background_url &&
    getContrastYIQ(profile.background_color || "#f8fafc") === "white";

  const getSocialLink = (platform, value) => {
    if (!value) return null;
    if (platform === "phone") return `tel:${value}`;
    if (platform === "email") {
      return `mailto:${value}`;
    }
    if (value.startsWith("http") || value.startsWith("//")) return value;
    return `https://${value}`;
  };

  return (
    <>
      <div className="w-[320px] h-[650px] border-[12px] border-slate-900 rounded-[3rem] bg-slate-900 shadow-2xl overflow-hidden ring-4 ring-slate-200 mx-auto origin-top scale-[0.8] sm:scale-100 transition-transform relative">
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
              <div className="relative mb-3">
                <div
                  onClick={() =>
                    profile.story_video_url && setIsVideoOpen(true)
                  }
                  className={`relative rounded-full shrink-0 ${
                    profile.story_video_url
                      ? "p-1 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 cursor-pointer hover:scale-105 transition-transform shadow-xl shadow-pink-500/30"
                      : "p-0"
                  }`}
                >
                  <div className="w-20 h-20 rounded-full border-[3px] border-white overflow-hidden bg-white shadow-lg">
                    <img
                      src={
                        profile.avatar_url ||
                        `https://api.dicebear.com/7.x/initials/svg?seed=${displayName}`
                      }
                      className="w-full h-full object-cover"
                      alt="Avatar"
                    />
                  </div>
                </div>

                {profile.story_video_url && (
                  <div
                    onClick={() => setIsVideoOpen(true)}
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-slate-900 text-white px-2.5 py-1 rounded-full shadow-xl border-[1.5px] border-white cursor-pointer hover:scale-110 transition-transform z-20 animate-float"
                  >
                    <Play size={8} className="fill-white" />
                    <span className="text-[8px] font-bold uppercase tracking-widest whitespace-nowrap">
                      Play
                    </span>
                  </div>
                )}
              </div>

              <div
                className={`px-4 py-2 rounded-2xl transition-colors duration-300 w-full max-w-full flex flex-col items-center ${
                  profile.background_url
                    ? "bg-white/80 backdrop-blur-md shadow-sm border border-white/40"
                    : ""
                }`}
              >
                {/* ✅ FIX: Made heading single line without "..." truncation */}
                <div className="w-full max-w-full overflow-x-auto no-scrollbar flex justify-center">
                  <h2
                    className={`font-bold flex items-baseline gap-1.5 transition-colors duration-300 whitespace-nowrap px-1 ${
                      isDarkTheme ? "text-white" : "text-slate-900"
                    }`}
                  >
                    <span className="text-[1.1rem]">{displayName}</span>
                    {profile.profile_title && (
                      <span
                        className={`text-[0.7rem] font-medium tracking-wide pb-[1px] ${
                          isDarkTheme ? "text-white/70" : "text-slate-500"
                        }`}
                      >
                        {profile.profile_title}
                      </span>
                    )}
                  </h2>
                </div>

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
                Icon={WhatsApp}
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
                      profileId={profile._id}
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
                    key={link._id}
                    link={link}
                    buttonStyle={profile.button_style}
                    themeColor={profile.theme_color}
                    isDark={isDarkTheme}
                  />
                ))}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isVideoOpen && profile.story_video_url && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center rounded-[2.5rem] overflow-hidden p-4"
            >
              <div className="relative w-full h-full max-h-[90%] bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/20 flex flex-col justify-center items-center">
                <video
                  src={profile.story_video_url}
                  autoPlay
                  controls
                  playsInline
                  className="w-full h-full object-contain"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsVideoOpen(false);
                  }}
                  className="absolute top-3 right-3 w-8 h-8 bg-black/60 text-white rounded-full flex items-center justify-center backdrop-blur-md hover:bg-black/80 transition-colors z-50 border border-white/10"
                >
                  <X size={16} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

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
            key={product._id}
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

const WhatsApp = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.305-.885-.653-1.48-1.459-1.653-1.756-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
);
