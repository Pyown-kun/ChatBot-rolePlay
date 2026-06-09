import React, {
    useEffect,
  useState,
} from "react";

function CharacterModal({
  isOpen,
  onClose,
  editingChar,
  onSave,
}) {
const initialForm =
  {
    name: "",
    avatar: "",
    description:
      "",
    personality:
      "",
    first_mes:
      "",
    scenario:
      "",
  };

  /**
   * State Form
   */
  const [formData,
  setFormData] =
  useState(
    initialForm
  );

  /**
   * Handle Input Change
   */
  const handleChange =
    (e) => {
      const {
        name,
        value,
      } = e.target;

      setFormData(
        (prev) => ({
          ...prev,
          [name]:
            value,
        })
      );
    };

    /**
 * Detect Mode
 * Add / Edit
 */
useEffect(() => {
  /**
   * Mode Edit
   */
  if (editingChar) {
    setFormData({
      name:
        editingChar.name ||
        "",

      avatar:
        editingChar.avatar ||
        "",

      description:
        editingChar.description ||
        "",

      personality:
        editingChar.personality ||
        "",

      first_mes:
        editingChar.first_mes ||
        "",

      scenario:
        editingChar.scenario ||
        "",
    });

    return;
  }

  /**
   * Mode Add
   */
  setFormData(
    initialForm
  );
}, [editingChar]);

  /**
   * Jangan render
   */
  if (!isOpen)
    return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      {/* Modal */}
      <div className="relative w-full max-w-3xl rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
  {editingChar
    ? "Edit Character"
    : "Create Character"}
</h2>

          <button
            onClick={
              onClose
            }
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <div className="space-y-5">
          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Character Name
            </label>

            <input
              type="text"
              name="name"
              value={
                formData.name
              }
              onChange={
                handleChange
              }
              placeholder="Aris"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-violet-500"
            />
          </div>

          {/* Avatar */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Avatar URL
            </label>

            <input
              type="text"
              name="avatar"
              value={
                formData.avatar
              }
              onChange={
                handleChange
              }
              placeholder="https://..."
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-violet-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Description
            </label>

            <textarea
              name="description"
              value={
                formData.description
              }
              onChange={
                handleChange
              }
              rows={3}
              placeholder="Deskripsi karakter..."
              className="w-full resize-none rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-violet-500"
            />
          </div>

          {/* Personality */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Personality
            </label>

            <textarea
              name="personality"
              value={
                formData.personality
              }
              onChange={
                handleChange
              }
              rows={3}
              placeholder="Kaku, protektif..."
              className="w-full resize-none rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-violet-500"
            />
          </div>

          {/* First Message */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              First Message
            </label>

            <textarea
              name="first_mes"
              value={
                formData.first_mes
              }
              onChange={
                handleChange
              }
              rows={3}
              placeholder="Halo..."
              className="w-full resize-none rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-violet-500"
            />
          </div>

          {/* Scenario */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Scenario
            </label>

            <textarea
              name="scenario"
              value={
                formData.scenario
              }
              onChange={
                handleChange
              }
              rows={3}
              placeholder="User bertemu..."
              className="w-full resize-none rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-violet-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={
              onClose
            }
            className="rounded-xl border border-slate-600 px-5 py-3 text-slate-300 transition hover:bg-slate-800"
          >
            Batal
          </button>

          <button
  onClick={() =>
    onSave(
      formData
    )
  }
  className="rounded-xl bg-violet-600 px-5 py-3 font-medium text-white transition hover:bg-violet-700"
>
  {editingChar
    ? "Update"
    : "Create"}
</button>
        </div>
      </div>
    </div>
  );
}

export default CharacterModal;