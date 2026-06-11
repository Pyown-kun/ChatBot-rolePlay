import React from "react";

function CharacterImportExport({
  characters,
  onImport,
}) {
  const handleExport =
    () => {
      const blob =
        new Blob(
          [
            JSON.stringify(
              characters,
              null,
              2
            ),
          ],
          {
            type: "application/json",
          }
        );

      const url =
        URL.createObjectURL(
          blob
        );

      const a =
        document.createElement(
          "a"
        );

      a.href = url;

      a.download =
        "characters_backup.json";

      a.click();

      URL.revokeObjectURL(
        url
      );
    };

  const handleImport =
    async (e) => {
      const file =
        e.target.files[0];

      if (!file)
        return;

      try {
        const text =
          await file.text();

        const parsed =
          JSON.parse(text);

        onImport(parsed);
      } catch (
        error
      ) {
        alert(
          "File invalid"
        );
      }
    };

  return (
    <div className="flex gap-2">
      <button
        onClick={
          handleExport
        }
        className="rounded-xl bg-slate-700 px-4 py-2 text-white"
      >
        Export
      </button>

      <label className="cursor-pointer rounded-xl bg-indigo-600 px-4 py-2 text-white">
        Import

        <input
          type="file"
          accept=".json"
          hidden
          onChange={
            handleImport
          }
        />
      </label>
    </div>
  );
}

export default CharacterImportExport;