// src/services/api.js

export async function sendRoleplayMessage({
  config,
  character,
  messages,
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
Kamu sedang melakukan roleplay sebagai karakter berikut.

Nama: ${character.name}

Deskripsi:
${character.description}

Kepribadian:
${character.personality}

Scenario:
${character.scenario}

ATURAN:
- Tetap menjadi karakter.
- Jangan keluar dari karakter.
- Jawab sesuai personality.
- Gunakan gaya bicara karakter.
`;

    /**
     * Format messages
     */
    const formattedMessages =
      [
        {
          role: "system",
          content:
            systemPrompt,
        },

        ...messages.map(
          (msg) => ({
            role:
              msg.role ===
              "character"
                ? "assistant"
                : "user",

            content:
              msg.text,
          })
        ),
      ];

    /**
     * Default URL
     */
    const defaultUrls = {
      openai:
        "https://api.openai.com/v1",

      openrouter:
        "https://openrouter.ai/api/v1",
    };

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

    const endpoint =
      finalBaseUrl.endsWith(
        "/chat/completions"
      )
        ? finalBaseUrl
        : `${finalBaseUrl}/chat/completions`;

    console.log(
      "ENDPOINT:",
      endpoint
    );

    console.log(
      "REQUEST BODY:",
      {
        model,
        messages:
          formattedMessages,
      }
    );

    /**
     * Fetch API
     */
    const response =
      await fetch(endpoint, {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${apiKey}`,

          "HTTP-Referer":
            window.location
              .origin,

          "X-Title":
            "Roleplay Chat App",
        },

        body: JSON.stringify({
          model,
          messages:
            formattedMessages,
          temperature: 0.8,
        }),
      });

    /**
     * Handle Error
     */
    if (!response.ok) {
      const errorData =
        await response.json();

      console.error(
        "API ERROR:",
        errorData
      );

      throw new Error(
        errorData.error
          ?.message ||
          "Request gagal"
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

    return (
      data.choices?.[0]
        ?.message
        ?.content ||
      "..."
    );
  } catch (error) {
    console.error(
      "FULL ERROR:",
      error
    );

    throw error;
  }
}