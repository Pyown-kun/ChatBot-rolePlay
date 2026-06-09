// src/services/api.js

export async function sendRoleplayMessage({
  config,
  character,
  messages,
  relevantKnowledge,
}) {
  try {
    const { apiKey, baseUrl, model, provider } = config;

    if (!apiKey) {
      throw new Error("API Key belum diisi.");
    }

    /**
     * System Prompt
     */
const systemPrompt = `
IDENTITAS KARAKTER

Nama:
${character.name}

Profesi utama:
${character.profession}

Sifat:
${character.traits?.join(", ")}

Kepribadian:
${character.personality}

Deskripsi:
${character.description}

Scenario:
${character.scenario}

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
- boleh panjang

4. Jika pertanyaan TIDAK BERHUBUNGAN dengan profesimu:
- jangan menjawab seperti ahli
- jangan memberi penjelasan panjang
- jawab pendek (1 sampai 3 kalimat)
- gunakan pengetahuan umum saja
- akui bahwa itu bukan bidangmu
- jangan terlalu teknis
- jangan membuat list panjang
- jangan over-explain

Contoh gaya jawaban:
"Aku kurang paham soal itu"
"Setahuku sih begitu, tapi aku bukan ahlinya."
"Hmm, itu bukan bidangku, mungkin barista atau profesi lain lebih ngerti."

5. Jika kamu tidak yakin:
lebih baik bilang tidak tahu daripada mengarang panjang.

6. Tetap menjadi karakter, jangan berubah jadi AI assistant.

IMPORTANT RULES:
- Speak naturally like a human.
- Do NOT over-explain unless user asks.
- Stay consistent with your profession.
- If question is outside your expertise, answer casually and admit limitations.
- Avoid excessive bullet points.
- Avoid overly technical explanations unless specifically requested.
- Never use markdown formatting like **bold**.
- Never output JSON.
- Never output arrays or objects.
- Use plain readable chat text.
`;

    /**
     * Format messages
     */
    const formattedMessages = [
      {
        role: "system",
        content: systemPrompt,
      },

      ...messages.map((msg) => ({
        role: msg.role === "character" ? "assistant" : "user",

        content: msg.text,
      })),
    ];

    /**
     * Default URL
     */
    const defaultUrls = {
      openai: "https://api.openai.com/v1",

      openrouter: "https://openrouter.ai/api/v1",
    };

    let finalBaseUrl = baseUrl || defaultUrls[provider];

    finalBaseUrl = finalBaseUrl.replace(/\/$/, "");

    const endpoint = finalBaseUrl.endsWith("/chat/completions")
      ? finalBaseUrl
      : `${finalBaseUrl}/chat/completions`;

    console.log("ENDPOINT:", endpoint);

    console.log("REQUEST BODY:", {
      model,
      messages: formattedMessages,
    });

    /**
     * Fetch API
     */
    const response = await fetch(endpoint, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",

        Authorization: `Bearer ${apiKey}`,

        "HTTP-Referer": window.location.origin,

        "X-Title": "Roleplay Chat App",
      },

      body: JSON.stringify({
        model,
        messages: formattedMessages,
        temperature: 0.8,
      }),
    });

    /**
     * Handle Error
     */
    if (!response.ok) {
      const errorData = await response.json();

      console.error("API ERROR:", errorData);

      throw new Error(errorData.error?.message || "Request gagal");
    }

    /**
     * Success
     */
    const data = await response.json();

    console.log("SUCCESS:", data);

    return data.choices?.[0]?.message?.content || "...";
  } catch (error) {
    console.error("FULL ERROR:", error);

    throw error;
  }
}
