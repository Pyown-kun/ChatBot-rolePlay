import { db } from "./db";

export const characterService = {
  async getAll() {
    return await db.characters.toArray();
  },

  async save(character) {
    return await db.characters.put(character);
  },

  async delete(id) {
    return await db.characters.delete(id);
  },

  async bulkSave(characters) {
    return await db.characters.bulkPut(characters);
  },

  // Hapus semua karakter dari DB
  async clearAll() {
    return await db.characters.clear();
  },
};