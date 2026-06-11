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
    if (
      !response.ok
    ) {
      let errorMessage =
        "Request gagal";

      try {
        const errorData =
          await response.json();

        console.error(
          "API ERROR:",
          errorData
        );

        errorMessage =
          errorData.error
            ?.message ||
          errorData.message ||
          errorMessage;
      } catch {}

      /**
       * Better Rate Limit Message
       */
      if (
        response.status ===
        429
      ) {
        throw new Error(
          "Kuota AI habis / rate limit tercapai."
        );
      }

      throw new Error(
        errorMessage
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
}
