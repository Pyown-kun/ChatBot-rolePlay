export function cleanAiResponse(response) {
  if (!response) return "";

  let text = response;

  /**
   * Jika response array/object
   * contoh:
   * [{ type:"text", text:"halo" }]
   */
  try {
    if (typeof response === "string") {
      const parsed = JSON.parse(response);

      if (Array.isArray(parsed)) {
        text = parsed
          .map((item) => item.text || "")
          .join("\n");
      } else if (parsed.text) {
        text = parsed.text;
      }
    } else if (Array.isArray(response)) {
      text = response
        .map((item) => item.text || "")
        .join("\n");
    }
  } catch {
    text = response;
  }

  /**
   * Bersihkan markdown bold
   * **text** -> text
   */
  text = text.replace(/\*\*(.*?)\*\*/g, "$1");

  /**
   * Bersihkan italic markdown
   * *text* -> text
   */
  text = text.replace(/\*(.*?)\*/g, "$1");

  /**
   * Replace escaped newline
   */
  text = text.replace(/\\n/g, "\n");

  /**
   * Replace unicode spaces aneh
   */
  text = text
    .replace(/\u202f/g, " ")
    .replace(/\u00a0/g, " ");

  /**
   * Bersihkan escape quotes
   */
  text = text.replace(/\\"/g, '"');

  /**
   * Hilangkan whitespace berlebihan
   */
  text = text.trim();

  return text;
}