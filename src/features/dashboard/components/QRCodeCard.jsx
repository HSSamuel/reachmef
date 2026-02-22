import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react"; //
import { Download, QrCode } from "lucide-react";
import { Card } from "../../../components/ui/Card"; //
import toast from "react-hot-toast";

export function QRCodeCard({ username, avatarUrl }) {
  const qrRef = useRef();

  // Logic to generate the full URL
  const profileUrl = `${window.location.origin}/${username}`;

  const downloadQR = () => {
    // 1. Get the canvas element
    const canvas = qrRef.current.querySelector("canvas");
    if (!canvas) return;

    // 2. Convert to data URL (The avatar is already baked in by QRCodeCanvas!)
    const image = canvas.toDataURL("image/png");

    // 3. Create a fake link to trigger download
    const anchor = document.createElement("a");
    anchor.href = image;
    anchor.download = `reachme-qr-${username}.png`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    toast.success("QR Code downloaded!");
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
          fgColor={"#1d099dff"}
          level={"H"} // ✅ High error correction required for images
          includeMargin={true}
          imageSettings={
            avatarUrl
              ? {
                  src: avatarUrl,
                  x: undefined, // Centers automatically
                  y: undefined,
                  height: 40,
                  width: 40,
                  excavate: true, // "Digs" a hole for the image so dots don't overlap
                }
              : undefined
          }
        />
      </div>

      <p className="text-xs text-slate-500 max-w-[200px]">
        Scan to visit: <br />
        <span className="font-mono font-bold text-brand-600 truncate block">
          {profileUrl}
        </span>
      </p>

      <button
        onClick={downloadQR}
        className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors w-full justify-center shadow-lg shadow-slate-900/20"
      >
        <Download size={16} /> Download PNG
      </button>
    </Card>
  );
}
