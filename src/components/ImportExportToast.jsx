import { useEffect, useState } from "react";
import { CheckCircle, Download, Upload, X } from "lucide-react";

function ImportExportToast({ type, characterName, onDone }) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    // Mount — slide in
    const showTimer = setTimeout(() => setVisible(true), 10);

    // After 2s — slide out, then call onDone
    const hideTimer = setTimeout(() => {
      setLeaving(true);
    }, 2200);

    const doneTimer = setTimeout(() => {
      onDone?.();
    }, 2700);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  const isExport = type === "export";

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
      <div
        className="pointer-events-auto transition-all duration-500"
        style={{
          opacity: visible && !leaving ? 1 : 0,
          transform: visible && !leaving ? "scale(1) translateY(0)" : "scale(0.85) translateY(20px)",
        }}
      >
        <div
          className="relative flex flex-col items-center gap-4 px-8 py-6 shadow-2xl"
          style={{
            border: "6px solid #8b6f47",
            borderRadius: "20px",
            background: "linear-gradient(135deg, #f5ead2, #ecdfc0)",
            boxShadow: "0 16px 48px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.3)",
            minWidth: "260px",
          }}
        >
          {/* Ring holes — top row */}
          <div className="absolute top-0 left-0 right-0 h-6 flex items-center justify-evenly px-4 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-[#5a4a3a] border border-[#3a2f1f]" />
            ))}
          </div>

          {/* Washi tape */}
          <div
            className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-5 opacity-80"
            style={{
              backgroundColor: isExport ? "#6bcf7f" : "#4d9de0",
              backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(255,255,255,0.3) 8px, rgba(255,255,255,0.3) 16px)",
              transform: "translateX(-50%) rotate(-2deg)",
              borderRadius: "2px",
            }}
          />

          {/* Icon in polaroid */}
          <div className="bg-white p-2 pb-5 rounded-sm shadow-lg transform -rotate-2 mt-4">
            <div
              className="w-16 h-16 rounded-sm flex items-center justify-center"
              style={{
                background: isExport
                  ? "linear-gradient(135deg, #6bcf7f, #45d4a8)"
                  : "linear-gradient(135deg, #4d9de0, #6bcf7f)",
              }}
            >
              {isExport ? (
                <Download className="w-8 h-8 text-white" />
              ) : (
                <Upload className="w-8 h-8 text-white" />
              )}
            </div>
            <div className="text-center mt-1 text-[#3a2f1f] text-xs font-medium">
              {isExport ? "Exported!" : "Imported!"}
            </div>
          </div>

          {/* Message card */}
          <div className="bg-white/80 rounded-lg px-5 py-3 border-2 border-[#c9a875] shadow-md w-full relative overflow-hidden">
            <div className="absolute top-0 right-0 w-12 h-12 rounded-full -translate-y-6 translate-x-6"
              style={{ backgroundColor: isExport ? "#6bcf7f" : "#4d9de0", opacity: 0.15 }}
            />
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: isExport ? "#6bcf7f" : "#4d9de0" }} />
              <span className="font-bold text-[#2d1f10] text-sm">
                {isExport ? "Export Berhasil" : "Import Berhasil"}
              </span>
            </div>
            <p className="text-xs text-[#5a4a3a] leading-relaxed">
              {isExport
                ? `"${characterName}" berhasil disimpan sebagai file JSON.`
                : `Karakter dari file JSON berhasil dimuat.`}
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-[#ecdfc0] rounded-full overflow-hidden border border-[#d4b896]">
            <div
              className="h-full rounded-full transition-none"
              style={{
                background: isExport
                  ? "linear-gradient(90deg, #6bcf7f, #45d4a8)"
                  : "linear-gradient(90deg, #4d9de0, #6bcf7f)",
                animation: "shrink 2.2s linear forwards",
              }}
            />
          </div>

          <style>{`
            @keyframes shrink {
              from { width: 100%; }
              to   { width: 0%; }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}

export default ImportExportToast;