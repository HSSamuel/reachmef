import { useRef, useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Download, QrCode } from "lucide-react";
import { Card } from "../../../components/ui/Card";
import toast from "react-hot-toast";

export function QRCodeCard({ username, avatarUrl }) {
  const qrRef = useRef();
  const [qrAvatar, setQrAvatar] = useState(null);

  // ✅ FIX 1: Force a perfectly clean, absolute URL.
  // This guarantees iOS/Android cameras will prompt "Open Link" instead of "Copy Text".
  const protocol =
    window.location.protocol === "http:" ? "http://" : "https://";
  const cleanUsername = username ? username.trim() : "";
  const profileUrl = `${protocol}${window.location.host}/${cleanUsername}`;

  // ✅ FIX 2: Pre-fetch the avatar image and convert it to Base64.
  // This bypasses the "Tainted Canvas" CORS error so the image can actually be downloaded.
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
      // 1. Get the canvas element
      const canvas = qrRef.current.querySelector("canvas");
      if (!canvas) throw new Error("Canvas not found");

      // 2. Convert to data URL
      const image = canvas.toDataURL("image/png");

      // 3. Create a fake link to trigger download
      const anchor = document.createElement("a");
      anchor.href = image;
      anchor.download = `reachme-qr-${cleanUsername || "profile"}.png`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);

      toast.success("QR Code downloaded!");
    } catch (error) {
      console.error("QR Download Error:", error);
      toast.error("Failed to download QR Code. Image may be restricted.");
    }
  };

  return (
    <Card className="p-6 flex flex-col items-center text-center space-y-4 h-full">
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
          fgColor={"#0f172a"} // Changed to a sleeker slate-900
          level={"H"} // High error correction required for images
          includeMargin={true}
          imageSettings={
            qrAvatar
              ? {
                  src: qrAvatar,
                  x: undefined, // Centers automatically
                  y: undefined,
                  height: 45,
                  width: 45,
                  excavate: true, // "Digs" a hole for the image so dots don't overlap
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
        className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors w-full justify-center shadow-lg shadow-slate-900/20 active:scale-95"
      >
        <Download size={16} /> Download PNG
      </button>
    </Card>
  );
}
