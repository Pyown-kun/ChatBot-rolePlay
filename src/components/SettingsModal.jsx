
import { X, KeyRound, Bot, Sparkles } from "lucide-react";

const PROVIDERS = {
  gemini: {
    label: "Gemini AI",
    endpoint:
      "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    models: [
      "gemini-2.5-flash",
      "gemini-2.0-flash",
      "gemini-2.0-flash-lite",
      "gemini-3.5-flash",
    ],
  },

  openrouter: {
    label: "OpenRouter",
    endpoint: "https://openrouter.ai/api/v1/chat/completions",
    models: [
      "google/gemma-3-27b-it:free",
      "mistralai/mistral-small-3.1-24b-instruct:free",
      "meta-llama/llama-3.1-8b-instruct:free",
      "qwen/qwen3-32b:free",
    ],
  },

  openai: {
    label: "OpenAI",
    endpoint: "https://api.openai.com/v1/chat/completions",
    models: ["gpt-4o-mini", "gpt-4.1-mini"],
  },

  custom: {
    label: "Custom API",
    endpoint: "",
    models: [],
  },
};

function SettingsModal({
  isOpen,
  onClose,
  settings,
  setSettings,
  onResetChats,
}) {
  if (!isOpen) return null;

  const providerData =
    PROVIDERS[settings.provider] || PROVIDERS.gemini;

  const handleProviderChange = (provider) => {
    const providerConfig = PROVIDERS[provider];

    setSettings((prev) => ({
      ...prev,
      provider,
      baseUrl: providerConfig.endpoint,
      model: providerConfig.models[0] || "",
    }));
  };

  const handleSave = () => {
    localStorage.setItem(
      "api_config",
      JSON.stringify(settings)
    );
    onClose();
  };

  const inputClass =
    "w-full rounded-2xl px-4 py-3 bg-white border-2 border-[#d5b88b] outline-none transition focus:border-[#ffb347] text-[#2d1f10] shadow-inner";

  const cardClass =
    "bg-white/80 rounded-2xl p-4 border-2 border-[#d8bf98] shadow-md";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div
        className="w-full max-w-lg overflow-hidden"
        style={{
          border: "8px solid #8b6f47",
          borderRadius: "28px",
          background:
            "linear-gradient(135deg, #f5ead2, #ecdfc0)",
        }}
      >
        {/* Header */}
        <div className="relative p-6 border-b border-[#d6bb93]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-red-500 text-white hover:bg-red-600"
          >
            <X size={18} />
          </button>

          <h2 className="text-2xl font-bold text-[#2d1f10] flex items-center gap-2">
            <Sparkles className="text-orange-500" />
            AI Settings
          </h2>

          <p className="text-sm text-[#6d5636] mt-1">
            Pilih provider AI dan masukkan API key.
            Endpoint & model diatur otomatis.
          </p>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Provider */}
          <div className={cardClass}>
            <label className="font-bold text-[#2d1f10] mb-2 block flex items-center gap-2">
              <Bot size={18} />
              Provider AI
            </label>

            <select
              value={settings.provider}
              onChange={(e) =>
                handleProviderChange(e.target.value)
              }
              className={inputClass}
            >
              <option value="gemini">
                Gemini AI
              </option>
              <option value="openrouter">
                OpenRouter
              </option>
              <option value="openai">
                OpenAI
              </option>
              <option value="custom">
                Custom API
              </option>
            </select>
          </div>

          {/* API Key */}
          <div className={cardClass}>
            <label className="font-bold text-[#2d1f10] mb-2 block flex items-center gap-2">
              <KeyRound size={18} />
              API Key
            </label>

            <input
              type="password"
              value={settings.apiKey}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  apiKey: e.target.value,
                }))
              }
              placeholder="Paste API Key di sini"
              className={inputClass}
            />
          </div>

          {/* Model Dropdown */}
          {settings.provider !== "custom" && (
            <div className={cardClass}>
              <label className="font-bold text-[#2d1f10] mb-2 block">
                Model AI
              </label>

              <select
                value={settings.model}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    model: e.target.value,
                  }))
                }
                className={inputClass}
              >
                {providerData.models.map((model) => (
                  <option
                    key={model}
                    value={model}
                  >
                    {model}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Custom URL */}
          {settings.provider === "custom" && (
            <div className={cardClass}>
              <label className="font-bold text-[#2d1f10] mb-2 block">
                Base URL
              </label>

              <input
                type="text"
                value={settings.baseUrl}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    baseUrl: e.target.value,
                  }))
                }
                placeholder="https://api.example.com"
                className={inputClass}
              />

              <label className="font-bold text-[#2d1f10] mt-4 mb-2 block">
                Model Name
              </label>

              <input
                type="text"
                value={settings.model}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    model: e.target.value,
                  }))
                }
                placeholder="model-name"
                className={inputClass}
              />
            </div>
          )}

          {/* Reset Chat */}
          <div className={cardClass}>
            <button
              onClick={onResetChats}
              className="w-full rounded-2xl py-3 font-bold text-white bg-gradient-to-r from-red-500 to-red-700 hover:opacity-90"
            >
              Reset Semua Chat
            </button>

            <p className="text-xs text-[#866742] mt-2">
              Menghapus seluruh riwayat chat.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-[#d6bb93]">
          <button
            onClick={handleSave}
            className="w-full py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-orange-400 to-pink-500 hover:scale-[1.01] transition"
          >
            Simpan Pengaturan
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;
