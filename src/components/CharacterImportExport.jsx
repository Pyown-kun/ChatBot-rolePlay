// CharacterImportExport.jsx
// Ekspor dua fungsi yang bisa dipakai langsung di CharacterModal (import)
// dan CharacterProfile (export) tanpa render UI sendiri.

export function useCharacterExport(characters) {
  const handleExport = () => {
    const blob = new Blob([JSON.stringify(characters, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "characters_backup.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return { handleExport };
}

export function useCharacterImport(onImport) {
  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      onImport(parsed);
      // reset input so same file can be re-imported
      e.target.value = "";
    } catch (error) {
      alert("File invalid — pastikan format JSON benar.");
    }
  };

  return { handleImport };
}