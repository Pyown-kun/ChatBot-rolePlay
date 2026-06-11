import Dexie from "dexie";

export const db =
  new Dexie("roleplayDB");

db.version(1).stores({
  characters: "id",
  chats: "charId",
  settings: "id",
  backups: "id",
});