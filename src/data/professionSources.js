const professionSources = {
  Barista: {
    description: "Profesional kopi...",

    chunks: [
      {
        keywords: ["kopi", "coffee", "espresso", "shot", "beans"],

        content: `
Espresso extraction dipengaruhi
oleh grind size, water temperature,
dose dan extraction time.

Sour espresso biasanya terjadi
karena under extraction.
Bitter espresso biasanya
karena over extraction.
`,
      },

      {
        keywords: ["latte", "milk", "susu", "foam"],

        content: `
Milk steaming membutuhkan suhu
sekitar 55–65°C.

Foam terlalu besar biasanya
karena aerasi berlebihan.
Latte art memerlukan microfoam.
`,
      },

      {
        keywords: ["grinder", "mesin", "machine", "calibration"],

        content: `
Kalibrasi grinder penting
untuk konsistensi espresso.

Grind terlalu kasar
menyebabkan sour taste.
Grind terlalu halus
menyebabkan bitterness.
`,
      },
    ],
  },

  Programmer: {
    chunks: [
      {
        keywords: ["react", "component", "jsx", "state"],

        content: `
React menggunakan component
berbasis state dan props.

Gunakan useState
untuk state lokal
dan useEffect
untuk side effect.
`,
      },

      {
        keywords: ["api", "fetch", "backend"],

        content: `
REST API biasa menggunakan
HTTP methods:
GET POST PUT DELETE.

Gunakan fetch atau axios
untuk komunikasi client-server.
`,
      },

      {
        keywords: ["bug", "error", "debug"],

        content: `
Debugging dilakukan
melalui console.log,
browser devtools,
stack trace,
dan error boundary.
`,
      },
    ],
  },

  Doctor: {
    description:
      "Tenaga medis profesional yang mendiagnosis penyakit, memberikan perawatan, dan memahami terminologi medis.",

    workplace: ["Hospital", "Clinic", "Emergency Room"],

    tools: [
      "Stethoscope",
      "Blood Pressure Monitor",
      "Thermometer",
      "Medical Chart",
    ],

    workflow: [
      "Patient examination",
      "Diagnosis",
      "Medical assessment",
      "Treatment planning",
      "Prescription",
    ],

    jargon: [
      "Diagnosis",
      "Prognosis",
      "Triage",
      "Symptoms",
      "Clinical Findings",
    ],

    commonProblems: [
      "Misdiagnosis risk",
      "Emergency handling",
      "Patient monitoring",
    ],

    expertise: `
Memahami pemeriksaan pasien,
diagnosis awal, gejala penyakit,
komunikasi medis profesional,
dan terminologi klinis dasar.
`,
  },

  Chef: {
    description:
      "Profesional kuliner yang memahami teknik memasak, plating, manajemen dapur dan food preparation.",

    workplace: ["Restaurant", "Hotel Kitchen", "Fine Dining"],

    tools: ["Chef Knife", "Pan", "Oven", "Food Thermometer"],

    workflow: [
      "Ingredient preparation",
      "Cooking",
      "Seasoning",
      "Plating",
      "Kitchen cleaning",
    ],

    jargon: ["Mise en place", "Plating", "Blanching", "Saute", "Deglaze"],

    commonProblems: [
      "Overcooked food",
      "Undercooked meat",
      "Seasoning imbalance",
    ],

    expertise: `
Memahami teknik memasak,
food preparation, plating,
ingredient pairing,
temperature control,
dan kitchen workflow.
`,
  },

  Teacher: {
    description:
      "Profesional pendidikan yang mengajar, mengevaluasi siswa dan membangun lingkungan belajar.",

    workplace: ["School", "University", "Online Classroom"],

    tools: ["Whiteboard", "Presentation Slide", "Assessment Sheet"],

    workflow: ["Lesson planning", "Teaching", "Student evaluation", "Feedback"],

    jargon: ["Curriculum", "Assessment", "Learning Objective", "Pedagogy"],

    commonProblems: [
      "Student engagement",
      "Learning difficulty",
      "Classroom management",
    ],

    expertise: `
Memahami pedagogi,
kurikulum, evaluasi siswa,
metode pengajaran,
dan komunikasi edukatif.
`,
  },

  Mechanic: {
    description:
      "Profesional teknisi kendaraan yang memahami mesin, kelistrikan, troubleshooting, dan maintenance.",

    workplace: ["Garage", "Workshop", "Automotive Service Center"],

    tools: ["Wrench", "OBD Scanner", "Hydraulic Jack", "Torque Wrench"],

    workflow: ["Inspection", "Diagnosis", "Repair", "Testing", "Maintenance"],

    jargon: ["Torque", "Alignment", "Engine Misfire", "Oil Change"],

    commonProblems: ["Engine overheating", "Battery issue", "Brake failure"],

    expertise: `
Memahami mesin kendaraan,
maintenance, troubleshooting,
kelistrikan mobil,
diagnostic tools,
dan repair process.
`,
  },
};

export default professionSources;
