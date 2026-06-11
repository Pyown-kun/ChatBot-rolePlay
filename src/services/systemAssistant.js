export function getSystemReply(
  message,
  settings
) {
  const text =
    message.toLowerCase();

  const isConnected =
    settings?.apiKey &&
    settings?.provider;

  // belum connect API
  if (!isConnected) {
    return `
Halo! Aku assistant untuk membantu setup web ini.

Sebelum memakai fitur AI roleplay, kamu perlu menghubungkan API provider terlebih dahulu.

Buka menu Settings lalu isi:
• Provider AI
• API Key
• Model

Contoh gratis:
- Gemini API
- OpenRouter free model
`;
  }

  // bantuan setup web
  if (
    text.includes("api") ||
    text.includes("provider") ||
    text.includes("setting")
  ) {
    return `
Kamu sudah terhubung ke API provider.

Kalau ingin ganti provider, buka menu Settings lalu ubah:
• Provider
• Base URL
• Model
• API Key
`;
  }

  if (
    text.includes("buat karakter") ||
    text.includes("character")
  ) {
    return `
Untuk membuat karakter:

1. Klik tombol tambah karakter
2. Pilih profesi & sifat
3. Isi manual atau gunakan auto generate
4. Simpan karakter
`;
  }

  if (
    text.includes("import") ||
    text.includes("export")
  ) {
    return `
Kamu bisa backup karakter lewat Export JSON dan memulihkannya lewat Import JSON.

Character assistant bawaan tidak ikut terexport.
`;
  }

  return `
Aku khusus membantu penggunaan web ini.

Kamu bisa tanya soal:
• setup API
• membuat karakter
• import/export
• cara memakai fitur roleplay
`;
}