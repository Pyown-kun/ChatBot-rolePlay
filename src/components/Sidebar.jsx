import { FiSettings } from "react-icons/fi";
import { Search, Plus } from "lucide-react";
import { useState } from "react";

function Sidebar({
  characters,
  activeChar,
  onSelectCharacter,
  onOpenSettings,
  handleDeleteCharacter,
  onAddCharacter,
  onEditCharacter,
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChars = characters.filter((char) =>
    char.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside
      className="h-full flex flex-col relative w-80"
      style={{
        background: "linear-gradient(135deg, #a67c52 0%, #8b6f47 100%)",
      }}
    >
      {/* Leather texture overlay */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, transparent 20%, rgba(0,0,0,0.3) 100%)",
          mixBlendMode: "multiply",
        }}
      />

      {/* Ring binding holes */}
      <div className="absolute left-6 top-0 bottom-0 flex flex-col justify-evenly items-center z-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-full bg-[#3a2f1f] border-2 border-[#5a4a3a] shadow-inner"
          />
        ))}
      </div>

      {/* Header */}
      <div className="p-4 pl-12 pr-2 space-y-3 relative z-10">
        <div className="flex items-center justify-between">
          <h1
            className="text-lg tracking-wide text-[#2d1f10] font-bold"
            style={{ textShadow: "1px 1px 2px rgba(255,255,255,0.3)" }}
          >
            ROLEPLAY CHATS
          </h1>
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg hover:bg-[#8b6f47]/30 transition-colors text-[#2d1f10]"
          >
            <FiSettings size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b6f47]" />
          <input
            type="text"
            placeholder="Search characters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#f5ead2] text-[#2d1f10] placeholder:text-[#8b6f47] outline-none border-2 border-[#c9a875] shadow-inner"
            style={{
              backgroundImage:
                "linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)",
            }}
          />
        </div>
      </div>

      {/* Character List */}
      <div className="flex-1 overflow-y-auto px-2 pl-12 relative z-10">
        {filteredChars.map((char) => {
          const isActive = activeChar?.id === char.id;

          return (
            <button
              key={char.id}
              onClick={() => onSelectCharacter(char)}
              className={`w-full flex items-center gap-3 p-3 mb-2 rounded-xl transition-all ${
                isActive
                  ? "bg-[#f5ead2] shadow-lg scale-[1.02]"
                  : "bg-[#ecdfc0]/60 hover:bg-[#f5ead2]/80 shadow-md"
              }`}
              style={{ border: "2px solid #c9a875" }}
            >
              {/* Avatar */}
              <div
                className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#fff5e6] to-[#f5ead2] flex items-center justify-center overflow-hidden flex-shrink-0 transform -rotate-3"
                style={{
                  boxShadow:
                    "0 4px 6px rgba(0,0,0,0.2), inset 0 2px 4px rgba(255,255,255,0.5)",
                  border: "3px solid white",
                }}
              >
                {char.avatar ? (
                  <img
                    src={char.avatar}
                    alt={char.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl text-[#8b6f47]">
                    {char.name[0]}
                  </span>
                )}
              </div>

              {/* Info + Actions */}
              <div className="flex-1 text-left min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="font-bold text-[#2d1f10] truncate">
                    {char.name}
                  </div>

                  {/* Action buttons — only when active */}
                  {isActive && (
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditCharacter(char);
                        }}
                        className="rounded-lg p-1 text-[#5a4a3a] transition hover:bg-[#c9a875]/40 hover:text-[#2d1f10]"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCharacter(char.id);
                        }}
                        className="rounded-lg p-1 text-red-700 transition hover:bg-red-500/20 hover:text-red-900"
                      >
                        🗑
                      </button>
                    </div>
                  )}
                </div>

                <div className="text-sm text-[#5a4a3a] truncate">
                  {char.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer — Add Character only */}
      <div className="p-4 pl-12 flex flex-col gap-3 border-t-2 border-[#5a4a3a] relative z-10 bg-gradient-to-b from-transparent to-[#8b6f47]/30">
        <button
          onClick={onAddCharacter}
          className="flex items-center justify-center gap-2 p-3 rounded-full bg-[#f5ead2] hover:bg-[#ecdfc0] text-[#2d1f10] transition-all shadow-md border-2 border-[#c9a875] font-bold"
        >
          <Plus className="w-5 h-5" />
          <span>Tambah Karakter</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;