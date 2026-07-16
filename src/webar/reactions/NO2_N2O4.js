/* ==========================================================================
   NO2_N2O4.js — Reaction Pack: 2NO₂ ⇌ N₂O₄
   
   Exothermic gas-phase equilibrium.
   Temperature increase → shift to reactants (more NO₂)
   Pressure increase   → shift to products (more N₂O₄, fewer moles)
   
   Molecule geometries use accurate bond angles:
   - NO₂: bent, O-N-O = 134.1°, N-O bond = 1.197 Å (scaled ×0.40)
   - N₂O₄: two NO₂ units joined at N-N (1.78 Å bond, scaled ×0.40)
   
   Computed positions (pre-calculated for clarity):
   - NO₂ half-angle = 67.05° → sin=0.9213, cos=0.3891
   - N-O bond × scale = 1.197 × 0.40 = 0.4788
   - Ox = 0.4788 × 0.9213 ≈ 0.441
   - Oy = 0.4788 × 0.3891 ≈ 0.186
   - N-N bond × scale = 1.78 × 0.40 = 0.712, half = 0.356
   ========================================================================== */

export const NO2_N2O4 = {
  id:    'NO2_N2O4',
  name:  'Kesetimbangan Dinitrogen Tetroksida',
  equation: '2NO₂ ⇌ N₂O₄',
  deltaH:   'exoterm',
  accentColor: 0xff6b35,

  reactants: [
    {
      id:       'NO2',
      label:    'NO₂',
      glbPath:  null,
      // N at center, two O at 134.1° bond angle (pre-calculated)
      atomDefs: [
        ['N',  0.000,  0.000, 0],
        ['O',  0.441,  0.186, 0],
        ['O', -0.441,  0.186, 0],
      ],
    },
  ],

  products: [
    {
      id:       'N2O4',
      label:    'N₂O₄',
      glbPath:  null,
      // Two NO₂ units at N₁=(-0.356,0,0) and N₂=(0.356,0,0)
      atomDefs: [
        // Left nitrogen unit
        ['N', -0.356,  0.000, 0],
        ['O', -0.797,  0.186, 0],  // -0.356 - 0.441
        ['O',  0.085,  0.186, 0],  // -0.356 + 0.441 (inward O)
        // Right nitrogen unit
        ['N',  0.356,  0.000, 0],
        ['O',  0.797,  0.186, 0],  //  0.356 + 0.441
        ['O', -0.085,  0.186, 0],  //  0.356 - 0.441 (inward O)
      ],
    },
  ],

  initialProductRatio: 0.35,

  experiments: [
    {
      id:     'suhu_naik',
      label:  'Naikkan Suhu',
      effect: {
        targetRatioShift: -0.30,
        speedMultiplier:   2.0,
      },
    },
    {
      id:     'suhu_turun',
      label:  'Turunkan Suhu',
      effect: {
        targetRatioShift: +0.30,
        speedMultiplier:   0.5,
      },
    },
    {
      id:     'tekanan_naik',
      label:  'Naikkan Tekanan',
      effect: {
        targetRatioShift: +0.25,
        boundaryScale:     0.70,
        speedMultiplier:   1.40,
      },
    },
  ],

  missions: {
    1: {
      hook: 'Gas NO₂ dan N₂O₄ ada dalam wadah tertutup. Tapi... apakah sistem ini benar-benar diam?',
      observe_prompt:
        'Amati dunia molekul ini. Identifikasi mana yang merupakan reaktan (NO₂) ' +
        'dan mana yang merupakan produk (N₂O₄). Perhatikan gerakan mereka.',
      ai_questions: [
        'Berapa banyak NO₂ dibandingkan N₂O₄ yang kamu lihat?',
        'Apakah molekul-molekul ini bergerak atau diam?',
        'Apa yang terjadi saat dua molekul NO₂ saling bertabrakan?',
      ],
    },
    2: {
      investigate_prompt:
        'Perhatikan dengan seksama—ada sesuatu yang terjadi di antara molekul-molekul ini. ' +
        'Ketuk sebuah molekul NO₂ untuk mengamati lebih dekat.',
      event_label: 'Dua molekul NO₂ bertabrakan dengan energi yang cukup... ikatan baru terbentuk!',
      ai_after:
        'Kamu baru saja melihat reaksi ke kanan: 2NO₂ → N₂O₄. ' +
        'Tahukah kamu bahwa reaksi ke kiri (N₂O₄ → 2NO₂) juga terjadi bersamaan?',
    },
    3: {
      predict_prompt:
        'Sekarang giliranmu! Pilih satu gangguan yang ingin kamu berikan pada sistem ini. ' +
        'Prediksi terlebih dahulu: ke mana kesetimbangan akan bergeser?',
      ai_compare:
        'Kamu memprediksi {prediction}. Kamu melakukan {actual}. ' +
        'Hasilnya {matched}. Berdasarkan Asas Le Chatelier, sistem berupaya mengembalikan kesetimbangan ' +
        'dengan bergeser ke arah yang mengurangi gangguan.',
    },
    4: {
      reflect_questions: [
        {
          q: 'Ketika suhu diturunkan pada reaksi eksoterm 2NO₂ ⇌ N₂O₄, apa yang terjadi?',
          options: [
            {
              text:        'Kesetimbangan bergeser ke kanan (lebih banyak N₂O₄)',
              correct:     true,
              explanation: 'Benar! Reaksi ke kanan adalah eksoterm (melepas panas). Menurunkan suhu mendorong sistem melepas lebih banyak panas, sehingga bergeser ke kanan.',
            },
            {
              text:        'Kesetimbangan bergeser ke kiri (lebih banyak NO₂)',
              correct:     false,
              explanation: 'Tidak tepat. Pada reaksi eksoterm, penurunan suhu justru menguntungkan reaksi ke kanan sesuai Asas Le Chatelier.',
            },
            {
              text:        'Kesetimbangan tidak berubah',
              correct:     false,
              explanation: 'Tidak tepat. Perubahan suhu SELALU mengubah posisi kesetimbangan karena mempengaruhi konstanta K.',
            },
          ],
        },
        {
          q: 'Apakah pada saat sistem telah setimbang, reaksi NO₂ ⇌ N₂O₄ benar-benar berhenti?',
          options: [
            {
              text:        'Ya, karena konsentrasi tidak berubah maka reaksi berhenti.',
              correct:     false,
              explanation: 'Tidak tepat. Konsentrasi tampak tetap bukan karena reaksi berhenti, melainkan karena laju reaksi maju = laju reaksi balik.',
            },
            {
              text:        'Tidak, reaksi maju dan balik tetap berlangsung secara bersamaan.',
              correct:     true,
              explanation: 'Tepat! Inilah inti kesetimbangan dinamis. Secara mikroskopis, molekul terus bereaksi—tetapi laju kedua arah setara sehingga komposisi makroskopis tampak tetap.',
            },
          ],
        },
      ],
    },
  },
};
