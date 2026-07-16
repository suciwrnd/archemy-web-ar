/* ==========================================================================
   AgCl.js — Reaction Pack: AgCl ⇌ Ag⁺ + Cl⁻
   
   Solubility equilibrium (heterogeneous).
   Ksp = 1.8×10⁻¹⁰ — very insoluble salt.
   
   Molecule geometries:
   - AgCl: ionic solid (shown as Ag-Cl pair — ionic bond)
   - Ag⁺: silver cation
   - Cl⁻: chloride anion
   ========================================================================== */

export const AgCl = {
  id:    'AgCl',
  name:  'Kesetimbangan Kelarutan AgCl',
  equation: 'AgCl(s) ⇌ Ag⁺(aq) + Cl⁻(aq)',
  deltaH:   'endoterm',
  accentColor: 0xc0c0d8, // silver-white

  reactants: [
    {
      id:       'AgCl_solid',
      label:    'AgCl(s)',
      glbPath:  null,
      atomDefs: [
        // Ionic pair — Ag and Cl close together
        ['Ag', -0.22, 0, 0],
        ['Cl',  0.22, 0, 0],
      ],
    },
  ],

  products: [
    {
      id:       'Ag_ion',
      label:    'Ag⁺',
      glbPath:  null,
      atomDefs: [
        ['Ag', 0, 0, 0],
      ],
    },
    {
      id:       'Cl_ion',
      label:    'Cl⁻',
      glbPath:  null,
      atomDefs: [
        ['Cl', 0, 0, 0],
      ],
    },
  ],

  initialProductRatio: 0.05, // barely soluble

  experiments: [
    {
      id:     'tambah_nacl',
      label:  '🧂 Tambah NaCl (ion Cl⁻)',
      effect: {
        targetRatioShift: -0.04, // common ion effect: Ag⁺ + Cl⁻ → AgCl precipitates more
        speedMultiplier:   1.1,
      },
    },
    {
      id:     'tambah_agno3',
      label:  '🔬 Tambah AgNO₃ (ion Ag⁺)',
      effect: {
        targetRatioShift: -0.04,
        speedMultiplier:   1.1,
      },
    },
    {
      id:     'suhu_naik',
      label:  '🔥 Naikkan Suhu',
      effect: {
        targetRatioShift: +0.08, // slightly more dissolves at higher T (endothermic)
        speedMultiplier:   1.8,
      },
    },
  ],

  missions: {
    1: {
      hook: 'AgCl hampir tidak larut — hanya sedikit sekali yang terurai. Tapi berapa sedikit itu sebenarnya?',
      observe_prompt:
        'Amati padatan AgCl dan ion-ion Ag⁺ dan Cl⁻ yang terlarut dalam jumlah sangat kecil. ' +
        'Coba temukan perbedaan antara padatan dan ion yang terlarut.',
      ai_questions: [
        'Berapa banyak ion Ag⁺ dan Cl⁻ yang ada dibandingkan AgCl padat?',
        'Apa yang menyebabkan AgCl sangat sukar larut (Ksp = 1,8 × 10⁻¹⁰)?',
        'Apakah padatan AgCl benar-benar diam, atau ada sesuatu yang terjadi di permukaannya?',
      ],
    },
    2: {
      investigate_prompt:
        'Di permukaan padatan AgCl, ada aksi terus-menerus yang tidak terlihat. ' +
        'Ketuk padatan AgCl untuk menyaksikan proses disolusi secara detail.',
      event_label: 'Ion Ag⁺ dan Cl⁻ melepaskan diri dari permukaan kristal AgCl — proses disolusi!',
      ai_after:
        'Kamu menyaksikan disolusi: AgCl(s) → Ag⁺(aq) + Cl⁻(aq). ' +
        'Bersamaan dengan itu, ion-ion yang ada juga kembali membentuk padatan: Ag⁺ + Cl⁻ → AgCl(s). ' +
        'Keduanya terjadi bersamaan sampai laju disolusi = laju pengendapan. Itulah Ksp!',
    },
    3: {
      predict_prompt:
        'Bagaimana cara membuat AgCl semakin tidak larut (bergeser ke kiri)? ' +
        'Pilih gangguanmu dan prediksi sebelum mencobanya!',
      ai_compare:
        'Prediksimu: {prediction}. Aksimu: {actual}. Hasilnya {matched}. ' +
        'Efek ion senama adalah prinsip penting dalam kimia analitik—digunakan untuk ' +
        'mengendapkan ion-ion secara kuantitatif dalam analisis gravimetri.',
    },
    4: {
      reflect_questions: [
        {
          q: 'Jika NaCl ditambahkan ke dalam larutan jenuh AgCl, apa yang terjadi?',
          options: [
            {
              text:        'AgCl akan semakin banyak mengendap (Ksp terlampaui)',
              correct:     true,
              explanation: 'Benar! Penambahan NaCl meningkatkan [Cl⁻]. Karena Qsp = [Ag⁺][Cl⁻] > Ksp, sistem bergeser ke kiri—lebih banyak AgCl mengendap. Ini adalah efek ion senama.',
            },
            {
              text:        'Lebih banyak AgCl yang larut',
              correct:     false,
              explanation: 'Tidak tepat. Penambahan ion senama (Cl⁻) justru menggeser kesetimbangan ke kiri, membuat lebih banyak AgCl mengendap.',
            },
          ],
        },
        {
          q: 'Apa arti fisik dari konstanta Ksp = 1,8 × 10⁻¹⁰ untuk AgCl?',
          options: [
            {
              text:        'Pada kesetimbangan, hasil kali [Ag⁺][Cl⁻] selalu sama dengan 1,8 × 10⁻¹⁰',
              correct:     true,
              explanation: 'Tepat! Ksp adalah konstanta kesetimbangan untuk proses disolusi. Nilai kecil ini berarti konsentrasi ion sangat rendah — AgCl sangat sukar larut.',
            },
            {
              text:        'AgCl hanya larut sebesar 1,8 × 10⁻¹⁰ gram',
              correct:     false,
              explanation: 'Tidak tepat. Ksp bukan kelarutan dalam gram, melainkan konstanta yang menggambarkan perkalian konsentrasi ion pada kesetimbangan.',
            },
          ],
        },
      ],
    },
  },
};
