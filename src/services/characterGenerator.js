export async function generateCharacter({
  config,
  profession,
  traits,
  name,
}) {
  const endpoint =
    `${config.baseUrl}/chat/completions`;

  const prompt = `
Buat karakter roleplay dalam BAHASA INDONESIA.

Nama Karakter:
${name || "Karakter"}

Profesi:
${profession || "Umum"}

Sifat:
${traits?.join(", ") || "Natural"}

Tugas:
Buat karakter yang terasa hidup,
natural, dan sesuai profesi serta sifatnya.

WAJIB BALAS HANYA JSON VALID.

Format:

{
  "description": "",
  "first_mes": "",
  "scenario": ""
}

Aturan:
- Gunakan bahasa Indonesia.
- description maksimal 80 kata.
- scenario maksimal 80 kata.
- first_mes natural seperti manusia.
- Sesuaikan profesi dengan sifat.
- Jangan terlalu formal.
- Jangan terlalu panjang.
- Jangan gunakan markdown.
- Jangan gunakan bahasa Inggris.
- Jangan tambahkan teks selain JSON.
`;

  try {
    const response =
      await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          model: config.model,
          messages: [
            {
              role: "system",
              content:
                "Kamu hanya boleh membalas JSON valid tanpa markdown.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      });

    const data =
  await response.json();

console.log(
  "FULL GENERATE RESPONSE:",
  data
);

console.log(
  "CHOICES:",
  data?.choices
);

console.log(
  "MESSAGE:",
  data?.choices?.[0]
    ?.message
);

    console.log(
      "GENERATE RESPONSE:",
      data
    );

    let text =
  data?.choices?.[0]
    ?.message?.content;

/**
 * Fallback OpenRouter
 */
if (!text) {
  text =
    data?.choices?.[0]
      ?.text;
}

/**
 * Kadang array content
 */
if (
  Array.isArray(text)
) {
  text =
    text
      .map(
        (item) =>
          item.text ||
          item.content ||
          ""
      )
      .join("");
}

/**
 * Kadang reasoning model
 */
if (!text) {
  text =
    data?.choices?.[0]
      ?.message
      ?.reasoning;
}

console.log(
  "RAW TEXT:",
  text
);

if (!text) {
  throw new Error(
    JSON.stringify(data)
  );
}

    // Bersihkan markdown JSON
    const cleanedText =
      text
        .replace(
          /```json/g,
          ""
        )
        .replace(
          /```/g,
          ""
        )
        .trim();

    // Ambil JSON object pertama
    const match =
      cleanedText.match(
        /\{[\s\S]*\}/
      );

    if (!match) {
      throw new Error(
        "Format AI bukan JSON valid."
      );
    }

    const parsed =
      JSON.parse(
        match[0]
      );

    return {
      description:
        parsed.description ||
        "",
      first_mes:
        parsed.first_mes ||
        "",
      scenario:
        parsed.scenario ||
        "",
    };
  } catch (error) {
    console.error(
      "Generate Character Error:",
      error
    );

    // fallback supaya modal tidak crash
    return {
      description: `${name} adalah seorang ${profession} dengan sifat ${traits?.join(", ")}.`,
      first_mes:
        "Hai, senang bertemu denganmu.",
      scenario:
        "Kalian baru saja bertemu dan mulai berbicara.",
    };
  }
}