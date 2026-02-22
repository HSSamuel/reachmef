import { useState } from "react";
import { Mail, Loader2, Check, AlertCircle } from "lucide-react";
import axios from "axios"; // ✅ Replaced supabase with axios

// ✅ 1. Add 'profileId' to the props here
export function SubscribeBlock({ title, themeColor, profileId }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubscribe = async () => {
    if (!email || !email.includes("@")) {
      setStatus("error");
      setErrorMessage("Invalid email");
      return;
    }

    if (!profileId) {
      setStatus("error");
      setErrorMessage("Profile ID is missing");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      // ✅ 2. Send 'profile_id' along with the email via Express API
      await axios.post("http://localhost:5000/api/subscribers", {
        email: email,
        profile_id: profileId,
      });

      setStatus("success");
      setEmail("");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrorMessage(err.response?.data?.error || "Failed to subscribe");
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-sm border border-white/50 text-center mx-auto max-w-[95%] transition-all">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
          <Mail size={14} className="text-slate-600" />
        </div>
        <h3 className="font-bold text-slate-800 text-xs text-left leading-tight line-clamp-2">
          {title || "Join my newsletter"}
        </h3>
      </div>

      {status === "success" ? (
        <div className="h-8 flex items-center justify-center gap-2 text-green-600 bg-green-50 rounded-lg text-[10px] font-bold border border-green-100 animate-in fade-in zoom-in duration-300">
          <Check size={12} />
          <span>Subscribed successfully!</span>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === "error") setStatus("idle");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
              placeholder="Email address"
              className={`w-full h-8 text-[10px] px-2 bg-slate-50 rounded-lg border outline-none focus:border-slate-400 transition-colors ${
                status === "error"
                  ? "border-red-300 bg-red-50 text-red-600 placeholder:text-red-300"
                  : "border-slate-200"
              }`}
              disabled={status === "loading"}
            />
            <button
              onClick={handleSubscribe}
              disabled={status === "loading"}
              className="h-8 w-20 flex items-center justify-center text-[10px] font-bold text-white px-3 rounded-lg shadow-sm whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-95"
              style={{ backgroundColor: "#000000" }}
            >
              {status === "loading" ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                "Subscribe"
              )}
            </button>
          </div>

          {status === "error" && (
            <div className="flex items-center gap-1 text-[9px] text-red-500 font-medium px-1">
              <AlertCircle size={10} />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
