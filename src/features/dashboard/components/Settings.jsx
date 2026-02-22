import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../../../hooks/useProfile";
import { useAuthStore } from "../../../store/authStore";
import {
  LogOut,
  Shield,
  Copy,
  Check,
  Download,
  Globe,
  Search,
  Save,
  Loader2,
  ChevronDown,
  ChevronUp,
  User,
} from "lucide-react";
import { Card } from "../../../components/ui/Card";
import { Switch } from "../../../components/ui/Switch";
import { Input } from "../../../components/ui/Input";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeCard } from "./QRCodeCard";

export function Settings() {
  const navigate = useNavigate();
  const { profile, loading: profileLoading, updateProfile } = useProfile();
  const { user, signOut } = useAuthStore();

  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Accordion State
  const [openSection, setOpenSection] = useState(null);
  const toggleSection = (section) =>
    setOpenSection(openSection === section ? null : section);

  // SEO State
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [fullName, setFullName] = useState("");
  const [isSavingAccount, setIsSavingAccount] = useState(false);

  useEffect(() => {
    if (profile) {
      setMetaTitle(profile.meta_title || `${profile.username}'s Profile`);
      setMetaDesc(
        profile.meta_description ||
          `Check out ${profile.username}'s links and content.`,
      );
      setFullName(profile.full_name || "");
    }
  }, [profile]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Error signing out");
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/${profile?.username}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveSeo = async () => {
    try {
      setIsSaving(true);
      await updateProfile({
        meta_title: metaTitle,
        meta_description: metaDesc,
      });
      toast.success("SEO settings saved!");
    } catch (error) {
      toast.error("Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAccount = async () => {
    try {
      setIsSavingAccount(true);
      await updateProfile({
        full_name: fullName,
      });
      toast.success("Account details saved!");
    } catch (error) {
      toast.error("Failed to save");
    } finally {
      setIsSavingAccount(false);
    }
  };

  const handleDownloadQR = async () => {
    try {
      setDownloading(true);
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${window.location.origin}/${profile.username}`;
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${profile.username}-qr.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("QR Code downloaded!");
    } catch (e) {
      toast.error("Download failed");
    } finally {
      setDownloading(false);
    }
  };

  if (profileLoading)
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-slate-300" />
      </div>
    );

  const publicUrl = `${window.location.origin}/${profile?.username}`;

  return (
    <div className="max-w-7xl mx-auto pb-24 px-4">
      {/* HEADER */}
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-500 mt-1 text-sm">
            Control your profile settings.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        {/* LEFT COLUMN: SETTINGS (Compact) */}
        <div className="xl:col-span-2 space-y-4">
          {/* 1. VISIBILITY (Always Visible Row) */}
          <div className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg ${
                  profile?.is_public
                    ? "bg-green-50 text-green-600"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                <Globe size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Public Visibility
                </h3>
                <p className="text-xs text-slate-500">
                  {profile?.is_public
                    ? "Profile is live."
                    : "Profile is hidden."}
                </p>
              </div>
            </div>
            <Switch
              checked={profile?.is_public}
              onCheckedChange={(val) => updateProfile({ is_public: val })}
            />
          </div>

          {/* 2. SEO (Accordion) */}
          <AccordionItem
            title="SEO & Discovery"
            icon={<Search size={18} />}
            isOpen={openSection === "seo"}
            onClick={() => toggleSection("seo")}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">
                    Meta Title
                  </label>
                  <Input
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    placeholder="e.g. John Doe | Artist"
                    className="h-9 text-sm"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">
                    Description
                  </label>
                  <textarea
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 resize-none"
                    rows={3}
                    value={metaDesc}
                    onChange={(e) => setMetaDesc(e.target.value)}
                    placeholder="Profile description..."
                  />
                </div>
                <button
                  onClick={handleSaveSeo}
                  disabled={isSaving}
                  className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-800 transition-all flex items-center gap-2"
                >
                  {isSaving ? (
                    <Loader2 className="animate-spin" size={14} />
                  ) : (
                    <Save size={14} />
                  )}{" "}
                  Save SEO
                </button>
              </div>
              {/* Preview */}
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 text-center">
                  Search Preview
                </p>
                <div className="bg-white p-3 rounded shadow-sm border border-slate-100 font-sans">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-5 h-5 rounded-full bg-slate-100 overflow-hidden shrink-0">
                      {profile?.avatar_url && (
                        <img
                          src={profile.avatar_url}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-[10px] text-slate-800 font-medium">
                        ReachMe
                      </span>
                      <span className="text-[8px] text-slate-400 truncate">
                        {publicUrl}
                      </span>
                    </div>
                  </div>
                  <h4 className="text-blue-700 text-sm hover:underline cursor-pointer truncate">
                    {metaTitle || "Page Title"}
                  </h4>
                  <p className="text-[10px] text-slate-600 leading-relaxed line-clamp-2 mt-0.5">
                    {metaDesc || "Description..."}
                  </p>
                </div>
              </div>
            </div>
          </AccordionItem>

          {/* 3. ACCOUNT (Accordion) */}
          <AccordionItem
            title="Account Details"
            icon={<Shield size={18} />}
            isOpen={openSection === "account"}
            onClick={() => toggleSection("account")}
          >
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">
                  Full Name
                </label>
                <div className="flex gap-2 mt-1">
                  <div className="relative flex-1">
                    <User
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <Input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your Full Name"
                      className="h-10 text-sm pl-9"
                    />
                  </div>
                  <button
                    onClick={handleSaveAccount}
                    disabled={isSavingAccount}
                    className="bg-indigo-600 text-white px-4 rounded-lg text-xs font-bold hover:bg-indigo-700 transition-all flex items-center gap-2"
                  >
                    {isSavingAccount ? (
                      <Loader2 className="animate-spin" size={14} />
                    ) : (
                      "Save"
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">
                    Email
                  </label>
                  <p className="text-sm font-bold text-slate-800">
                    {user?.email}
                  </p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">
                    User ID
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="bg-slate-100 px-2 py-1 rounded text-[10px] text-slate-500 truncate flex-1">
                      {profile?._id} {/* ✅ MONGODB FIX */}
                    </code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(profile?._id); // ✅ MONGODB FIX
                        toast.success("ID Copied");
                      }}
                      className="text-slate-400 hover:text-slate-700"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </AccordionItem>

          {/* 4. DANGER ZONE (Row) */}
          <div className="p-4 bg-red-50/50 border border-red-100 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100 text-red-600">
                <LogOut size={20} />
              </div>
              <div>
                <h3 className="font-bold text-red-900 text-sm">Sign Out</h3>
                <p className="text-xs text-red-700/70">
                  End your current session.
                </p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="bg-white border border-red-200 text-red-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-red-50 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: SHARE (Visual) */}
        <div className="space-y-6">
          <QRCodeCard
            username={profile?.username}
            avatarUrl={profile?.avatar_url}
          />
        </div>
      </div>
    </div>
  );
}

// --- SHARED ACCORDION COMPONENT ---
function AccordionItem({ title, icon, children, isOpen, onClick }) {
  return (
    <div
      className={`border transition-all duration-300 rounded-xl bg-white overflow-hidden ${
        isOpen
          ? "border-indigo-200 shadow-md ring-1 ring-indigo-50"
          : "border-slate-200 hover:border-slate-300"
      }`}
    >
      <button
        onClick={onClick}
        className={`w-full flex items-center justify-between p-4 text-left transition-colors ${
          isOpen ? "bg-indigo-50/50" : "bg-white"
        }`}
      >
        <div className="flex items-center gap-3 text-slate-700 font-bold text-sm">
          <div
            className={`p-1.5 rounded-lg ${
              isOpen
                ? "bg-indigo-100 text-indigo-600"
                : "bg-slate-100 text-slate-500"
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
            <div className="p-4 pt-0 border-t border-indigo-50/50">
              <div className="pt-4">{children}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
