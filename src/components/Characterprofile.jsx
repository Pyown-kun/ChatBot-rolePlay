import { X } from "lucide-react";

function CharacterProfile({ character, onClose }) {
  if (!character) return null;

  const { name, avatar, description, personality, role } = character;

  // Parse traits dari personality string (pisah koma atau titik koma)
  const traits = personality
    ? personality
        .split(/[,;]+/)
        .map((t) => t.trim())
        .filter(Boolean)
        .slice(0, 6)
    : [];

  const traitColors = ["#ff6b6b", "#ffa94d", "#ffd93d", "#6bcf7f", "#4d9de0", "#c77dff"];

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div
        className="bg-gradient-to-br from-[#f5ead2] to-[#ecdfc0] max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
        style={{
          border: "8px solid #8b6f47",
          borderRadius: "24px",
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.3)",
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

        <div className="relative p-6 pl-12">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-[#c74440] text-white hover:bg-[#a83632] transition-colors shadow-lg border-2 border-white z-30"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Polaroid photo + name */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              {/* Washi tape */}
              <div
                className="absolute -top-2 left-1/2 -translate-x-1/2 w-20 h-6 opacity-70 z-10"
                style={{
                  backgroundColor: "#ffa94d",
                  backgroundImage:
                    "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.3) 10px, rgba(255,255,255,0.3) 20px)",
                  transform: "rotate(-3deg)",
                }}
              />

              {/* Polaroid frame */}
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

            {/* Role badge */}
            {role && (
              <div className="mt-4">
                <div className="inline-block px-5 py-2 bg-gradient-to-r from-[#ff6b6b] to-[#ffa94d] text-white rounded-full text-sm font-bold shadow-lg border-2 border-white transform -rotate-1">
                  {role}
                </div>
              </div>
            )}
          </div>

          {/* Name heading */}
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

          {/* Personality / Traits */}
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
                    style={{ backgroundColor: traitColors[idx % traitColors.length] }}
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Background / first_mes preview */}
          {character.first_mes && (
            <div className="bg-white/80 rounded-lg p-5 border-2 border-[#c9a875] shadow-md relative">
              {/* Paper texture */}
              <div
                className="absolute inset-0 opacity-5 pointer-events-none rounded-lg"
                style={{
                  backgroundImage:
                    'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence baseFrequency="0.9" numOctaves="4"/%3E%3C/filter%3E%3Crect width="100" height="100" filter="url(%23noise)" opacity="0.05"/%3E%3C/svg%3E")',
                }}
              />
              {/* Lined paper lines */}
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
      </div>
    </div>
  );
}

export default CharacterProfile;