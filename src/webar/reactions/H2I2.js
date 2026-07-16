/* ==========================================================================
   H2I2.js — Reaction Pack: H₂ + I₂ ⇌ 2HI  (migrated from original MISI_DATA)
   
   Gas-phase equilibrium. Endothermic.
   ========================================================================== */

const S = 0.40;

export const H2I2 = {
  id:    'H2I2',
  name:  'Kesetimbangan Gas Hidrogen Iodida',
  equation: 'H₂(g) + I₂(g) ⇌ 2HI(g)',
  deltaH:   'endoterm',
  accentColor: 0x8a2be2, // purple (iodine color)

  reactants: [
    {
      id:       'H2',
      label:    'H₂',
      glbPath:  null,
      atomDefs: [
        ['H', -0.15, 0, 0],
        ['H',  0.15, 0, 0],
      ],
    },
    {
      id:       'I2',
      label:    'I₂',
      glbPath:  null,
      atomDefs: [
        ['I', -0.40, 0, 0],
        ['I',  0.40, 0, 0],
      ],
    },
  ],

  products: [
    {
      id:       'HI',
      label:    'HI',
      glbPath:  null,
      atomDefs: [
        ['H', -0.25, 0, 0],
        ['I',  0.25, 0, 0],
      ],
    },
  ],

  initialProductRatio: 0.40,

  experiments: [
    {
      id:     'suhu_naik',
      label:  'Naikkan Suhu',
      effect: {
        targetRatioShift: +0.25, // endothermic → heating shifts right (more HI)
        speedMultiplier:   2.2,
      },
    },
    {
      id:     'suhu_turun',
      label:  'Turunkan Suhu',
      effect: {
        targetRatioShift: -0.25,
        speedMultiplier:   0.45,
      },
    },
    {
      id:     'tekanan_naik',
      label:  'Naikkan Tekanan',
      effect: {
        // 2 mol both sides — pressure has NO effect on this reaction
        targetRatioShift: 0,
        boundaryScale:    0.75,
        speedMultiplier:   1.5,
      },
    },
  ],

  missions: {
    1: {
      hook: 'Gurumu mengatakan reaksi sudah setimbang. Tapi... apakah reaksi benar-benar berhenti?',
      observe_prompt:
        'Amati sistem tertutup yang berisi gas H₂, I₂, dan HI. ' +
        'Identifikasi ketiga jenis molekul. Perhatikan perbedaan ukuran dan pola/warna antar molekul.',
      ai_questions: [
        'Berapa perbandingan HI dengan H₂ dan I₂ yang kamu lihat?',
        'Apakah molekul-molekul ini bergerak atau diam?',
        'Apa yang kamu perkirakan terjadi saat H₂ bertabrakan dengan I₂?',
      ],
    },
    2: {
      investigate_prompt:
        'Perhatikan tumbukan antar molekul. Tidak semua tumbukan menghasilkan produk! ' +
        'Ketuk sebuah molekul H₂ untuk mengikuti perjalanannya.',
      event_label: 'H₂ dan I₂ bertumbukan dengan energi efektif—ikatan baru terbentuk menjadi HI!',
      ai_after:
        'Kamu menyaksikan tumbukan efektif: H₂ + I₂ → 2HI. ' +
        'Ingat: hanya tumbukan dengan energi ≥ Ea (energi aktivasi) yang berhasil membentuk produk. ' +
        'Sementara itu, HI juga terus terurai kembali: 2HI → H₂ + I₂.',
    },
    3: {
      predict_prompt:
        'Reaksi ini bersifat endoterm (menyerap panas). ' +
        'Prediksi: gangguan mana yang akan meningkatkan jumlah HI paling banyak?',
      ai_compare:
        'Prediksimu: {prediction}. Aksimu: {actual}. Hasilnya {matched}. ' +
        'Perhatian: tekanan tidak mempengaruhi reaksi ini karena jumlah mol gas di kiri dan kanan sama (2 mol = 2 mol)!',
    },
    4: {
      reflect_questions: [
        {
          q: 'Pada keadaan setimbang H₂ + I₂ ⇌ 2HI, apakah reaksi benar-benar berhenti?',
          options: [
            {
              text:        'Ya, karena konsentrasi tidak berubah maka reaksi sudah berhenti',
              correct:     false,
              explanation: 'Tidak tepat. Konsentrasi tampak tetap BUKAN karena reaksi berhenti, melainkan karena laju reaksi maju (H₂+I₂→2HI) sama dengan laju reaksi balik (2HI→H₂+I₂).',
            },
            {
              text:        'Tidak, reaksi maju dan balik terus berlangsung secara bersamaan',
              correct:     true,
              explanation: 'Tepat! Inilah inti kesetimbangan dinamis (dynamic equilibrium). Secara mikroskopis, molekul terus bereaksi—tetapi karena kedua laju setara, komposisi makroskopis tetap.',
            },
          ],
        },
        {
          q: 'Untuk reaksi endoterm H₂ + I₂ ⇌ 2HI, menaikkan tekanan akan...',
          options: [
            {
              text:        'Tidak mempengaruhi kesetimbangan (jumlah mol gas sama di kedua sisi)',
              correct:     true,
              explanation: 'Tepat! Tekanan mempengaruhi kesetimbangan hanya jika jumlah mol gas di kedua sisi berbeda. Reaksi ini: 2 mol gas (kiri) = 2 mol gas (kanan), sehingga tekanan tidak berpengaruh.',
            },
            {
              text:        'Menggeser kesetimbangan ke kanan menghasilkan lebih banyak HI',
              correct:     false,
              explanation: 'Tidak tepat. Karena jumlah mol gas sama di kedua sisi (2=2), perubahan tekanan tidak menggeser kesetimbangan reaksi ini.',
            },
          ],
        },
      ],
    },
  },
};
