import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

import professions from "../data/professions";
import personalities from "../data/personalities";

import ProfessionDropdown from "./ProfessionDropdown";
import MultiSelectChips from "./MultiSelectChips";

import { generateCharacter } from "../services/characterGenerator";

function CharacterModal({ isOpen, onClose, editingChar, onSave, settings }) {
  const handleAutoGenerate = async () => {
    if (!formData.profession) {
      alert("Pilih profession terlebih dahulu.");
      return;
    }

    if (formData.traits.length === 0) {
      alert("Pilih minimal 1 trait.");
      return;
    }

    if (!settings?.apiKey) {
      alert("API Key belum diisi.");
      return;
    }

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

        scenario: generated.scenario,
      }));
    } catch (error) {
      console.error(error);

      alert("Gagal generate character.");
    } finally {
      setIsGenerating(false);
    }
  };

  const [isGenerating, setIsGenerating] = useState(false);

  const initialForm = {
    name: "",
    avatar: "",
    description: "",
    profession: "",
    traits: [],
    first_mes: "",
    scenario: "",
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
        scenario: editingChar.scenario || "",
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div
        className="w-full max-w-2xl flex flex-col shadow-2xl relative"
        style={{
          border: "8px solid #8b6f47",
          borderRadius: "24px",
          maxHeight: "90vh",
          background: "linear-gradient(135deg, #f5ead2, #ecdfc0)",
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.3)",
        }}
      >
        {/* Ring binding holes */}
        <div className="absolute left-4 top-0 bottom-0 flex flex-col justify-evenly items-center pointer-events-none z-10">
          {[...Array(7)].map((_, i) => (
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
                Avatar URL
              </label>
              <input
                type="text"
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                placeholder="https://..."
                className={inputClass}
              />
              {formData.avatar && (
                <div className="mt-3 flex justify-center">
                  <div className="bg-white p-2 pb-5 rounded-sm shadow-lg transform -rotate-2">
                    <div className="w-20 h-20 rounded-sm overflow-hidden bg-[#f5ead2]">
                      <img
                        src={formData.avatar}
                        alt="preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                    <div className="text-center mt-1 text-[#3a2f1f] text-xs">
                      {formData.name || "Preview"}
                    </div>
                  </div>
                </div>
              )}
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
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, profession: value }))
                }
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
                setSelected={(traits) =>
                  setFormData((prev) => ({ ...prev, traits }))
                }
                max={3}
              />
            </div>

            <button
              onClick={handleAutoGenerate}
              disabled={isGenerating}
              className={`w-full py-3 rounded-xl font-bold text-white transition-all shadow-lg border-2 border-white hover:scale-[1.01] active:scale-[0.99]"
              style={{ background: "linear-gradient(135deg, #ffa94d, #ff6b6b)" }} ${
                isGenerating
                  ? "cursor-not-allowed bg-slate-600"
                  : "bg-orange-400 hover:bg-red-500"
              }`}
            >
              {isGenerating ? "Generating..." : "✨ Generate Character"}
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

            {/* Scenario */}
            <div className="bg-white/80 rounded-lg p-4 border-2 border-[#c9a875] shadow-md">
              <label className={labelClass}>
                <span className="w-2 h-2 bg-[#c77dff] rounded-full inline-block" />
                Scenario
              </label>
              <textarea
                name="scenario"
                value={formData.scenario}
                onChange={handleChange}
                rows={3}
                placeholder="User bertemu..."
                className={textareaClass}
              />
            </div>
          </div>
        </div>

        {/* Footer — always visible, outside scroll */}
        <div
          className="flex-shrink-0 flex justify-end gap-3 px-6 py-4 border-t-2 border-[#c9a875]/40"
          style={{
            background:
              "linear-gradient(to bottom, transparent, rgba(139,111,71,0.1))",
            borderRadius: "0 0 16px 16px",
          }}
        >
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border-2 border-[#c9a875] text-[#2d1f10] font-medium transition hover:bg-[#ecdfc0] shadow-md"
          >
            Batal
          </button>
          <button
            onClick={() => onSave(formData)}
            className="px-5 py-2.5 rounded-xl font-bold text-white transition-all shadow-lg border-2 border-white hover:scale-105"
            style={{ background: "linear-gradient(135deg, #ffa94d, #ff6b6b)" }}
          >
            {editingChar ? "Update" : "Create"}
          </button>
        </div>
      </div>

      {/* Generate overlay */}
      {isGenerating && (
        <div className="absolute inset-0 z-50 flex items-center justify-center rounded-2xl bg-black/70 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 rounded-2xl bg-orange-100 px-8 py-6 shadow-2xl border border-slate-700">
            {/* Spinner */}
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-500 border-t-transparent" />

            <div className="text-center">
              <h3 className="text-lg font-semibold text-black">
                Generating Character...
              </h3>

              <p className="text-sm text-black-800">
                Sedang membuat deskripsi, skenario, dan first message
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CharacterModal;
