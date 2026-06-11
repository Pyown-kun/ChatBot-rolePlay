import { X, Trash2, Download } from "lucide-react";
import { useState } from "react";
import ConfirmModal from "./ConfirmModal";
import ImportExportToast from "./ImportExportToast";

function CharacterProfile({ character, onClose, onDelete, characters }) {
  if (!character) return null;

  const [showConfirm, setShowConfirm] = useState(false);
  const [toast, setToast] = useState(null); // { type: "export", characterName }

  const { name, avatar, description, personality, role } = character;

  const traits = personality
    ? personality
        .split(/[,;]+/)
        .map((t) => t.trim())
        .filter(Boolean)
        .slice(0, 6)
    : [];

  const traitColors = [
    "#ff6b6b",
    "#ffa94d",
    "#ffd93d",
    "#6bcf7f",
    "#4d9de0",
    "#c77dff",
  ];

  const handleDeleteConfirmed = () => {
    setShowConfirm(false);
    onDelete(character.id);
    onClose();
  };

  // Export karakter ini → tampilkan toast → auto close
  const handleExportSingle = () => {
    const blob = new Blob([JSON.stringify([character], null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name.toLowerCase().replace(/\s+/g, "_")}_character.json`;
    a.click();
    URL.revokeObjectURL(url);

    // Tampilkan toast — onDone akan close modal
    setToast({ type: "export", characterName: name });
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <div
          className="max-w-lg w-full flex flex-col shadow-2xl relative"
          style={{
            border: "8px solid #8b6f47",
            borderRadius: "24px",
            maxHeight: "90vh",
            boxShadow:
              "0 20px 60px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.3)",
            background: "linear-gradient(135deg, #f5ead2, #ecdfc0)",
          }}
        >
          {/* Ring binding holes */}
          <div className="absolute left-4 top-0 bottom-0 flex flex-col justify-evenly items-center pointer-events-none z-10">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="w-4 h-4 rounded-full bg-[#5a4a3a] border-2 border-[#3a2f1f] shadow-lg"
              />
            ))}
          </div>

          {/* Scrollable content */}
          <div className="overflow-y-auto flex-1 relative p-6 pl-12">
            {/* Close button */}
            <div className="absolute top-4 right-4 z-30">
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-[#c74440] text-white hover:bg-[#a83632] transition-colors shadow-lg border-2 border-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Polaroid */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <div
                  className="absolute -top-2 left-1/2 -translate-x-1/2 w-20 h-6 opacity-70 z-10"
                  style={{
                    backgroundColor: "#ffa94d",
                    backgroundImage:
                      "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.3) 10px, rgba(255,255,255,0.3) 20px)",
                    transform: "rotate(-3deg)",
                  }}
                />
                <div className="bg-white p-3 pb-8 rounded-sm shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform">
                  <div className="w-44 h-44 rounded-sm overflow-hidden bg-[#f5ead2]">
                    {avatar ? (
                      <img
                        src={avatar}
                        alt={name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl text-[#8b6f47] font-bold">
                        {name[0]}
                      </div>
                    )}
                  </div>
                  <div className="text-center mt-2 text-[#3a2f1f] text-sm font-medium">
                    {name}
                  </div>
                </div>
              </div>
              {(role || character.profession) && (
                <div className="mt-4">
                  <div className="inline-block px-5 py-2 bg-gradient-to-r from-[#ff6b6b] to-[#ffa94d] text-white rounded-full text-sm font-bold shadow-lg border-2 border-white transform -rotate-1">
                    {role || character.profession}
                  </div>
                </div>
              )}
            </div>

            {/* Name */}
            <div className="mb-4">
              <h2 className="text-3xl font-bold text-[#2d1f10] mb-1 relative inline-block">
                {name}
                <div className="absolute -bottom-1 left-0 right-0 h-1 bg-[#ffa94d] opacity-50" />
              </h2>
            </div>

            {/* Description */}
            {description && (
              <div className="bg-white/80 rounded-lg p-4 border-2 border-[#c9a875] shadow-md mb-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#ff6b6b] opacity-10 rounded-full -translate-y-8 translate-x-8" />
                <h3 className="font-bold text-[#2d1f10] mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#ff6b6b] rounded-full" />
                  Description
                </h3>
                <p className="text-sm text-[#3a2f1f] leading-relaxed">
                  {description}
                </p>
              </div>
            )}

            {/* Traits */}
            {traits.length > 0 && (
              <div className="bg-white/80 rounded-lg p-4 border-2 border-[#c9a875] shadow-md mb-4">
                <h3 className="font-bold text-[#2d1f10] mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#ffa94d] rounded-full" />
                  Personality Traits
                </h3>
                <div className="flex flex-wrap gap-2">
                  {traits.map((trait, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 text-white rounded-full text-xs font-bold shadow-md transform hover:scale-105 transition-transform"
                      style={{
                        backgroundColor: traitColors[idx % traitColors.length],
                      }}
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Opening line */}
            {character.first_mes && (
              <div className="bg-white/80 rounded-lg p-5 border-2 border-[#c9a875] shadow-md relative">
                <div className="absolute inset-0 opacity-5 pointer-events-none rounded-lg">
                  <div className="h-full flex flex-col justify-evenly px-2">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="h-px bg-[#8b6f47]" />
                    ))}
                  </div>
                </div>
                <h3 className="font-bold text-[#2d1f10] mb-3 flex items-center gap-2 relative z-10">
                  <span className="w-2 h-2 bg-[#ffd93d] rounded-full" />
                  Opening Line
                </h3>
                <p className="text-sm text-[#3a2f1f] leading-relaxed relative z-10 italic">
                  "{character.first_mes}"
                </p>
              </div>
            )}
          </div>

          {/* Bottom bar — Export + Delete */}
          <div
            className="flex-shrink-0 flex items-center gap-3 px-4 py-3 border-t-2 border-[#c9a875]/40 z-20"
            style={{
              background:
                "linear-gradient(to bottom, transparent, rgba(139,111,71,0.1))",
              borderRadius: "0 0 16px 16px",
            }}
          >
            {!character.locked &&(
            <button
              onClick={handleExportSingle}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-[#c9a875] text-[#2d1f10] font-medium transition hover:bg-[#ecdfc0] shadow-md"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm">Export</span>
            </button>
)}

            {!character.locked && (
              <button
                onClick={() => setShowConfirm(true)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-white transition-all shadow-lg border-2 border-white hover:scale-[1.01]"
                style={{
                  background: "linear-gradient(135deg, #c74440, #a83632)",
                }}
              >
                <Trash2 className="w-4 h-4" />
                <span className="text-sm">Hapus</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Confirm delete */}
      <ConfirmModal
        isOpen={showConfirm}
        message="Apakah Anda yakin ingin menghapus karakter ini?"
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setShowConfirm(false)}
      />

      {/* Toast — auto close profile after export */}
      {toast && (
        <ImportExportToast
          type={toast.type}
          characterName={toast.characterName}
          onDone={() => {
            setToast(null);
            onClose();
          }}
        />
      )}
    </>
  );
}

export default CharacterProfile;
