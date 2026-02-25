import { useRef, useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Download, QrCode } from "lucide-react";
import { Card } from "../../../components/ui/Card";
import toast from "react-hot-toast";

export function QRCodeCard({ username, avatarUrl }) {
  const qrRef = useRef();
  const downloadQrRef = useRef(); // ✅ NEW: Ref for the hidden high-res canvas
  const [qrAvatar, setQrAvatar] = useState(null);

  // ✅ SAFELY BUILD URL: Avoids undefined in the generated QR URL
  const cleanUsername = username ? username.trim() : "";
  const profileUrl = cleanUsername 
    ? `${window.location.origin}/${cleanUsername}` 
    : window.location.origin;

  useEffect(() => {
    if (avatarUrl) {
      const img = new Image();
      img.crossOrigin = "anonymous"; // CRITICAL: Allows cross-origin image download
      img.src = avatarUrl;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        try {
          const dataURL = canvas.toDataURL("image/png");
          setQrAvatar(dataURL);
        } catch (error) {
          console.warn("Could not convert avatar for QR code:", error);
          setQrAvatar(null);
        }
      };

      img.onerror = () => {
        setQrAvatar(null);
      };
    } else {
      setQrAvatar(null);
    }
  }, [avatarUrl]);

  const downloadQR = () => {
    try {
      // 1. Get the canvas element from the HIDDEN HIGH-RES reference
      const canvas = downloadQrRef.current.querySelector("canvas");
      if (!canvas) throw new Error("Canvas not found");

      // 2. Convert to data URL
      const image = canvas.toDataURL("image/png");

      // 3. Create a fake link to trigger download
      const anchor = document.createElement("a");
      anchor.href = image;
      anchor.download = `reachme-qr-${cleanUsername || "profile"}-hd.png`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);

      toast.success("High-Res QR Code downloaded!");
    } catch (error) {
      console.error("QR Download Error:", error);
      toast.error("Failed to download QR Code. Image may be restricted.");
    }
  };

  return (
    <Card className="relative p-6 flex flex-col items-center text-center space-y-4 h-full overflow-hidden">
      <div className="flex items-center gap-2 text-slate-800 font-bold self-start">
        <QrCode size={20} className="text-brand-500" />
        <h2>Your QR Code</h2>
      </div>

      {/* VISIBLE PREVIEW CANVAS (Small size for dashboard display) */}
      <div
        ref={qrRef}
        className="p-1 bg-white rounded-xl border-2 border-slate-100 shadow-sm"
      >
        <QRCodeCanvas
          value={profileUrl}
          size={240}
          bgColor={"#ffffff"}
          fgColor={"#0f172a"} 
          level={"H"} 
          includeMargin={true}
          imageSettings={
            qrAvatar
              ? {
                  src: qrAvatar,
                  x: undefined, // Centers automatically
                  y: undefined,
                  height: 45,
                  width: 45,
                  excavate: true, 
                }
              : undefined
          }
        />
      </div>

      <p className="text-xs text-slate-500 max-w-[200px]">
        Scan to visit: <br />
        <span className="font-mono font-bold text-brand-600 truncate block mt-1">
          {profileUrl}
        </span>
      </p>

      <button
        onClick={downloadQR}
        className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors w-full justify-center shadow-lg shadow-slate-900/20 active:scale-95 z-10"
      >
        <Download size={16} /> Download HD PNG
      </button>

      {/* ✅ HIDDEN HIGH-RES CANVAS (Used specifically for downloading) */}
      <div 
        className="absolute left-[-9999px] top-[-9999px] opacity-0 pointer-events-none" 
        aria-hidden="true" 
        ref={downloadQrRef}
      >
        <QRCodeCanvas
          value={profileUrl}
          size={2048} // ✨ Upgraded to massive 2K Resolution
          bgColor={"#ffffff"}
          fgColor={"#0f172a"}
          level={"H"}
          includeMargin={true}
          imageSettings={
            qrAvatar
              ? {
                  src: qrAvatar,
                  x: undefined,
                  y: undefined,
                  height: 360, // Scaled up logo size to match 2048 canvas
                  width: 360,
                  excavate: true,
                }
              : undefined
          }
        />
      </div>
    </Card>
  );
}