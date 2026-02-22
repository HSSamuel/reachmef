import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Lock, ChevronRight } from "lucide-react";
import { cn } from "../../../lib/utils";
import axios from "axios";

export function PublicLink({
  link,
  buttonStyle = "rounded-full",
  themeColor,
  isDark,
}) {
  const [isLocked, setIsLocked] = useState(!!link.gate_code);
  const [showInput, setShowInput] = useState(false);
  const [pin, setPin] = useState("");
  const [shake, setShake] = useState(false);

  const accentColor = themeColor || "#6366f1";

  // --- ANALYTICS ---
  const trackClick = async () => {
    try {
      // MONGODB FIX: Send request to your express server to increment click using _id
      await axios.post(`http://localhost:5000/api/links/${link._id}/click`);
    } catch (err) {
      console.error("Tracking error", err);
    }
  };

  // --- STYLE HELPER ---
  const getStyleClasses = () => {
    const baseColors = isDark
      ? "bg-white/10 hover:bg-white/20 text-white border-white/20"
      : "bg-white hover:bg-slate-50 text-slate-900 border-slate-200";

    switch (buttonStyle) {
      case "rounded-xl":
        return `rounded-xl border ${baseColors}`;
      case "rounded-none":
        return `rounded-none border ${baseColors}`;
      case "shadow-hard":
        return `rounded-lg border-2 border-slate-900 bg-white text-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:shadow-none`;
      default:
        return `rounded-full border ${baseColors}`;
    }
  };

  const textColorClass =
    buttonStyle === "shadow-hard"
      ? "text-slate-500"
      : isDark
        ? "text-white/60"
        : "text-slate-500";

  const borderColor =
    buttonStyle === "shadow-hard"
      ? undefined
      : isDark
        ? "rgba(255,255,255,0.2)"
        : "rgba(226,232,240,1)";

  const handleUnlock = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (pin === link.gate_code) {
      setIsLocked(false);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 300);
      setPin("");
    }
  };

  // --- SMART EMBED DETECTORS ---

  // 1. YouTube
  const getYouTubeId = (url) => {
    const match = url.match(
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/,
    );
    return match && match[2].length === 11 ? match[2] : null;
  };
  const videoId = getYouTubeId(link.url);

  // 2. Spotify
  const isSpotify = link.url.includes("open.spotify.com");
  const getSpotifyEmbed = (url) => {
    const match = url.match(
      /open\.spotify\.com\/(track|album|playlist|episode)\/([a-zA-Z0-9]+)/,
    );
    if (!match) return null;
    return `https://open.spotify.com/embed/${match[1]}/${match[2]}`;
  };

  // 3. Twitter / X
  const isTwitter =
    link.url.includes("twitter.com") || link.url.includes("x.com");

  // 4. Calendly / Cal.com
  const isCalendar =
    link.url.includes("calendly.com") || link.url.includes("cal.com");

  // 5. Typeform / Tally
  const isForm =
    link.url.includes("typeform.com") || link.url.includes("tally.so");

  // --- RENDERERS ---

  // LOCKED STATE
  if (isLocked) {
    return (
      <motion.div
        animate={shake ? { x: [-5, 5, -5, 5, 0] } : {}}
        className={`w-full max-w-[95%] mx-auto p-4 backdrop-blur-md border shadow-sm mb-4 cursor-pointer transition-all ${
          isDark
            ? "bg-white/10 border-white/20 text-white rounded-2xl"
            : "bg-white border-slate-200 text-slate-600 rounded-2xl"
        }`}
        onClick={() => setShowInput(true)}
      >
        {!showInput ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isDark ? "bg-white/20" : "bg-slate-100"
                }`}
              >
                <Lock size={18} />
              </div>
              <span className="font-medium">Locked Link</span>
            </div>
            <Lock size={16} className="opacity-50" />
          </div>
        ) : (
          <form onSubmit={handleUnlock} className="flex gap-2">
            <input
              type="password"
              placeholder="Enter PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="flex-1 bg-transparent border border-current/20 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-current/50"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
            <button
              type="submit"
              className="px-4 rounded-xl text-sm font-bold contrast-more:bg-black contrast-more:text-white"
              style={{ backgroundColor: accentColor, color: "#fff" }}
            >
              Unlock
            </button>
          </form>
        )}
      </motion.div>
    );
  }

  // YOUTUBE EMBED
  if (videoId) {
    return (
      <EmbedWrapper>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          className="w-full h-full rounded-2xl"
          title={link.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </EmbedWrapper>
    );
  }

  // SPOTIFY EMBED
  if (isSpotify) {
    const embedUrl = getSpotifyEmbed(link.url);
    if (embedUrl) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[95%] mx-auto mb-4"
        >
          <iframe
            src={embedUrl}
            width="100%"
            height="80"
            allow="encrypted-media"
            className="rounded-2xl shadow-md border border-white/20"
          ></iframe>
        </motion.div>
      );
    }
  }

  // TWITTER / X EMBED
  if (isTwitter) {
    return (
      <div className="w-full max-w-[95%] mx-auto mb-4 overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-200">
        <TwitterEmbed url={link.url} isDark={isDark} />
      </div>
    );
  }

  // CALENDAR & FORMS EMBED (Iframe)
  if (isCalendar || isForm) {
    return (
      <EmbedWrapper height="h-96">
        <iframe
          src={link.url}
          className="w-full h-full rounded-2xl bg-white"
          title={link.title}
        />
      </EmbedWrapper>
    );
  }

  // STANDARD LINK
  return (
    <motion.a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={trackClick}
      whileHover={buttonStyle !== "shadow-hard" ? { scale: 1.02 } : {}}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "flex items-center w-full max-w-[95%] mx-auto p-2 pr-4 mb-4 transition-all duration-200 backdrop-blur-sm group shadow-sm",
        getStyleClasses(),
      )}
      style={{ borderColor: borderColor }}
    >
      <div
        className={`w-12 h-12 overflow-hidden mr-4 flex-shrink-0 flex items-center justify-center transition-colors ${
          buttonStyle === "rounded-none" ? "rounded-none" : "rounded-xl"
        }`}
        style={{
          backgroundColor:
            buttonStyle === "shadow-hard"
              ? "rgba(241,245,249,1)"
              : isDark
                ? "rgba(255,255,255,0.1)"
                : "rgba(241,245,249,1)",
          color: accentColor,
        }}
      >
        {link.thumbnail_url ? (
          <img
            src={link.thumbnail_url}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <ExternalLink size={20} />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-bold truncate text-sm md:text-base">
          {link.title}
        </h3>
        <p className={`text-xs truncate transition-colors ${textColorClass}`}>
          {link.url.replace(/^https?:\/\//, "")}
        </p>
      </div>

      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
          buttonStyle === "shadow-hard"
            ? "bg-slate-50 text-slate-400"
            : isDark
              ? "bg-white/10 text-white/50"
              : "bg-slate-50 text-slate-400"
        }`}
      >
        <ChevronRight
          size={16}
          className="group-hover:text-current"
          style={{ color: "inherit" }}
        />
      </div>
    </motion.a>
  );
}

// --- HELPERS ---

function EmbedWrapper({ children, height = "aspect-video" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`w-full max-w-[95%] mx-auto mb-4 rounded-2xl overflow-hidden shadow-lg border border-white/20 bg-black/5 ${height} relative group`}
    >
      {children}
    </motion.div>
  );
}

// Lightweight Twitter Embed using native widgets.js
function TwitterEmbed({ url, isDark }) {
  const containerRef = useRef(null);

  useEffect(() => {
    // 1. Load Script if not present
    if (!window.twttr) {
      const script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      document.body.appendChild(script);
    }

    // 2. Scan for tweets once script is loaded
    const interval = setInterval(() => {
      if (window.twttr && containerRef.current) {
        window.twttr.widgets.load(containerRef.current);
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [url]);

  return (
    <div ref={containerRef} className="flex justify-center bg-white p-2">
      <blockquote
        className="twitter-tweet"
        data-theme={isDark ? "dark" : "light"}
        data-dnt="true"
      >
        <a href={url}>Loading Tweet...</a>
      </blockquote>
    </div>
  );
}
