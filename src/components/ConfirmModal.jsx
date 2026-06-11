import { X, Trash2, AlertTriangle } from "lucide-react";

function ConfirmModal({ isOpen, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
      <div
        className="w-full max-w-sm flex flex-col shadow-2xl relative"
        style={{
          border: "8px solid #8b6f47",
          borderRadius: "24px",
          background: "linear-gradient(135deg, #f5ead2, #ecdfc0)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.3)",
        }}
      >
        {/* Ring binding holes */}
        <div className="absolute left-4 top-0 bottom-0 flex flex-col justify-evenly items-center pointer-events-none z-10">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-4 h-4 rounded-full bg-[#5a4a3a] border-2 border-[#3a2f1f] shadow-lg" />
          ))}
        </div>

        {/* Content */}
        <div className="p-6 pl-12 relative">
          {/* Close button */}
          <div className="absolute top-4 right-4 z-30">
            <button
              onClick={onCancel}
              className="p-2 rounded-full bg-[#c74440] text-white hover:bg-[#a83632] transition-colors shadow-lg border-2 border-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Warning icon — polaroid style */}
          <div className="flex flex-col items-center mb-5">
            <div className="relative">
              {/* Washi tape */}
              <div
                className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-5 opacity-70 z-10"
                style={{
                  backgroundColor: "#ff6b6b",
                  backgroundImage:
                    "repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(255,255,255,0.3) 8px, rgba(255,255,255,0.3) 16px)",
                  transform: "rotate(-3deg)",
                }}
              />
              <div className="bg-white p-3 pb-6 rounded-sm shadow-xl transform -rotate-2">
                <div className="w-20 h-20 rounded-sm bg-gradient-to-br from-[#ff6b6b] to-[#c74440] flex items-center justify-center">
                  <AlertTriangle className="w-10 h-10 text-white" />
                </div>
                <div className="text-center mt-1 text-[#3a2f1f] text-xs font-medium">
                  Peringatan!
                </div>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="bg-white/80 rounded-lg p-4 border-2 border-[#c9a875] shadow-md relative overflow-hidden mb-2">
            <div className="absolute top-0 right-0 w-14 h-14 bg-[#ff6b6b] opacity-10 rounded-full -translate-y-7 translate-x-7" />
            <h3 className="font-bold text-[#2d1f10] mb-1 flex items-center gap-2 text-sm">
              <span className="w-2 h-2 bg-[#ff6b6b] rounded-full inline-block" />
              Konfirmasi
            </h3>
            <p className="text-sm text-[#3a2f1f] leading-relaxed">
              {message || "Apakah Anda yakin ingin menghapus karakter ini?"}
            </p>
          </div>
        </div>

        {/* Footer buttons — outside content, always at bottom */}
        <div
          className="flex-shrink-0 flex gap-3 px-6 py-4 border-t-2 border-[#c9a875]/40"
          style={{
            background: "linear-gradient(to bottom, transparent, rgba(139,111,71,0.1))",
            borderRadius: "0 0 16px 16px",
          }}
        >
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border-2 border-[#c9a875] text-[#2d1f10] font-medium transition hover:bg-[#ecdfc0] shadow-md"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl font-bold text-white transition-all shadow-lg border-2 border-white hover:scale-105 flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg, #c74440, #a83632)" }}
          >
            <Trash2 className="w-4 h-4" />
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;