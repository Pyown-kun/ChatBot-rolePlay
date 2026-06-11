import { X } from "lucide-react";

function SettingsModal({ isOpen, onClose, settings, setSettings, onResetChats }) {
  if (!isOpen) return null;

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    localStorage.setItem("api_config", JSON.stringify(settings));
    onClose();
  };

  const inputClass =
    "w-full rounded-xl px-4 py-3 text-[#2d1f10] bg-white border-2 border-[#c9a875] outline-none transition focus:border-[#ffa94d] placeholder:text-[#8b6f47] font-medium shadow-inner";

  const labelClass =
    "mb-2 block text-sm font-bold text-[#2d1f10] flex items-center gap-2";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div
        className="w-full max-w-lg flex flex-col shadow-2xl relative"
        style={{
          border: "8px solid #8b6f47",
          borderRadius: "24px",
          maxHeight: "90vh",
          background: "linear-gradient(135deg, #f5ead2, #ecdfc0)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.3)",
        }}
      >
        {/* Ring binding holes */}
        <div className="absolute left-4 top-0 bottom-0 flex flex-col justify-evenly items-center pointer-events-none z-10">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-4 h-4 rounded-full bg-[#5a4a3a] border-2 border-[#3a2f1f] shadow-lg" />
          ))}
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 p-6 pl-12 relative">

          {/* Close button */}
          <div className="absolute top-4 right-4 z-30">
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-[#c74440] text-white hover:bg-[#a83632] transition-colors shadow-lg border-2 border-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Title */}
          <div className="mb-6 pt-1">
            <h2 className="text-2xl font-bold text-[#2d1f10] relative inline-block">
              API Settings
              <div className="absolute -bottom-1 left-0 right-0 h-1 bg-[#ffa94d] opacity-50" />
            </h2>
          </div>

          <div className="space-y-4">

            {/* Provider */}
            <div className="bg-white/80 rounded-lg p-4 border-2 border-[#c9a875] shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#ff6b6b] opacity-10 rounded-full -translate-y-8 translate-x-8" />
              <label className={labelClass}>
                <span className="w-2 h-2 bg-[#ff6b6b] rounded-full inline-block" />
                API Provider
              </label>
              <select
                value={settings.provider}
                onChange={(e) => handleChange("provider", e.target.value)}
                className={inputClass}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%238b6f47' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 14px center",
                  paddingRight: "40px",
                  appearance: "none",
                }}
              >
                <option value="openrouter">OpenRouter</option>
                <option value="gemini">GeminiAI</option>
                <option value="openai">OpenAI</option>
                <option value="custom">Custom API</option>
              </select>
            </div>

            {/* API Key */}
            <div className="bg-white/80 rounded-lg p-4 border-2 border-[#c9a875] shadow-md">
              <label className={labelClass}>
                <span className="w-2 h-2 bg-[#ffa94d] rounded-full inline-block" />
                API Key
              </label>
              <input
                type="password"
                value={settings.apiKey}
                onChange={(e) => handleChange("apiKey", e.target.value)}
                placeholder="sk-xxxx"
                className={inputClass}
              />
            </div>

            {/* Base URL */}
            <div className="bg-white/80 rounded-lg p-4 border-2 border-[#c9a875] shadow-md">
              <label className={labelClass}>
                <span className="w-2 h-2 bg-[#ffd93d] rounded-full inline-block" />
                Base URL / Endpoint
              </label>
              <input
                type="text"
                value={settings.baseUrl}
                onChange={(e) => handleChange("baseUrl", e.target.value)}
                placeholder=""
                className={inputClass}
              />
            </div>

            {/* Model */}
            <div className="bg-white/80 rounded-lg p-4 border-2 border-[#c9a875] shadow-md">
              <label className={labelClass}>
                <span className="w-2 h-2 bg-[#6bcf7f] rounded-full inline-block" />
                Model Name
              </label>
              <input
                type="text"
                value={settings.model}
                onChange={(e) => handleChange("model", e.target.value)}
                placeholder="gpt-4o"
                className={inputClass}
              />
            </div>

            {/* Reset Chats */}
            <div className="bg-white/80 rounded-lg p-4 border-2 border-[#c9a875] shadow-md">
              <label className={labelClass}>
                <span className="w-2 h-2 bg-[#c74440] rounded-full inline-block" />
                Chat Management
              </label>
              <button
                onClick={onResetChats}
                className="w-full rounded-xl py-3 font-bold text-white transition-all shadow-md border-2 border-white hover:scale-[1.01] active:scale-[0.99]"
                style={{ background: "linear-gradient(135deg, #c74440, #a83632)" }}
              >
                Reset Semua Chat
              </button>
              <p className="mt-2 text-xs text-[#8b6f47]">
                Menghapus seluruh riwayat chat dan menyisakan pesan awal karakter.
              </p>
            </div>

          </div>
        </div>

        {/* Footer — always visible */}
        <div
          className="flex-shrink-0 px-6 py-4 border-t-2 border-[#c9a875]/40"
          style={{
            background: "linear-gradient(to bottom, transparent, rgba(139,111,71,0.1))",
            borderRadius: "0 0 16px 16px",
          }}
        >
          <button
            onClick={handleSave}
            className="w-full py-3 rounded-xl font-bold text-white transition-all shadow-lg border-2 border-white hover:scale-[1.01] active:scale-[0.99]"
            style={{ background: "linear-gradient(135deg, #ffa94d, #ff6b6b)" }}
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;