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
${name}

Profesi:
${profession}

Sifat:
${traits.join(", ")}

Tugas:
Buat karakter yang terasa hidup, natural,
dan sesuai profesi serta sifatnya.

Balas HANYA dalam format JSON valid.

Format wajib:

{
  "description": "",
  "first_mes": "",
  "scenario": ""
}

Aturan:
- SELALU gunakan bahasa Indonesia.
- description maksimal 80 kata.
- scenario maksimal 80 kata.
- first_mes natural seperti manusia.
- Sesuaikan profesi dengan sifat.
- Jangan terlalu formal.
- Jangan terlalu panjang.
- Jangan gunakan markdown.
- Jangan gunakan bahasa Inggris.
- Jangan tambahkan penjelasan di luar JSON.
`;

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
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

  const data =
    await response.json();

  const text =
    data.choices?.[0]
      ?.message?.content;

  return JSON.parse(text);
}