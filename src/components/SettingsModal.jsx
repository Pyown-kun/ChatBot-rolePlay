function SettingsModal({
  isOpen,
  onClose,
  settings,
  setSettings,
  onResetChats,
}) {
  if (!isOpen) return null;

  const handleChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // save ke localStorage
  const handleSave = () => {
    localStorage.setItem("api_config", JSON.stringify(settings));

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-lg rounded-3xl bg-slate-900 p-6 text-white shadow-2xl">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold">API Settings</h2>

          <button onClick={onClose} className="text-slate-400 hover:text-white">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* Provider */}
          <div>
            <label className="mb-2 block text-sm">API Provider</label>

            <select
              value={settings.provider}
              onChange={(e) => handleChange("provider", e.target.value)}
              className="w-full rounded-xl bg-slate-800 px-4 py-3 outline-none"
            >
              <option value="openai">OpenAI</option>

              <option value="openrouter">OpenRouter</option>

              <option value="custom">Custom API</option>
            </select>
          </div>

          {/* API KEY */}
          <div>
            <label className="mb-2 block text-sm">API Key</label>

            <input
              type="password"
              value={settings.apiKey}
              onChange={(e) => handleChange("apiKey", e.target.value)}
              placeholder="sk-xxxx"
              className="w-full rounded-xl bg-slate-800 px-4 py-3 outline-none"
            />
          </div>

          {/* URL */}
          <div>
            <label className="mb-2 block text-sm">Base URL / Endpoint</label>

            <input
              type="text"
              value={settings.baseUrl}
              onChange={(e) => handleChange("baseUrl", e.target.value)}
              placeholder="https://api.openai.com/v1"
              className="w-full rounded-xl bg-slate-800 px-4 py-3 outline-none"
            />
          </div>

          {/* MODEL */}
          <div>
            <label className="mb-2 block text-sm">Model Name</label>

            <input
              type="text"
              value={settings.model}
              onChange={(e) => handleChange("model", e.target.value)}
              placeholder="gpt-4o"
              className="w-full rounded-xl bg-slate-800 px-4 py-3 outline-none"
            />
          </div>
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          className="mt-6 w-full rounded-xl bg-indigo-600 py-3 font-semibold hover:opacity-90"
        >
          Simpan
        </button>

        <div className="mt-6 border-t border-slate-700 pt-4">
          <p className="mb-3 text-sm text-slate-400">Chat Management</p>

          <button
            onClick={onResetChats}
            className="w-full rounded-lg bg-red-600 px-4 py-3 font-medium transition hover:bg-red-700"
          >
            Reset Semua Chat
          </button>

          <p className="mt-2 text-xs text-slate-500">
            Menghapus seluruh riwayat chat dan menyisakan pesan awal karakter.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;
