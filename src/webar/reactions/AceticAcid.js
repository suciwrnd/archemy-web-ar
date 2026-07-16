/* ==========================================================================
   AceticAcid.js — Reaction Pack: CH₃COOH ⇌ H⁺ + CH₃COO⁻
   
   Weak acid dissociation equilibrium.
   Concentration/dilution perturbations. Ka = 1.8×10⁻⁵
   
   Molecule geometries:
   - CH₃COOH: Acetic acid — methyl group + carboxyl group
   - H⁺: proton (tiny sphere)
   - CH₃COO⁻: Acetate ion (acetic acid minus one H)
   ========================================================================== */

const S = 0.38;

export const AceticAcid = {
  id:    'AceticAcid',
  name:  'Kesetimbangan Asam Asetat',
  equation: 'CH₃COOH ⇌ H⁺ + CH₃COO⁻',
  deltaH:   'none',
  accentColor: 0x4fc3f7, // cyan (aqueous)

  reactants: [
    {
      id:       'CH3COOH',
      label:    'CH₃COOH',
      glbPath:  null,
      atomDefs: [
        // Methyl carbon
        ['C',  -0.55,  0.00,  0.00],
        // Methyl H's (simplified, tetrahedral ~109.5°)
        ['H',  -0.80,  0.25,  0.15],
        ['H',  -0.80, -0.25,  0.00],
        ['H',  -0.80,  0.00, -0.25],
        // Carbonyl carbon
        ['C',  -0.05,  0.00,  0.00],
        // Carbonyl oxygen (C=O)
        ['O',   0.15,  0.30,  0.00],
        // Hydroxyl oxygen
        ['O',   0.25, -0.25,  0.00],
        // Hydroxyl H
        ['H',   0.48, -0.25,  0.00],
      ],
    },
  ],

  products: [
    {
      id:       'H_ion',
      label:    'H⁺',
      glbPath:  null,
      atomDefs: [
        ['H', 0, 0, 0],
      ],
    },
    {
      id:       'CH3COO',
      label:    'CH₃COO⁻',
      glbPath:  null,
      atomDefs: [
        // Same as CH₃COOH minus the hydroxyl H
        ['C',  -0.55,  0.00,  0.00],
        ['H',  -0.80,  0.25,  0.15],
        ['H',  -0.80, -0.25,  0.00],
        ['H',  -0.80,  0.00, -0.25],
        ['C',  -0.05,  0.00,  0.00],
        ['O',   0.20,  0.28,  0.00],
        ['O',   0.20, -0.28,  0.00], // negative charge delocalized (two equal O)
      ],
    },
  ],

  initialProductRatio: 0.08, // weak acid — mostly undissociated

  experiments: [
    {
      id:     'encerkan',
      label:  '💧 Encerkan (Tambah Air)',
      effect: {
        targetRatioShift: +0.15, // dilution increases degree of dissociation
        boundaryScale:    1.35,
        speedMultiplier:   0.9,
      },
    },
    {
      id:     'tambah_asam',
      label:  '🧪 Tambah CH₃COOH',
      effect: {
        targetRatioShift: +0.08,
        speedMultiplier:   1.2,
      },
    },
    {
      id:     'tambah_hcl',
      label:  '🔬 Tambah HCl (H⁺)',
      effect: {
        targetRatioShift: -0.04, // common ion effect: shifts left
        speedMultiplier:   1.1,
      },
    },
  ],

  missions: {
    1: {
      hook: 'Asam asetat dalam air—apakah semua molekulnya mengion, atau hanya sebagian?',
      observe_prompt:
        'Amati sistem ini. Identifikasi molekul CH₃COOH (asam) dan ion-ion H⁺ serta CH₃COO⁻ ' +
        'yang ada dalam larutan. Mengapa ada lebih banyak CH₃COOH daripada ion?',
      ai_questions: [
        'Berapa persen kira-kira CH₃COOH yang sudah terionisasi?',
        'Apa perbedaan antara asam kuat (HCl) dan asam lemah (CH₃COOH)?',
        'Apakah ion-ion yang terbentuk bisa bergabung kembali menjadi CH₃COOH?',
      ],
    },
    2: {
      investigate_prompt:
        'Ada proses ionisasi yang terjadi setiap saat. ' +
        'Ketuk molekul CH₃COOH untuk menyaksikan proses disosiasi secara langsung.',
      event_label: 'CH₃COOH melepaskan proton H⁺ dan berubah menjadi ion asetat CH₃COO⁻!',
      ai_after:
        'Kamu menyaksikan disosiasi: CH₃COOH → H⁺ + CH₃COO⁻. ' +
        'Bersamaan dengan itu, ion-ion yang ada juga bergabung kembali: H⁺ + CH₃COO⁻ → CH₃COOH. ' +
        'Inilah mengapa ini disebut asam LEMAH—tidak semua molekul terionisasi sekaligus.',
    },
    3: {
      predict_prompt:
        'Kamu bisa mengubah kondisi sistem ini. Pilih gangguan yang ingin kamu berikan ' +
        'dan prediksi ke mana kesetimbangan akan bergeser.',
      ai_compare:
        'Prediksimu: {prediction}. Aksimu: {actual}. Hasilnya {matched}. ' +
        'Efek ion senama (common ion effect) dan pengenceran adalah dua cara berbeda ' +
        'untuk mengubah derajat ionisasi asam lemah.',
    },
    4: {
      reflect_questions: [
        {
          q: 'Mengapa CH₃COOH disebut asam LEMAH, bukan asam kuat?',
          options: [
            {
              text:        'Karena hanya sebagian kecil molekulnya yang terionisasi dalam kesetimbangan',
              correct:     true,
              explanation: 'Benar! Ka CH₃COOH hanya 1,8×10⁻⁵, artinya pada kesetimbangan, hampir semua CH₃COOH tetap sebagai molekul utuh. Hanya ~1,3% yang terionisasi pada konsentrasi 0,1 M.',
            },
            {
              text:        'Karena pH-nya lebih besar dari 7',
              correct:     false,
              explanation: 'Tidak tepat. pH asam selalu < 7. CH₃COOH disebut lemah karena derajat ionisasinya kecil, bukan karena pH-nya.',
            },
          ],
        },
        {
          q: 'Jika larutan CH₃COOH diencerkan dengan air, derajat ionisasi (α) akan...',
          options: [
            {
              text:        'Meningkat — pengenceran menggeser kesetimbangan ke kanan (lebih banyak ion)',
              correct:     true,
              explanation: 'Tepat! Pengenceran menurunkan [H⁺] dan [CH₃COO⁻], sehingga Qc < Ka. Sistem merespons dengan menggeser kesetimbangan ke kanan untuk membentuk lebih banyak ion.',
            },
            {
              text:        'Menurun — karena konsentrasi asam berkurang',
              correct:     false,
              explanation: 'Tidak tepat. Meski konsentrasi absolut berkurang, derajat ionisasi (α = jumlah terionisasi ÷ awal) justru meningkat saat diencerkan.',
            },
          ],
        },
      ],
    },
  },
};
