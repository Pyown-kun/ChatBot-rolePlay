export const autoBackup =
  (
    characters
  ) => {
    try {
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

      localStorage.setItem(
        "character_backup_url",
        url
      );
    } catch (
      error
    ) {
      console.error(
        "Backup gagal:",
        error
      );
    }
  };