/* ==========================================================================
   FeSCN.js — Reaction Pack: Fe³⁺ + SCN⁻ ⇌ FeSCN²⁺
   
   Ion association equilibrium in aqueous solution.
   Concentration-based perturbations.
   
   Molecule geometries:
   - Fe³⁺: single iron ion (octahedral in reality, shown as single atom)
   - SCN⁻: linear S-C≡N (thiocyanate)
   - FeSCN²⁺: Fe bonded to S of SCN⁻ (octahedral coordination implied)
   ========================================================================== */

const S = 0.40; // scale factor (Å → Three.js units)

export const FeSCN = {
  id:    'FeSCN',
  name:  'Kesetimbangan Ion Tiosianat Besi',
  equation: 'Fe³⁺ + SCN⁻ ⇌ FeSCN²⁺',
  deltaH:   'exoterm',
  accentColor: 0xe03030, // blood red (FeSCN²⁺ is intensely red)

  reactants: [
    {
      id:       'Fe3',
      label:    'Fe³⁺',
      glbPath:  null,
      atomDefs: [
        ['Fe', 0, 0, 0],
      ],
    },
    {
      id:       'SCN',
      label:    'SCN⁻',
      glbPath:  null,
      atomDefs: [
        // S-C≡N linear, bond lengths: S-C 1.62 Å, C-N 1.17 Å
        ['S',  -0.30, 0, 0],
        ['C',   0.00, 0, 0],
        ['N',   0.28, 0, 0],
      ],
    },
  ],

  products: [
    {
      id:       'FeSCN2',
      label:    'FeSCN²⁺',
      glbPath:  null,
      atomDefs: [
        // Fe bonded to S end of SCN
        ['Fe', -0.40, 0, 0],
        ['S',   0.00, 0, 0],
        ['C',   0.35, 0, 0],
        ['N',   0.60, 0, 0],
      ],
    },
  ],

  initialProductRatio: 0.45,

  experiments: [
    {
      id:     'fe_tambah',
      label:  '➕ Tambah Fe³⁺',
      effect: {
        targetRatioShift: +0.30, // Le Chatelier: more reactant → shift right
        speedMultiplier:   1.3,
      },
    },
    {
      id:     'scn_tambah',
      label:  '➕ Tambah SCN⁻',
      effect: {
        targetRatioShift: +0.28,
        speedMultiplier:   1.2,
      },
    },
    {
      id:     'encerkan',
      label:  '💧 Encerkan Larutan',
      effect: {
        targetRatioShift: -0.25, // dilution shifts toward dissociation
        boundaryScale:    1.35,
        speedMultiplier:   0.8,
      },
    },
  ],

  missions: {
    1: {
      hook: 'Larutan jernih dan merah ini menyimpan rahasia—ion-ion tidak diam!',
      observe_prompt:
        'Amati ion-ion yang bergerak di dalam larutan ini. ' +
        'Mana yang merupakan ion Fe³⁺ (besi) dan mana SCN⁻ (tiosianat)? ' +
        'Adakah yang sudah bergabung menjadi FeSCN²⁺ (merah tua)?',
      ai_questions: [
        'Mengapa sebagian ion sudah bergabung (FeSCN²⁺) dan sebagian belum?',
        'Apakah pergerakan ion berhenti saat sistem setimbang?',
        'Apa yang kamu perkirakan terjadi jika lebih banyak Fe³⁺ ditambahkan?',
      ],
    },
    2: {
      investigate_prompt:
        'Perhatikan—ada ion yang saling mendekat dan bergabung! ' +
        'Ketuk salah satu ion untuk mengamati proses asosiasi ion secara detail.',
      event_label: 'Ion Fe³⁺ bertemu SCN⁻ dan membentuk kompleks FeSCN²⁺ berwarna merah tua!',
      ai_after:
        'Kamu melihat asosiasi ion: Fe³⁺ + SCN⁻ → FeSCN²⁺. ' +
        'Secara bersamaan, FeSCN²⁺ juga mengurai kembali: FeSCN²⁺ → Fe³⁺ + SCN⁻. ' +
        'Keduanya terjadi pada saat yang sama—inilah kesetimbangan dinamis!',
    },
    3: {
      predict_prompt:
        'Kini kamu bisa mengganggu sistem! Pilih satu gangguan dan prediksi ' +
        'ke mana kesetimbangan akan bergeser sebelum melakukannya.',
      ai_compare:
        'Prediksimu: {prediction}. Aksimu: {actual}. Hasilnya {matched}. ' +
        'Ingat: menambah zat di satu sisi mendorong sistem bergeser ke sisi lain ' +
        'untuk "menghabiskan" kelebihan tersebut (Asas Le Chatelier).',
    },
    4: {
      reflect_questions: [
        {
          q: 'Ketika Fe³⁺ ditambahkan pada sistem Fe³⁺ + SCN⁻ ⇌ FeSCN²⁺, warna larutan menjadi lebih merah. Mengapa?',
          options: [
            {
              text:        'Kesetimbangan bergeser ke kanan, menghasilkan lebih banyak FeSCN²⁺ yang berwarna merah',
              correct:     true,
              explanation: 'Tepat! Penambahan Fe³⁺ meningkatkan konsentrasinya, mendorong reaksi ke kanan menghasilkan lebih banyak FeSCN²⁺—kompleks berwarna merah tua.',
            },
            {
              text:        'Fe³⁺ sendiri yang berwarna merah',
              correct:     false,
              explanation: 'Tidak tepat. Ion Fe³⁺ sendiri berwarna coklat kuning, bukan merah tua. Warna merah intens berasal dari kompleks FeSCN²⁺.',
            },
          ],
        },
        {
          q: 'Pada kesetimbangan Fe³⁺ + SCN⁻ ⇌ FeSCN²⁺, jika larutan diencerkan, apa yang terjadi?',
          options: [
            {
              text:        'Kesetimbangan bergeser ke kiri karena konsentrasi semua ion menurun',
              correct:     true,
              explanation: 'Benar! Pengenceran menurunkan konsentrasi semua spesies. Sistem merespons dengan mengurai FeSCN²⁺ kembali menjadi Fe³⁺ dan SCN⁻ untuk "melawan" penurunan konsentrasi.',
            },
            {
              text:        'Kesetimbangan tidak berubah karena perbandingan ion tetap sama',
              correct:     false,
              explanation: 'Tidak tepat. Pengenceran mengubah konsentrasi mutlak semua ion, sehingga Qc berubah dan kesetimbangan bergeser.',
            },
          ],
        },
      ],
    },
  },
};
