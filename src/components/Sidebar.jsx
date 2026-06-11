import { FiSettings } from "react-icons/fi";
import { Search, Plus, MoreVertical } from "lucide-react";
import { useState } from "react";

const FILTER_TABS = ["All", "Favorites", "Recent"];

function Sidebar({
  characters = [],
  activeChar,
  onSelectCharacter,
  onOpenSettings,
  onAddCharacter,
  onEditCharacter,
  isMobile = false,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredChars = (Array.isArray(characters) ? characters : []).filter((char) =>
    char.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* ─────────────────────────────────────────
     MOBILE LAYOUT
  ───────────────────────────────────────── */
  if (isMobile) {
    return (
      <div
        className="h-full flex flex-col relative overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #f5ead2 0%, #ecdfc0 50%, #e8dfd0 100%)",
        }}
      >
        {/* Paper texture overlay */}
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(139,111,71,0.08) 29px)",
          }}
        />

        {/* Header */}
        <div
          className="px-5 pt-12 pb-3 relative z-10"
          style={{ background: "linear-gradient(to bottom, #a67c52, #8b6f47)" }}
        >
          {/* Ring binding row (top) */}
          <div className="absolute top-0 left-0 right-0 h-8 flex items-center justify-evenly px-2">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="w-2.5 h-2.5 rounded-full bg-[#3a2f1f] border border-[#5a4a3a]" />
            ))}
          </div>

          <div className="flex items-center justify-between mb-4 mt-4">
            <h1
              className="text-xl tracking-widest text-[#fff5e6] font-bold"
              style={{ textShadow: "1px 1px 3px rgba(0,0,0,0.4)" }}
            >
              PYOWN CAFE
            </h1>
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-full bg-[#fff5e6]/20 hover:bg-[#fff5e6]/40 text-[#fff5e6] transition-colors"
            >
              <FiSettings size={20} />
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b6f47]" />
            <input
              type="text"
              placeholder="Search characters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#f5ead2] text-[#2d1f10] placeholder:text-[#8b6f47] outline-none border-2 border-[#c9a875] shadow-inner"
            />
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 pb-1">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all border-2 ${
                  activeFilter === tab
                    ? "bg-[#2d1f10] text-[#f5ead2] border-[#2d1f10] shadow-md"
                    : "bg-[#f5ead2]/80 text-[#5a4a3a] border-[#c9a875] hover:bg-[#f5ead2]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Character list */}
        <div className="flex-1 overflow-y-auto px-4 py-4 relative z-10">
          {filteredChars.map((char) => {
            const isActive = activeChar?.id === char.id;
            return (
              <div
                key={char.id}
                onClick={() => onSelectCharacter(char)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && onSelectCharacter(char)}
                className="w-full flex items-center gap-4 p-3.5 mb-3 rounded-2xl transition-all active:scale-[0.98] cursor-pointer"
                style={{
                  background: isActive
                    ? "linear-gradient(135deg, #fff5e6, #f5ead2)"
                    : "rgba(255,245,230,0.75)",
                  border: "2px solid #c9a875",
                  boxShadow: isActive
                    ? "0 4px 12px rgba(90,74,58,0.25)"
                    : "0 2px 6px rgba(90,74,58,0.12)",
                }}
              >
                <div
                  className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#ffd93d] to-[#ffa94d] flex items-center justify-center overflow-hidden flex-shrink-0 border-2 border-white"
                  style={{ boxShadow: "0 3px 8px rgba(0,0,0,0.2)" }}
                >
                  {char.avatar ? (
                    <img src={char.avatar} alt={char.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-white">{char.name[0]}</span>
                  )}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="font-bold text-[#2d1f10] text-base">{char.name}</div>
                  <div className="text-sm text-[#5a4a3a] truncate mt-0.5">{char.profession}</div>
                </div>
                {/* Edit button — only when active */}
                {/* {isActive && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onEditCharacter(char); }}
                    className="rounded-lg p-1.5 text-[#5a4a3a] transition hover:bg-[#c9a875]/40"
                  >
                    ✏️
                  </button>
                )} */}
              </div>
            );
          })}
        </div>

        {/* FAB — Add character */}
        <div className="absolute bottom-8 right-6 z-20">
          <button
            onClick={onAddCharacter}
            className="w-16 h-16 rounded-2xl bg-[#2d1f10] text-[#f5ead2] flex items-center justify-center shadow-2xl hover:bg-[#3a2f1f] active:scale-95 transition-all border-2 border-[#5a4a3a]"
            style={{ boxShadow: "0 6px 20px rgba(45,31,16,0.45)" }}
          >
            <Plus className="w-8 h-8" />
          </button>
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────
     DESKTOP LAYOUT (unchanged)
  ───────────────────────────────────────── */
  return (
    <aside
      className="h-full flex flex-col relative w-80"
      style={{ background: "linear-gradient(135deg, #a67c52 0%, #8b6f47 100%)" }}
    >
      {/* Leather texture overlay */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 20% 50%, transparent 20%, rgba(0,0,0,0.3) 100%)",
          mixBlendMode: "multiply",
        }}
      />

      {/* Ring binding holes */}
      <div className="absolute left-6 top-0 bottom-0 flex flex-col justify-evenly items-center z-0">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="w-3 h-3 rounded-full bg-[#3a2f1f] border-2 border-[#5a4a3a] shadow-inner" />
        ))}
      </div>

      {/* Header */}
      <div className="p-4 pl-12 pr-2 space-y-3 relative z-10">
        <div className="flex items-center justify-between">
          <h1
            className="text-lg tracking-wide text-[#2d1f10] font-bold"
            style={{ textShadow: "1px 1px 2px rgba(255,255,255,0.3)" }}
          >
            PYOWN CAFE
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
            style={{ backgroundImage: "linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)" }}
          />
        </div>
      </div>

      {/* Character List */}
      <div className="flex-1 overflow-y-auto px-2 pl-12 relative z-10">
        {filteredChars.map((char) => {
          const isActive = activeChar?.id === char.id;
          return (
            <div
              key={char.id}
              onClick={() => onSelectCharacter(char)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && onSelectCharacter(char)}
              className={`w-full flex items-center gap-3 p-3 mb-2 rounded-xl transition-all cursor-pointer ${
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
                  boxShadow: "0 4px 6px rgba(0,0,0,0.2), inset 0 2px 4px rgba(255,255,255,0.5)",
                  border: "3px solid white",
                }}
              >
                {char.avatar ? (
                  <img src={char.avatar} alt={char.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl text-[#8b6f47]">{char.name[0]}</span>
                )}
              </div>

              {/* Info + Actions */}
              <div className="flex-1 text-left min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="font-bold text-[#2d1f10] truncate">{char.name}</div>
                  {/* {isActive && (
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); onEditCharacter(char); }}
                        className="rounded-lg p-1 text-[#5a4a3a] transition hover:bg-[#c9a875]/40 hover:text-[#2d1f10]"
                      >
                        ✏️
                      </button>
                    </div>
                  )} */}
                </div>
                <div className="text-sm text-[#5a4a3a] truncate">{char.description}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 pl-12 flex flex-col gap-3 border-t-2 border-[#5a4a3a] relative z-10 bg-gradient-to-b from-transparent to-[#8b6f47]/30">
        <button
          onClick={onAddCharacter}
          className="flex-1 flex items-center justify-center gap-2 p-3 rounded-full bg-[#f5ead2] hover:bg-[#ecdfc0] text-[#2d1f10] transition-all shadow-md border-2 border-[#c9a875] font-bold"
        >
          <Plus className="w-5 h-5" />
          <span>Tambah Karakter</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;