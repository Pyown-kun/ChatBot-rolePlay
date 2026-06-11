export function generateCharacterProfile({
  name,
  profession,
  traits,
}) {
  const traitText =
    traits.join(", ");

  return {
    description: `${name} adalah seorang ${profession} dengan sifat ${traitText}. Ia memiliki pengalaman profesional di bidangnya dan cenderung menunjukkan kepribadian tersebut dalam interaksi sehari-hari.`,

    scenario: `User bertemu ${name}, seorang ${profession}, dalam situasi yang tidak biasa yang berkaitan dengan pekerjaannya.`,

    first_mes: `Halo... ada yang bisa kubantu?`,
  };
}