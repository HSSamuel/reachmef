import { useState, useEffect } from "react";
import { useProfile } from "../../../hooks/useProfile";
import { PhonePreview } from "../../editor/components/PhonePreview";
import {
  Upload,
  X,
  Instagram,
  Twitter,
  Linkedin,
  Share2,
  LayoutDashboard,
  Heart,
  Type,
  Loader2,
  Eye,
  Palette,
  Layout,
  ChevronDown,
  ChevronUp,
  Phone,
  Music2,
  Ghost,
  Facebook,
  Youtube,
  Gamepad2,
  Mic2,
  Github,
  Twitch,
  Check,
  Mail,
  Video,
} from "lucide-react";
import { api } from "../../../config/api";
import { Switch } from "../../../components/ui/Switch";
import { Input } from "../../../components/ui/Input";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export function AppearanceEditor() {
  const { profile, loading, updateProfile, deleteFile } = useProfile();
  const [uploading, setUploading] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Local state for username
  const [usernameInput, setUsernameInput] = useState("");

  useEffect(() => {
    if (profile?.username) {
      setUsernameInput(profile.username);
    }
  }, [profile?.username]);

  const [openSection, setOpenSection] = useState("profile");

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleUsernameSave = async () => {
    if (!usernameInput || usernameInput.trim() === "") return;
    if (usernameInput === profile.username) return;

    try {
      await updateProfile({ username: usernameInput.trim() });
      toast.success("Username updated!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save. Username might be taken.");
      setUsernameInput(profile.username || "");
    }
  };

  const handleFileUpload = async (e, field) => {
    try {
      const isVideo = field === "story_video_url";
      if (isVideo) {
        setUploadingVideo(true);
      } else {
        setUploading(true);
      }

      const file = e.target.files[0];
      if (!file) return;

      if (isVideo && file.size > 20 * 1024 * 1024) {
        throw new Error("Video must be under 20MB");
      }

      // ✅ 1. Delete the old file from Cloudinary if replacing an existing one
      const oldFileUrl = profile[field];
      if (oldFileUrl) {
        await deleteFile(oldFileUrl);
      }

      const formData = new FormData();
      formData.append("image", file);

      // ✅ 2. Upload the new file
      const { data } = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await updateProfile({ [field]: data.url });
      if (isVideo) {
        toast.success("Story Video uploaded!");
      } else {
        toast.success("Image uploaded!");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Upload failed");
    } finally {
      setUploading(false);
      setUploadingVideo(false);
    }
  };

  // ✅ Handle physical removal of the Story Video
  const handleRemoveStory = async () => {
    if (profile.story_video_url) {
      await deleteFile(profile.story_video_url); // Wipe from Cloudinary
      await updateProfile({ story_video_url: "" }); // Clear from DB
      toast.success("Story removed!");
    }
  };

  // ✅ Handle physical removal of the Background Image
  const handleRemoveBackground = async (e) => {
    e.stopPropagation();
    if (profile.background_url) {
      await deleteFile(profile.background_url); // Wipe from Cloudinary
      await updateProfile({ background_url: null }); // Clear from DB
      toast.success("Background removed!");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-slate-300" size={32} />
      </div>
    );

  if (!profile) return null;

  return (
    <div className="max-w-7xl mx-auto pb-24 px-4 relative">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Appearance</h1>
          <p className="text-slate-500 mt-1 text-sm">
            Customize your page branding.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        {/* LEFT COLUMN: ACCORDION EDITOR */}
        <div className="xl:col-span-2 space-y-4">
          {/* 1. PROFILE DETAILS (Blue) */}
          <AccordionItem
            title="Profile & Story"
            icon={<Layout size={18} />}
            isOpen={openSection === "profile"}
            onClick={() => toggleSection("profile")}
            colorClass="bg-blue-50/50 border-blue-100 hover:border-blue-200"
          >
            <div className="flex flex-col-reverse sm:flex-row items-center sm:items-start gap-5">
              {/* Inputs Container */}
              <div className="flex-1 space-y-3 w-full min-w-0">
                {/* Username Input */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">
                    Username
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={usernameInput}
                      onChange={(e) =>
                        setUsernameInput(e.target.value.replace("@", ""))
                      }
                      onBlur={handleUsernameSave}
                      onKeyDown={(e) => e.key === "Enter" && e.target.blur()}
                      placeholder="username"
                      className="w-full text-sm font-bold text-slate-900 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:font-normal"
                    />
                    {usernameInput && usernameInput === profile.username && (
                      <div className="absolute right-3 top-2.5 text-green-500">
                        <Check size={16} />
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Click outside the box to save.
                  </p>
                </div>

                {/* Display Name Input */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">
                    Display Name
                  </label>
                  <Input
                    placeholder="e.g. John Doe"
                    value={profile?.full_name || ""}
                    onChange={(e) =>
                      updateProfile({ full_name: e.target.value })
                    }
                    className="h-10 text-sm bg-white border-slate-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">
                    Bio
                  </label>
                  <textarea
                    placeholder="Tell your story..."
                    rows="2"
                    className="w-full text-sm text-slate-700 border border-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 outline-none resize-none bg-white transition-colors"
                    value={profile?.bio || ""}
                    onChange={(e) => updateProfile({ bio: e.target.value })}
                  />
                </div>
              </div>

              {/* Avatar Upload */}
              <div className="flex flex-col items-center gap-4 shrink-0 mb-2 sm:mb-0">
                <div className="relative group">
                  <div className="w-24 h-24 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-white ring-4 sm:ring-2 ring-white shadow-md sm:shadow-sm">
                    {profile.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                        <Upload size={24} />
                      </div>
                    )}
                  </div>
                  <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full text-white font-bold text-[10px] uppercase tracking-wide">
                    {uploading ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      "Change"
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, "avatar_url")}
                      disabled={uploading}
                    />
                  </label>
                </div>

                {/* ✅ Video Story Upload */}
                <div className="text-center w-full">
                  <label className="flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full cursor-pointer hover:scale-105 transition-transform shadow-md">
                    {uploadingVideo ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Video size={12} />
                    )}
                    {profile.story_video_url
                      ? "Change Story"
                      : "Add Video Story"}
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, "story_video_url")}
                      disabled={uploadingVideo}
                    />
                  </label>
                  {profile.story_video_url && (
                    <button
                      onClick={handleRemoveStory}
                      className="text-[10px] text-red-500 font-bold mt-1 hover:underline"
                    >
                      Remove Story
                    </button>
                  )}
                </div>
              </div>
            </div>
          </AccordionItem>

          {/* 2. BACKGROUND & THEME (Purple) */}
          <AccordionItem
            title="Background & Theme"
            icon={<Palette size={18} />}
            isOpen={openSection === "theme"}
            onClick={() => toggleSection("theme")}
            colorClass="bg-purple-50/50 border-purple-100 hover:border-purple-200"
          >
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Page Background
                </label>
                <div className="grid grid-cols-4 gap-3">
                  <ColorPreset
                    color="#f8fafc"
                    label="Light"
                    onClick={() =>
                      updateProfile({
                        background_url: null,
                        background_color: "#f8fafc",
                      })
                    }
                    active={profile.background_color === "#f8fafc"}
                  />
                  <ColorPreset
                    color="#0f172a"
                    label="Dark"
                    onClick={() =>
                      updateProfile({
                        background_url: null,
                        background_color: "#0f172a",
                      })
                    }
                    active={profile.background_color === "#0f172a"}
                  />

                  {/* Custom Color */}
                  <div className="relative h-16 rounded-lg border border-slate-200 overflow-hidden group bg-white">
                    <input
                      type="color"
                      value={profile.background_color || "#ffffff"}
                      onChange={(e) =>
                        updateProfile({
                          background_url: null,
                          background_color: e.target.value,
                        })
                      }
                      className="absolute inset-0 w-[150%] h-[150%] -left-2 -top-2 cursor-pointer"
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-white/50 group-hover:bg-transparent transition-colors">
                      <span className="text-[10px] font-bold text-slate-600">
                        Custom
                      </span>
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div className="relative h-16 rounded-lg border-2 border-dashed border-slate-200 hover:border-indigo-300 transition-colors flex flex-col items-center justify-center text-slate-400 cursor-pointer bg-white group overflow-hidden">
                    {profile.background_url ? (
                      <>
                        <img
                          src={profile.background_url}
                          className="absolute inset-0 w-full h-full object-cover opacity-60"
                          alt="bg"
                        />
                        <button
                          onClick={handleRemoveBackground}
                          className="absolute top-1 right-1 bg-white shadow-sm p-1 rounded-full text-red-500 z-10 hover:scale-110 transition-transform"
                        >
                          <X size={12} />
                        </button>
                      </>
                    ) : (
                      <Upload size={16} />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => handleFileUpload(e, "background_url")}
                      disabled={uploading}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Button & Text Color
                </label>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-full relative rounded-lg border border-slate-200 overflow-hidden flex items-center px-3 gap-3 bg-white">
                    <input
                      type="color"
                      value={profile.theme_color || "#000000"}
                      onChange={(e) =>
                        updateProfile({ theme_color: e.target.value })
                      }
                      className="w-6 h-6 rounded-md cursor-pointer border-0 p-0"
                    />
                    <span className="text-xs font-mono text-slate-500 uppercase">
                      {profile.theme_color}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </AccordionItem>

          {/* 3. BUTTON STYLE (Pink) */}
          <AccordionItem
            title="Buttons"
            icon={<LayoutDashboard size={18} />}
            isOpen={openSection === "buttons"}
            onClick={() => toggleSection("buttons")}
            colorClass="bg-pink-50/50 border-pink-100 hover:border-pink-200"
          >
            <div className="grid grid-cols-4 gap-3">
              {[
                "rounded-full",
                "rounded-xl",
                "rounded-none",
                "shadow-hard",
              ].map((style) => (
                <button
                  key={style}
                  onClick={() => updateProfile({ button_style: style })}
                  className={`h-12 text-[10px] font-bold border transition-all rounded-lg flex items-center justify-center uppercase tracking-wide ${
                    profile.button_style === style
                      ? "bg-slate-900 text-white border-slate-900 shadow-md transform scale-105"
                      : "bg-white text-slate-500 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
                  }`}
                >
                  {style.replace("rounded-", "").replace("shadow-", "")}
                </button>
              ))}
            </div>
          </AccordionItem>

          {/* 4. TYPOGRAPHY (Orange) */}
          <AccordionItem
            title="Typography"
            icon={<Type size={18} />}
            isOpen={openSection === "typography"}
            onClick={() => toggleSection("typography")}
            colorClass="bg-orange-50/50 border-orange-100 hover:border-orange-200"
          >
            <div className="grid grid-cols-1 gap-2">
              {[
                { val: "Inter", label: "Modern (Inter)" },
                { val: "DM Sans", label: "Friendly (DM Sans)" },
                { val: "Playfair Display", label: "Elegant (Playfair)" },
                { val: "Space Mono", label: "Technical (Space Mono)" },
                { val: "Pacifico", label: "Playful (Pacifico)" },
              ].map((font) => (
                <button
                  key={font.val}
                  onClick={() => updateProfile({ font_family: font.val })}
                  className={`p-3 text-left border rounded-lg transition-all flex justify-between items-center text-sm ${
                    profile.font_family === font.val
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700 font-bold"
                      : "border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  <span style={{ fontFamily: font.val }}>{font.label}</span>
                  {profile.font_family === font.val && (
                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                  )}
                </button>
              ))}
            </div>
          </AccordionItem>

          {/* 5. SOCIAL ICONS (Emerald) */}
          <AccordionItem
            title="Social Icons & Contact"
            icon={<Share2 size={18} />}
            isOpen={openSection === "social"}
            onClick={() => toggleSection("social")}
            colorClass="bg-emerald-50/50 border-emerald-100 hover:border-emerald-200"
          >
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Contact
                </label>
                <SocialInput
                  icon={<Mail size={16} className="text-red-500" />}
                  placeholder="you@gmail.com"
                  value={profile.social_email}
                  onChange={(v) => updateProfile({ social_email: v })}
                />
                <SocialInput
                  icon={<Phone size={16} className="text-green-600" />}
                  placeholder="+1 (555) 000-0000"
                  value={profile.social_phone}
                  onChange={(v) => updateProfile({ social_phone: v })}
                />
                <SocialInput
                  icon={<WhatsApp size={16} className="text-[#25D366]" />}
                  placeholder="https://wa.me/2348084737049"
                  value={profile.social_whatsapp}
                  onChange={(v) => updateProfile({ social_whatsapp: v })}
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Socials
                </label>
                <SocialInput
                  icon={<Instagram size={16} className="text-[#E1306C]" />}
                  placeholder="https://instagram.com/username"
                  value={profile.social_instagram}
                  onChange={(v) => updateProfile({ social_instagram: v })}
                />
                <SocialInput
                  icon={<Music2 size={16} className="text-black" />}
                  placeholder="https://tiktok.com/@username"
                  value={profile.social_tiktok}
                  onChange={(v) => updateProfile({ social_tiktok: v })}
                />
                <SocialInput
                  icon={<Twitter size={16} className="text-[#1DA1F2]" />}
                  placeholder="https://twitter.com/username"
                  value={profile.social_twitter}
                  onChange={(v) => updateProfile({ social_twitter: v })}
                />
                <SocialInput
                  icon={<Ghost size={16} className="text-[#eab308]" />}
                  placeholder="https://snapchat.com/add/username"
                  value={profile.social_snapchat}
                  onChange={(v) => updateProfile({ social_snapchat: v })}
                />
                <SocialInput
                  icon={<Facebook size={16} className="text-[#1877F2]" />}
                  placeholder="https://facebook.com/username"
                  value={profile.social_facebook}
                  onChange={(v) => updateProfile({ social_facebook: v })}
                />
                <SocialInput
                  icon={<Linkedin size={16} className="text-[#0077B5]" />}
                  placeholder="https://linkedin.com/in/username"
                  value={profile.social_linkedin}
                  onChange={(v) => updateProfile({ social_linkedin: v })}
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Content
                </label>
                <SocialInput
                  icon={<Youtube size={16} className="text-[#FF0000]" />}
                  placeholder="https://youtube.com/@channel"
                  value={profile.social_youtube}
                  onChange={(v) => updateProfile({ social_youtube: v })}
                />
                <SocialInput
                  icon={<Gamepad2 size={16} className="text-[#5865F2]" />}
                  placeholder="https://discord.gg/invitecode"
                  value={profile.social_discord}
                  onChange={(v) => updateProfile({ social_discord: v })}
                />
                <SocialInput
                  icon={<Mic2 size={16} className="text-[#1DB954]" />}
                  placeholder="https://open.spotify.com/artist/..."
                  value={profile.social_spotify}
                  onChange={(v) => updateProfile({ social_spotify: v })}
                />
                <SocialInput
                  icon={<Github size={16} className="text-[#181717]" />}
                  placeholder="https://github.com/username"
                  value={profile.social_github}
                  onChange={(v) => updateProfile({ social_github: v })}
                />
                <SocialInput
                  icon={<Twitch size={16} className="text-[#9146FF]" />}
                  placeholder="https://twitch.tv/username"
                  value={profile.social_twitch}
                  onChange={(v) => updateProfile({ social_twitch: v })}
                />
              </div>
            </div>
          </AccordionItem>

          {/* 6. FEATURES (Yellow) */}
          <AccordionItem
            title="Features"
            icon={<Heart size={18} />}
            isOpen={openSection === "features"}
            onClick={() => toggleSection("features")}
            colorClass="bg-yellow-50/50 border-yellow-100 hover:border-yellow-200"
          >
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-700">
                    Support / Tipping
                  </label>
                  <Switch
                    checked={profile.tipping_enabled || false}
                    onCheckedChange={(val) =>
                      updateProfile({ tipping_enabled: val })
                    }
                  />
                </div>
                {profile.tipping_enabled && (
                  <div className="grid grid-cols-2 gap-3 pl-2 border-l-2 border-slate-100">
                    <Input
                      placeholder="Button Title"
                      className="h-9 text-xs"
                      value={profile.tipping_title || ""}
                      onChange={(e) =>
                        updateProfile({ tipping_title: e.target.value })
                      }
                    />
                    <Input
                      placeholder="https://paystack.com/pay"
                      className="h-9 text-xs"
                      value={profile.tipping_url || ""}
                      onChange={(e) =>
                        updateProfile({ tipping_url: e.target.value })
                      }
                    />
                  </div>
                )}
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-700">
                    Newsletter Form
                  </label>
                  <Switch
                    checked={profile.newsletter_enabled || false}
                    onCheckedChange={(val) =>
                      updateProfile({ newsletter_enabled: val })
                    }
                  />
                </div>
                {profile.newsletter_enabled && (
                  <div className="pl-2 border-l-2 border-slate-100">
                    <Input
                      placeholder="Title"
                      className="h-9 text-xs"
                      value={profile.newsletter_title || ""}
                      onChange={(e) =>
                        updateProfile({ newsletter_title: e.target.value })
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          </AccordionItem>
        </div>

        {/* RIGHT COLUMN: PREVIEW */}
        <div className="hidden xl:block sticky top-8">
          <PhonePreview profile={profile} />
        </div>
      </div>

      {/* ✅ 1. COMPACT PREVIEW BUTTON (Circular FAB) */}
      <button
        onClick={() => setPreviewOpen(true)}
        className="xl:hidden fixed bottom-4 right-4 bg-slate-900 text-white p-3.5 rounded-full shadow-2xl z-40 hover:scale-110 hover:bg-slate-800 transition-all active:scale-90"
        aria-label="Preview"
      >
        <Eye size={24} />
      </button>

      {/* ✅ 2. MODAL WITH CLOSE BUTTON AT BOTTOM */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/95 backdrop-blur-sm p-4 animate-fade-in">
          {/* Content Area - Pushed to Bottom */}
          <div className="relative flex-1 w-full flex flex-col items-center justify-end overflow-hidden pb-6">
            <div
              onClick={(e) => e.stopPropagation()}
              className="scale-90 origin-bottom"
            >
              <PhonePreview profile={profile} />
            </div>
          </div>

          {/* Close Button - At Bottom */}
          <button
            onClick={() => setPreviewOpen(false)}
            className="flex items-center gap-2 bg-white/10 text-white px-6 py-3 rounded-full backdrop-blur-md border border-white/20 shadow-xl transition-all hover:bg-white/20 active:scale-95 mb-6 shrink-0"
          >
            <X size={20} /> Close Preview
          </button>
        </div>
      )}
    </div>
  );
}

// --- SHARED ACCORDION COMPONENT ---
function AccordionItem({ title, icon, children, isOpen, onClick, colorClass }) {
  const bgColor =
    colorClass || "bg-white border-slate-200 hover:border-slate-300";

  return (
    <div
      className={`border transition-all duration-300 rounded-xl overflow-hidden ${
        isOpen
          ? "border-indigo-200 shadow-md ring-1 ring-indigo-100 bg-white"
          : bgColor
      }`}
    >
      <button
        onClick={onClick}
        className={`w-full flex items-center justify-between p-4 text-left transition-colors ${
          isOpen ? "bg-indigo-50/50" : ""
        }`}
      >
        <div className="flex items-center gap-3 text-slate-700 font-bold text-sm">
          <div
            className={`p-1.5 rounded-lg ${
              isOpen
                ? "bg-indigo-100 text-indigo-600"
                : "bg-white/50 text-slate-600 shadow-sm"
            }`}
          >
            {icon}
          </div>
          {title}
        </div>
        {isOpen ? (
          <ChevronUp size={16} className="text-slate-400" />
        ) : (
          <ChevronDown size={16} className="text-slate-400" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-4 pt-0 border-t border-indigo-50/50 bg-white">
              <div className="pt-4">{children}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ColorPreset({ color, label, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`h-16 rounded-lg border transition-all flex flex-col items-center justify-center gap-1 bg-white ${
        active ? "border-indigo-500 ring-2 ring-indigo-200" : "border-slate-200"
      }`}
      style={{ backgroundColor: color }}
    >
      <span
        className={`text-[10px] font-bold ${
          color === "#0f172a" ? "text-white/50" : "text-slate-500"
        }`}
      >
        {label}
      </span>
    </button>
  );
}

function SocialInput({ icon, placeholder, value, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 flex justify-center">{icon}</div>
      <Input
        placeholder={placeholder}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 text-sm"
      />
    </div>
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
