import React, {
  useEffect,
  useState,
} from "react";

import professions from "../data/professions";
import personalities from "../data/personalities";

import ProfessionDropdown from "./ProfessionDropdown";
import MultiSelectChips from "./MultiSelectChips";

function CharacterModal({
  isOpen,
  onClose,
  editingChar,
  onSave,
}) {
  /**
   * Initial Form
   */
  const initialForm = {
    name: "",
    avatar: "",
    description: "",

    profession: "",

    traits: [],

    first_mes: "",
    scenario: "",
  };

  /**
   * State Form
   */
  const [formData, setFormData] =
    useState(initialForm);

  /**
   * Handle Input Change
   */
  const handleChange = (
    e
  ) => {
    const {
      name,
      value,
    } = e.target;

    setFormData(
      (prev) => ({
        ...prev,
        [name]: value,
      })
    );
  };

  /**
   * Detect Add / Edit Mode
   */
  useEffect(() => {
    /**
     * Edit Mode
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

        profession:
          editingChar.profession ||
          "",

        traits:
          editingChar.traits ||
          [],

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
     * Add Mode
     */
    setFormData(
      initialForm
    );
  }, [editingChar]);

  /**
   * Close Modal
   */
  if (!isOpen)
    return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      {/* Modal */}
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
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

          {/* Profession */}
          <ProfessionDropdown
            label="Profession"
            value={
              formData.profession
            }
            options={
              professions
            }
            onChange={(
              value
            ) =>
              setFormData(
                (
                  prev
                ) => ({
                  ...prev,
                  profession:
                    value,
                })
              )
            }
          />

          {/* Traits */}
          <MultiSelectChips
            label="Traits"
            options={
              personalities
            }
            selected={
              formData.traits
            }
            setSelected={(
              traits
            ) =>
              setFormData(
                (
                  prev
                ) => ({
                  ...prev,
                  traits,
                })
              )
            }
            max={3}
          />

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