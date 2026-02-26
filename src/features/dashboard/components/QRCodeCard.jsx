import { useRef, useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Download, QrCode } from "lucide-react";
import { Card } from "../../../components/ui/Card";
import toast from "react-hot-toast";

export function QRCodeCard({ username, avatarUrl }) {
  const qrRef = useRef();
  const downloadQrRef = useRef();
  const [qrAvatar, setQrAvatar] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false); // ✅ PERFORMANCE FIX

  const cleanUsername = username ? username.trim() : "";
  const profileUrl = cleanUsername 
    ? `${window.location.origin}/${cleanUsername}` 
    : window.location.origin;

  useEffect(() => {
    if (avatarUrl) {
      const img = new Image();
      img.crossOrigin = "anonymous"; 
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
    setIsDownloading(true);
    
    // Give React a moment to render the hidden high-res canvas before converting
    setTimeout(() => {
      try {
        const canvas = downloadQrRef.current?.querySelector("canvas");
        if (!canvas) throw new Error("Canvas not found");

        const image = canvas.toDataURL("image/png");
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
      } finally {
        setIsDownloading(false);
      }
    }, 500); 
  };

  return (
    <Card className="relative p-6 flex flex-col items-center text-center space-y-4 h-full overflow-hidden">
      <div className="flex items-center gap-2 text-slate-800 font-bold self-start">
        <QrCode size={20} className="text-brand-500" />
        <h2>Your QR Code</h2>
      </div>

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
                  x: undefined, 
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
        disabled={isDownloading}
        className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors w-full justify-center shadow-lg shadow-slate-900/20 active:scale-95 z-10 disabled:opacity-50"
      >
        <Download size={16} /> {isDownloading ? "Generating..." : "Download HD PNG"}
      </button>

      {/* ✅ PERFORMANCE FIX: Render the huge 2K canvas dynamically only when explicitly requested */}
      {isDownloading && (
        <div 
          className="absolute left-[-9999px] top-[-9999px] opacity-0 pointer-events-none" 
          aria-hidden="true" 
          ref={downloadQrRef}
        >
          <QRCodeCanvas
            value={profileUrl}
            size={2048} 
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
                    height: 360, 
                    width: 360,
                    excavate: true,
                  }
                : undefined
            }
          />
        </div>
      )}
    </Card>
  );
}