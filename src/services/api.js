// src/services/api.js

// src/services/api.js

export async function sendRoleplayMessage({
  config,
  character,
  messages,
  relevantKnowledge,
}) {
  try {
    const {
      apiKey,
      baseUrl,
      model,
      provider,
    } = config;

    if (!apiKey) {
      throw new Error(
        "API Key belum diisi."
      );
    }

    /**
     * System Prompt
     */
    const systemPrompt = `
IDENTITAS KARAKTER

Nama:
${character.name}

Profesi utama:
${character.profession || "Tidak diketahui"}

Sifat:
${character.traits?.join(", ") || "-"}

Kepribadian:
${character.personality || "-"}

Deskripsi:
${character.description || "-"}

Scenario:
${character.scenario || "-"}

${
  relevantKnowledge
    ? `
PENGETAHUAN PROFESIONAL:
${relevantKnowledge}
`
    : ""
}

ATURAN WAJIB:

1. Kamu adalah karakter roleplay, bukan AI assistant.

2. Profesi utamamu adalah:
${character.profession}

3. Jika pertanyaan BERHUBUNGAN dengan profesimu:
- jawab detail
- teknis
- profesional
- percaya diri
- natural
- boleh panjang

4. Jika pertanyaan TIDAK BERHUBUNGAN dengan profesimu:
- jangan menjawab seperti ahli
- jawab singkat
- maksimal 1–3 kalimat
- gunakan pengetahuan umum
- akui bahwa itu bukan bidangmu

Contoh:
"Hmm aku kurang ngerti soal itu."
"Setahuku sih begitu, tapi itu bukan bidangku."

5. Jika tidak yakin:
lebih baik bilang tidak tahu.

6. Tetap menjadi karakter.

IMPORTANT:
- Gunakan bahasa Indonesia.
- Jangan markdown.
- Jangan bullet berlebihan.
- Jangan JSON.
- Jangan format aneh.
- Gunakan chat natural seperti manusia.
`;
if (character.system) {
  const systemPrompt = `
Kamu adalah helper untuk web Roleplay Chat.

ATURAN:
- hanya membahas web ini
- jangan keluar topik
- jangan menjadi assistant umum
- jangan membahas politik, coding random, kesehatan, dll
- fokus pada setup dan penggunaan aplikasi

Jika user keluar konteks:
"Aku hanya membantu seputar penggunaan web roleplay ini."
`;}

    /**
     * Message Format
     */
    const formattedMessages = [
      {
        role: "system",
        content: systemPrompt,
      },

      ...messages.map((msg) => ({
        role:
          msg.role ===
          "character"
            ? "assistant"
            : "user",

        content: msg.text,
      })),
    ];

    /**
     * Default URLs
     */
    const defaultUrls = {
      openai:
        "https://api.openai.com/v1",

      openrouter:
        "https://openrouter.ai/api/v1",

      gemini:
        "https://generativelanguage.googleapis.com/v1beta/openai",

      groq:
        "https://api.groq.com/openai/v1",

      together:
        "https://api.together.xyz/v1",

      fireworks:
        "https://api.fireworks.ai/inference/v1",
    };

    /**
     * Final Base URL
     */
    let finalBaseUrl =
  baseUrl ||
  defaultUrls[
    provider
  ];

/**
 * Auto fix protocol
 */
if (
  finalBaseUrl &&
  !finalBaseUrl.startsWith(
    "http"
  )
) {
  finalBaseUrl =
    `https://${finalBaseUrl}`;
}

finalBaseUrl =
  finalBaseUrl.replace(
    /\/$/,
    ""
  );

    /**
     * Endpoint
     */
    const endpoint =
      finalBaseUrl.endsWith(
        "/chat/completions"
      )
        ? finalBaseUrl
        : `${finalBaseUrl}/chat/completions`;

    /**
     * Headers
     */
    const headers = {
      "Content-Type":
        "application/json",
    };

    /**
     * Provider Specific Auth
     */
    if (
      provider ===
      "gemini"
    ) {
      headers.Authorization = `Bearer ${apiKey}`;
    } else {
      headers.Authorization = `Bearer ${apiKey}`;
    }

    /**
     * OpenRouter only headers
     */
    if (
      provider ===
      "openrouter"
    ) {
      headers[
        "HTTP-Referer"
      ] =
        window.location
          .origin;

      headers[
        "X-Title"
      ] =
        "Roleplay Chat App";
    }

    /**
     * Request Body
     */
    const requestBody = {
      model,
      messages:
        formattedMessages,
      temperature: 0.8,
    };

    console.log(
      "ENDPOINT:",
      endpoint
    );

    console.log(
      "PROVIDER:",
      provider
    );

    console.log(
      "REQUEST BODY:",
      requestBody
    );

    /**
     * Fetch
     */
    const response =
      await fetch(
        endpoint,
        {
          method:
            "POST",

          headers,

          body:
            JSON.stringify(
              requestBody
            ),
        }
      );

    /**
     * Error Handler
     */
   if (!response.ok) {
  const errorText =
    await response.text();

  console.error(
    "FULL API ERROR:",
    errorText
  );

  if (
    errorText.includes("429") ||
    errorText.includes("RESOURCE_EXHAUSTED") ||
    errorText.includes("quota")
  ) {
    return `
⚠️ Provider AI sedang mencapai limit quota.

Coba:
• tunggu beberapa menit
• ganti model Gemini
• gunakan OpenRouter free model

`;
  }

  const errorMessage =
  typeof errorText === "string"
    ? errorText
    : JSON.stringify(errorText);

//
// User-friendly error handler
//
if (errorMessage.includes("quota")) {
  throw new Error(
    "API sedang mencapai batas penggunaan. Coba lagi beberapa saat atau gunakan provider/model lain."
  );
}

if (
  errorMessage.includes("RESOURCE_EXHAUSTED") ||
  errorMessage.includes("429")
) {
  throw new Error(
    "Terlalu banyak request ke AI. Tunggu beberapa detik lalu coba lagi."
  );
}

if (
  errorMessage.includes("No endpoints found")
) {
  throw new Error(
    "Model AI tidak tersedia atau sudah tidak didukung. Silakan pilih model lain."
  );
}

if (
  errorMessage.includes(
    "unexpected model name format"
  )
) {
  throw new Error(
    "Nama model tidak valid. Pastikan model yang dipilih benar."
  );
}

if (
  errorMessage.includes(
    "unavailable for free"
  )
) {
  throw new Error(
    "Model ini tidak tersedia gratis. Pilih model free lainnya."
  );
}

if (
  errorMessage.includes(
    "Provider returned error"
  )
) {
  throw new Error(
    "Provider AI sedang bermasalah. Coba model lain atau ulangi beberapa saat lagi."
  );
}

if (
  errorMessage.includes("401") ||
  errorMessage.includes("Unauthorized")
) {
  throw new Error(
    "API Key tidak valid atau belum diisi."
  );
}

if (
  errorMessage.includes("404")
) {
  throw new Error(
    "Endpoint atau model tidak ditemukan."
  );
}

throw new Error(
  "Terjadi kesalahan saat menghubungi AI. Coba lagi."
);
}

    /**
     * Success
     */
    const data =
      await response.json();

    console.log(
      "SUCCESS:",
      data
    );

    /**
     * OpenAI-compatible parser
     */
    const text =
      data.choices?.[0]
        ?.message
        ?.content;

    if (!text) {
      throw new Error(
        "AI tidak mengembalikan jawaban."
      );
    }

    return text;
  } catch (error) {
    console.error(
      "FULL ERROR:",
      error
    );

    throw error;
  }

  if (
  errorMessage.includes("quota") ||
  errorMessage.includes("429")
) {
  throw new Error(
    "Quota Gemini habis atau belum aktif. Coba tunggu beberapa menit, ganti model, atau gunakan OpenRouter."
  );
}
console.log("PROVIDER:", provider);
console.log("MODEL:", model);
console.log("BASE URL:", finalBaseUrl);
console.log("ENDPOINT:", endpoint);
}
