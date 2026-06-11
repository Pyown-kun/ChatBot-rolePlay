import React, { useEffect, useRef, useState } from "react";
import { X, Upload, Sparkles } from "lucide-react";

import professions from "../data/professions";
import personalities from "../data/personalities";

import ProfessionDropdown from "./ProfessionDropdown";
import MultiSelectChips from "./MultiSelectChips";

import { generateCharacter } from "../services/characterGenerator";
import { useCharacterImport } from "./CharacterImportExport";
import ImportExportToast from "./ImportExportToast";

function CharacterModal({ isOpen, onClose, editingChar, onSave, settings, onImport, characters }) {
  const importInputRef = useRef(null);
  const [toast, setToast] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  /**
   * Resize image supaya avatar kecil dan aman diexport JSON
   */
  const resizeImage = (file) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (e) => { img.src = e.target.result; };
      reader.onerror = reject;
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          const size = 256;
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, size, size);
          resolve(canvas.toDataURL("image/jpeg", 0.8));
        } catch (error) { reject(error); }
      };
      reader.readAsDataURL(file);
    });

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await resizeImage(file);
      setFormData((prev) => ({ ...prev, avatar: compressed }));
    } catch (error) {
      console.error("Gagal memproses avatar:", error);
      alert("Gagal upload avatar.");
    }
  };

  // Wrap onImport untuk tampilkan toast lalu auto close
  const { handleImport } = useCharacterImport((imported) => {
    onImport(imported);
    setToast({ type: "import" });
  });

  const handleAutoGenerate = async () => {
    if (!formData.profession) { alert("Pilih profession terlebih dahulu."); return; }
    if (formData.traits.length === 0) { alert("Pilih minimal 1 trait."); return; }
    if (!settings?.apiKey) { alert("API Key belum diisi."); return; }
    try {
      setIsGenerating(true);
      const generated = await generateCharacter({
        config: settings,
        profession: formData.profession,
        traits: formData.traits,
        name: formData.name || "Unknown",
      });
      setFormData((prev) => ({
        ...prev,
        description: generated.description,
        first_mes: generated.first_mes,
      }));
    } catch (error) {
      console.error(error);
      alert("Gagal generate character.");
    } finally {
      setIsGenerating(false);
    }
  };

  const initialForm = {
    name: "", avatar: "", description: "",
    profession: "", traits: [], first_mes: "",
  };

  const [formData, setFormData] = useState(initialForm);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (editingChar) {
      setFormData({
        name: editingChar.name || "",
        avatar: editingChar.avatar || "",
        description: editingChar.description || "",
        profession: editingChar.profession || "",
        traits: editingChar.traits || [],
        first_mes: editingChar.first_mes || "",
      });
      return;
    }
    setFormData(initialForm);
  }, [editingChar]);

  if (!isOpen) return null;

  const inputClass =
    "w-full rounded-xl px-4 py-3 text-[#2d1f10] bg-white border-2 border-[#c9a875] outline-none transition focus:border-[#ffa94d] placeholder:text-[#8b6f47] font-medium shadow-inner";
  const textareaClass =
    "w-full resize-none rounded-xl px-4 py-3 text-[#2d1f10] bg-white border-2 border-[#c9a875] outline-none transition focus:border-[#ffa94d] placeholder:text-[#8b6f47] font-medium shadow-inner";
  const labelClass =
    "mb-2 block text-sm font-bold text-[#2d1f10] flex items-center gap-2";

  // Pesan loading yang berganti-ganti
  const loadingMessages = [
    "Menulis kepribadian...",
    "Meramu cerita latar...",
    "Menyusun kalimat pembuka...",
    "Menghidupkan karakter...",
    "Hampir selesai...",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div
        className="w-full max-w-2xl flex flex-col shadow-2xl relative"
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
          {[...Array(7)].map((_, i) => (
            <div key={i} className="w-4 h-4 rounded-full bg-[#5a4a3a] border-2 border-[#3a2f1f] shadow-lg" />
          ))}
        </div>

        {/* ── GENERATING OVERLAY ── */}
        {isGenerating && (
          <div
            className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-6 p-8"
            style={{
              background: "linear-gradient(135deg, rgba(245,234,210,0.97), rgba(236,223,192,0.97))",
              borderRadius: "16px",
            }}
          >
            {/* Ring holes masih terlihat */}
            <div className="absolute left-4 top-0 bottom-0 flex flex-col justify-evenly items-center pointer-events-none">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="w-4 h-4 rounded-full bg-[#5a4a3a] border-2 border-[#3a2f1f] shadow-lg" />
              ))}
            </div>

            {/* Polaroid spinner */}
            <div className="relative">
              {/* Washi tape */}
              <div
                className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-5 opacity-80 z-10"
                style={{
                  backgroundColor: "#ffa94d",
                  backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(255,255,255,0.3) 8px, rgba(255,255,255,0.3) 16px)",
                  transform: "translateX(-50%) rotate(-3deg)",
                  borderRadius: "2px",
                }}
              />
              <div className="bg-white p-3 pb-7 rounded-sm shadow-2xl" style={{ animation: "gentleRock 2s ease-in-out infinite" }}>
                <div
                  className="w-24 h-24 rounded-sm flex items-center justify-center overflow-hidden"
                  style={{ background: "linear-gradient(135deg, #ffd93d, #ffa94d)" }}
                >
                  {formData.avatar ? (
                    <img src={formData.avatar} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl font-bold text-white">
                      {formData.name?.[0] || "?"}
                    </span>
                  )}
                </div>
                <div className="text-center mt-2 text-[#3a2f1f] text-xs font-medium">
                  {formData.name || "Character"}
                </div>
              </div>

              {/* Spinning sparkles around polaroid */}
              <div
                className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #ffa94d, #ff6b6b)",
                  animation: "spin 2s linear infinite",
                  boxShadow: "0 2px 8px rgba(255,107,107,0.4)",
                }}
              >
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* Message card */}
            <div className="bg-white/80 rounded-lg px-6 py-4 border-2 border-[#c9a875] shadow-md w-full max-w-xs relative overflow-hidden">
              <div className="absolute top-0 right-0 w-14 h-14 bg-[#ffa94d] opacity-10 rounded-full -translate-y-7 translate-x-7" />
              {/* Lined paper */}
              <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="h-full flex flex-col justify-evenly px-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-px bg-[#8b6f47]" />
                  ))}
                </div>
              </div>
              <p className="text-center font-bold text-[#2d1f10] text-sm relative z-10 mb-1">
                ✨ Sedang Generating...
              </p>
              <GeneratingMessage messages={loadingMessages} />
            </div>

            {/* Progress dots */}
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    backgroundColor: "#ffa94d",
                    animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                  }}
                />
              ))}
            </div>

            {/* Warning note */}
            <div className="bg-[#ffd93d]/30 rounded-lg px-4 py-2 border border-[#c9a875] max-w-xs">
              <p className="text-xs text-[#5a4a3a] text-center">
                Mohon tunggu, jangan tutup modal ini untuk menghemat token AI.
              </p>
            </div>

            <style>{`
              @keyframes gentleRock {
                0%, 100% { transform: rotate(-2deg); }
                50% { transform: rotate(2deg); }
              }
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
              @keyframes bounce {
                0%, 100% { transform: translateY(0); opacity: 0.5; }
                50% { transform: translateY(-6px); opacity: 1; }
              }
            `}</style>
          </div>
        )}

        {/* Scrollable content */}
        <div className={`overflow-y-auto flex-1 relative p-6 pl-12 ${isGenerating ? "pointer-events-none select-none" : ""}`}>

          {/* Close button */}
          <div className="absolute top-4 right-4 z-30">
            <button
              onClick={onClose}
              disabled={isGenerating}
              className="p-2 rounded-full bg-[#c74440] text-white hover:bg-[#a83632] transition-colors shadow-lg border-2 border-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Title */}
          <div className="mb-6 pt-1">
            <h2 className="text-2xl font-bold text-[#2d1f10] relative inline-block">
              {editingChar ? "Edit Character" : "Create Character"}
              <div className="absolute -bottom-1 left-0 right-0 h-1 bg-[#ffa94d] opacity-50" />
            </h2>
          </div>

          <div className="space-y-4">

            {/* Name */}
            <div className="bg-white/80 rounded-lg p-4 border-2 border-[#c9a875] shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#ff6b6b] opacity-10 rounded-full -translate-y-8 translate-x-8" />
              <label className={labelClass}>
                <span className="w-2 h-2 bg-[#ff6b6b] rounded-full inline-block" />
                Character Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Aris"
                className={inputClass}
              />
            </div>

            {/* Avatar */}
            <div className="bg-white/80 rounded-lg p-4 border-2 border-[#c9a875] shadow-md">
              <label className={labelClass}>
                <span className="w-2 h-2 bg-[#ffa94d] rounded-full inline-block" />
                Avatar
              </label>
              <div className="flex items-center gap-4">
                {/* Polaroid preview */}
                <div className="bg-white p-1.5 pb-4 rounded-sm shadow-lg transform -rotate-2 flex-shrink-0">
                  <div className="w-16 h-16 rounded-sm overflow-hidden bg-[#f5ead2] flex items-center justify-center">
                    {formData.avatar ? (
                      <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl text-[#8b6f47] font-bold">
                        {formData.name?.[0] || "?"}
                      </span>
                    )}
                  </div>
                  <div className="text-center mt-1 text-[#3a2f1f] text-xs">
                    {formData.name || "Preview"}
                  </div>
                </div>

                {/* Upload button */}
                <label
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-[#2d1f10] border-2 border-[#c9a875] cursor-pointer transition hover:bg-[#ecdfc0] shadow-md"
                  style={{ background: "rgba(255,255,255,0.6)" }}
                >
                  <Upload className="w-4 h-4" />
                  <span className="text-sm">Pilih Gambar</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                </label>
              </div>
            </div>

            {/* Profession */}
            <div className="bg-white/80 rounded-lg p-4 border-2 border-[#c9a875] shadow-md">
              <label className={labelClass}>
                <span className="w-2 h-2 bg-[#ffd93d] rounded-full inline-block" />
                Profession
              </label>
              <ProfessionDropdown
                value={formData.profession}
                options={professions}
                onChange={(value) => setFormData((prev) => ({ ...prev, profession: value }))}
              />
            </div>

            {/* Traits */}
            <div className="bg-white/80 rounded-lg p-4 border-2 border-[#c9a875] shadow-md">
              <label className={labelClass}>
                <span className="w-2 h-2 bg-[#6bcf7f] rounded-full inline-block" />
                Traits
              </label>
              <MultiSelectChips
                options={personalities}
                selected={formData.traits}
                setSelected={(traits) => setFormData((prev) => ({ ...prev, traits }))}
                max={3}
              />
            </div>

            {/* Generate button */}
            <button
              onClick={handleAutoGenerate}
              disabled={isGenerating}
              className="w-full py-3 rounded-xl font-bold text-white transition-all shadow-lg border-2 border-white hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{ background: "linear-gradient(135deg, #ffa94d, #ff6b6b)" }}
            >
              ✨ Generate Character
            </button>

            {/* Description */}
            <div className="bg-white/80 rounded-lg p-4 border-2 border-[#c9a875] shadow-md relative">
              <div className="absolute inset-0 opacity-5 pointer-events-none rounded-lg">
                <div className="h-full flex flex-col justify-evenly px-2">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-px bg-[#8b6f47]" />
                  ))}
                </div>
              </div>
              <label className={`${labelClass} relative z-10`}>
                <span className="w-2 h-2 bg-[#4d9de0] rounded-full inline-block" />
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Deskripsi karakter..."
                className={`${textareaClass} relative z-10`}
              />
            </div>

            {/* First Message */}
            <div className="bg-white/80 rounded-lg p-4 border-2 border-[#c9a875] shadow-md relative">
              <div className="absolute inset-0 opacity-5 pointer-events-none rounded-lg">
                <div className="h-full flex flex-col justify-evenly px-2">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-px bg-[#8b6f47]" />
                  ))}
                </div>
              </div>
              <label className={`${labelClass} relative z-10`}>
                <span className="w-2 h-2 bg-[#ffd93d] rounded-full inline-block" />
                First Message
              </label>
              <textarea
                name="first_mes"
                value={formData.first_mes}
                onChange={handleChange}
                rows={3}
                placeholder="Halo..."
                className={`${textareaClass} relative z-10`}
              />
            </div>

          </div>
        </div>

        {/* Footer */}
        <div
          className="flex-shrink-0 flex items-center gap-3 px-6 py-4 border-t-2 border-[#c9a875]/40"
          style={{
            background: "linear-gradient(to bottom, transparent, rgba(139,111,71,0.1))",
            borderRadius: "0 0 16px 16px",
          }}
        >
          <label
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-[#c9a875] text-[#2d1f10] font-medium transition shadow-md ${isGenerating ? "opacity-40 cursor-not-allowed pointer-events-none" : "hover:bg-[#ecdfc0] cursor-pointer"}`}
            title="Import karakter dari file JSON"
          >
            <Upload className="w-4 h-4" />
            <span className="text-sm">Import</span>
            <input
              ref={importInputRef}
              type="file"
              accept=".json"
              hidden
              onChange={handleImport}
              disabled={isGenerating}
            />
          </label>

          <div className="flex-1" />

          <button
            onClick={onClose}
            disabled={isGenerating}
            className="px-5 py-2.5 rounded-xl border-2 border-[#c9a875] text-[#2d1f10] font-medium transition hover:bg-[#ecdfc0] shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Batal
          </button>
          <button
            onClick={() => onSave(formData)}
            disabled={isGenerating}
            className="px-5 py-2.5 rounded-xl font-bold text-white transition-all shadow-lg border-2 border-white hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{ background: "linear-gradient(135deg, #ffa94d, #ff6b6b)" }}
          >
            {editingChar ? "Update" : "Create"}
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <ImportExportToast
          type={toast.type}
          onDone={() => {
            setToast(null);
            onClose();
          }}
        />
      )}
    </div>
  );
}

// Sub-component: cycling loading messages
function GeneratingMessage({ messages }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <p
      className="text-center text-xs text-[#5a4a3a] relative z-10 transition-opacity duration-500"
      key={index}
    >
      {messages[index]}
    </p>
  );
}

export default CharacterModal;