/**
 * images.js — Pine & Pass Image Library
 * ─────────────────────────────────────────────────────────────────────────────
 * Single source of truth for all images used across the packages page.
 * All images served from Google Drive (publicly shared).
 * Format: https://drive.google.com/thumbnail?id=FILE_ID&sz=w600
 *
 * Mapping (in order):
 *  1  Delhi          10  Kasol
 *  2  Chandigarh     11  Kaza
 *  3  Amritsar       12  Kalpa
 *  4  Dehradun       13  Dalhousie
 *  5  Lucknow        14  Palampur
 *  6  Jaipur         15  Keylong
 *  7  Shimla         16  Chamba
 *  8  Manali         17  Kinnaur
 *  9  Dharamshala    18  Kullu / Bharmour
 *                    19  Bharmour
 *                    20  McLeod Ganj
 *                    21  Jibhi
 *                    22  Chitkul
 *                    23  Narkanda
 *                    24  Tosh / Sarahan
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─── 1. START CITY IMAGES ─────────────────────────────────────────────────────
window.START_IMAGES = {
  "Delhi":        "https://drive.google.com/thumbnail?id=14r4lVxdOVej8SS5grZj50P_kmEqlwoUN&sz=w600",   // 1
  "Chandigarh":   "https://drive.google.com/thumbnail?id=1eh7t10GnbMCF-5f4cKTKuhQbvV_r-Isc&sz=w600",   // 2
  "Amritsar":     "https://drive.google.com/thumbnail?id=1StHhmmWogw5wbXWMz3ooykCwvuO-A4fI&sz=w600",   // 3
  "Dehradun":     "https://drive.google.com/thumbnail?id=1RdXsYMhrnvba3Glc8MJyjtmr_0XEkc2T&sz=w600",   // 4
  "Lucknow":      "https://drive.google.com/thumbnail?id=1rqOHaklRBjeBv1KCWX29kPDyXRmN5PwZ&sz=w600",   // 5
  "Jaipur":       "https://drive.google.com/thumbnail?id=1CHfnDdwFNnCq21Wpreak0aGIeHIWZ4vo&sz=w600",   // 6
  "Shimla":       "https://drive.google.com/thumbnail?id=1ut5eL2H-hIjMeELodJDuY4ZrZCauGBoZ&sz=w600",   // 7
  "Manali":       "https://drive.google.com/thumbnail?id=1Wj2vfI0R68ZDlhPr1P06tNxRXKKK67GC&sz=w600",   // 8
  "Dharamshala":  "https://drive.google.com/thumbnail?id=1ISC4INjpuSNCn6Cgctn48dQAasPvpraB&sz=w600",   // 9
  "Kasol":        "https://drive.google.com/thumbnail?id=1bHLbIYMa3xO9LkVwT-xdU_SFYGGqIFmZ&sz=w600",   // 10
  "Kaza":         "https://drive.google.com/thumbnail?id=1ID7IQkkHg7MxblQTRtS1-ycTif86Xluz&sz=w600", // 11
  "Kalpa":        "https://drive.google.com/thumbnail?id=1kx5pdbLu_Eb0kh1S1mCkhU8mMMxCS8AU&sz=w600", // 12
  "Dalhousie":    "https://drive.google.com/thumbnail?id=1jU_FbssULoKENHPTmbUgJePBRWUOKlrF&sz=w600", // 13
  "Palampur":     "https://drive.google.com/thumbnail?id=1oXBV5IqiUwaK2HjqD9Po5oMmHBp8ha0K&sz=w600", // 14
  "Keylong":      "https://drive.google.com/thumbnail?id=1ss1z4p4J8INkSX-J7kEo6IoWjai7IYiB&sz=w600", // 15
  "Chamba":       "https://drive.google.com/thumbnail?id=1j44-HG28T5q1Cyeb65MjUkFTNsATfsbk&sz=w600", // 16
  "Kinnaur":      "https://drive.google.com/thumbnail?id=19UtwsJQcmKYeIPipX2o-kTEudQi-_gfx&sz=w600", // 17
  "Kullu":        "https://drive.google.com/thumbnail?id=1WBW_ab8B5ffHSjXbUT5mJxIK57xL3iF6&sz=w600", // 18
  "Bharmour":     "https://drive.google.com/thumbnail?id=19upYXK2gJjwrC4Hv5V_3UqeOqwyz1zk6&sz=w600", // 19
};

// ─── 2. DESTINATION IMAGES ───────────────────────────────────────────────────
window.DEST_IMAGES = {
  "Manali":       "https://drive.google.com/thumbnail?id=1Wj2vfI0R68ZDlhPr1P06tNxRXKKK67GC&sz=w600",   // 8
  "Shimla":       "https://drive.google.com/thumbnail?id=1ut5eL2H-hIjMeELodJDuY4ZrZCauGBoZ&sz=w600",   // 7
  "Kaza":         "https://drive.google.com/thumbnail?id=1ID7IQkkHg7MxblQTRtS1-ycTif86Xluz&sz=w600", // 11
  "Dharamshala":  "https://drive.google.com/thumbnail?id=1ISC4INjpuSNCn6Cgctn48dQAasPvpraB&sz=w600",   // 9
  "McLeod Ganj":  "https://drive.google.com/thumbnail?id=1ywkB_gHrhtYuwAZFLccRt-53R-25Ihlx&sz=w600", // 20
  "Dalhousie":    "https://drive.google.com/thumbnail?id=1jU_FbssULoKENHPTmbUgJePBRWUOKlrF&sz=w600", // 13
  "Kasol":        "https://drive.google.com/thumbnail?id=1bHLbIYMa3xO9LkVwT-xdU_SFYGGqIFmZ&sz=w600",   // 10
  "Jibhi":        "https://drive.google.com/thumbnail?id=1cfn4vB0pjIKK5iZz5rmMng6GS0hvjvzW&sz=w600", // 21
  "Kalpa":        "https://drive.google.com/thumbnail?id=1kx5pdbLu_Eb0kh1S1mCkhU8mMMxCS8AU&sz=w600", // 12
  "Chitkul":      "https://drive.google.com/thumbnail?id=1w-cA1F7Ybr2X-gyPSOjd1__5wQI96kX2&sz=w600", // 22
  "Keylong":      "https://drive.google.com/thumbnail?id=1ss1z4p4J8INkSX-J7kEo6IoWjai7IYiB&sz=w600", // 15
  "Narkanda":     "https://drive.google.com/thumbnail?id=1zyML626vzyNAfQaMMYLr1lsIBCBjUvqQ&sz=w600", // 23
  "Palampur":     "https://drive.google.com/thumbnail?id=1oXBV5IqiUwaK2HjqD9Po5oMmHBp8ha0K&sz=w600", // 14
  "Tosh":         "https://drive.google.com/thumbnail?id=10_KfuO452VEIuDthPCL8kXMQblL0URWq&sz=w600", // 24
  "Sarahan":      "https://drive.google.com/thumbnail?id=10_KfuO452VEIuDthPCL8kXMQblL0URWq&sz=w600", // 24

  // --- New places added (Drive photo audit) ---
  "Sunset Point Kasauli": "https://drive.google.com/thumbnail?id=1c3mqiXspZk0DLJiX4Apu-ksWzaD5H8bs&sz=w600", // sunset-point-kasauli
  "Cholling Monastery": "https://drive.google.com/thumbnail?id=1VwSrosvzPdwFshgZ1ygBkluZUu12eF4c&sz=w600", // cholling-monastery
  "Trilokinath Temple": "https://drive.google.com/thumbnail?id=1ZOrPc23Sw6CmjVB8QBxtfXsZTRPOz8Z3&sz=w600", // trilokinath-temple
  "Tauni Devi Temple": "https://drive.google.com/thumbnail?id=1UlZPn7nrX3vql1e_GUVALxheZG_1Pq0K&sz=w600", // tauni-devi-temple
  "Tarna Devi Temple": "https://drive.google.com/thumbnail?id=1sEaHna3aQlrIxwhfEKN09F0qX20W8Uz5&sz=w600", // tarna-devi-temple
  "Tara Devi Temple": "https://drive.google.com/thumbnail?id=1Q_BsGwueyYIB6gFWQaS2pO6zUg9ETNyp&sz=w600", // tara-devi-temple
  "Sundernagar Lake": "https://drive.google.com/thumbnail?id=1-sp6Cw6BF4aS5aYdesXZmUKLnX2E-qV4&sz=w600", // sundernagar-lake
  "St. John's Church": "https://drive.google.com/thumbnail?id=1qqOLifSM2lbajqCx8KugTowcZdXjYWyR&sz=w600", // st-johns-church
  "St. Francis Church": "https://drive.google.com/thumbnail?id=141r1JXaUSD6LoX52t49ng70vCEw_1Z0-&sz=w600", // st-francis-church
  "Vyas Cave": "https://drive.google.com/thumbnail?id=1bNhdDBVsd3D8tiVu72THh3eyMFDP0i4I&sz=w600", // vyas-cave
  "Shikari Devi Temple": "https://drive.google.com/thumbnail?id=1cLRdmVu6mU0Ds0f8KhQuYuVIQPBfSJbe&sz=w600", // shikari-devi-temple
  "Roghi Village": "https://drive.google.com/thumbnail?id=109SpFO6zjNCDasRYqNWj0JpYEkb9LL9d&sz=w600", // roghi-village
  "Rewalsar Lake": "https://drive.google.com/thumbnail?id=1dMXqaF__bs8ndXhqFP45q1-_6vdhvyXD&sz=w600", // rewalsar-lake
  "Renuka Temple": "https://drive.google.com/thumbnail?id=1FlgMhpIfuFglMPoOwmAbqJhrojuTggKB&sz=w600", // renuka-temple
  "Norbulingka Institute": "https://drive.google.com/thumbnail?id=1BK0Oj6HjXImZhjHNM8QZIHKB7iPohhHz&sz=w600", // norbulingka-institute
  "Nicholas Roerich Art Gallery": "https://drive.google.com/thumbnail?id=1LyvtOanuxHxHrEWJZteMHp4OUTtMZ2sO&sz=w600", // nicholas-roerich-art-gallery
  "Mud Village": "https://drive.google.com/thumbnail?id=135QkUmJf3klUB24_JZLCOD5wtIJK-ZQk&sz=w600", // mud-village
  "Moorang": "https://drive.google.com/thumbnail?id=1f657QC-GQRnY86hFeVVO0vHZ5G8w7_lY&sz=w600", // moorang
  "Lalung Monastery": "https://drive.google.com/thumbnail?id=1SYlxsW3qkNB7WYx1fo0LlMBtJHjSMA6e&sz=w600", // lalung-monastery
  "Lakshmi Narayan Temple": "https://drive.google.com/thumbnail?id=1akHHHxVi0uhUDreZr8RzrAl6GX_2Mhd8&sz=w600", // lakshmi-narayan-temple
  "Kutlehar Fort Ruins": "https://drive.google.com/thumbnail?id=1g1Y_sjMe-UDoJBfNJhFNl7GTXmCn1uRB&sz=w600", // kutlehar-fort-ruins
  "Kullu": "https://drive.google.com/thumbnail?id=1jlvXX_4HsXPjvn1Gu7_2LZPCROAz-B-P&sz=w600", // kullu
  "Kufri Fun World": "https://drive.google.com/thumbnail?id=1isK1Iuww4-Dyyz6hR8T8kwNHIyBQiTUX&sz=w600", // kufri-fun-world
  "Koldam Dam": "https://drive.google.com/thumbnail?id=1vXrMsb-E_meNAPXgCCNIGqAXzmryMxfX&sz=w600", // koldam-dam
  "Kiarighat": "https://drive.google.com/thumbnail?id=1wtjodBjPLDShRC3EZfJF9E-gdkY2qIi5&sz=w600", // kiarighat
  "Keylong": "https://drive.google.com/thumbnail?id=1mdfMzWq2EJXOdPl1d-7-oHLRbgRLPu7Z&sz=w600", // keylong
  "Kamru Fort": "https://drive.google.com/thumbnail?id=1gV2lT6cqXTPMR_G7VIEZVmGjL9FUj3Sl&sz=w600", // kamru-fort
  "Kamlah Fort": "https://drive.google.com/thumbnail?id=1dnb8e0Zh3YO0nLzL6MrzbdVm-OGmIOIs&sz=w600", // kamlah-fort
  "Kali Bari Temple": "https://drive.google.com/thumbnail?id=1d6tbCIrSx0j9wSIhdhhfpB8W9LKqXO77&sz=w600", // kali-bari-temple
  "Jogini Waterfall": "https://drive.google.com/thumbnail?id=1FUNinxrdYb7iYhFG0GlDUlxBZ4eWjKLF&sz=w600", // jogini-waterfall
  "Joginder Nagar": "https://drive.google.com/thumbnail?id=1wND6Ogj3s-W6-S9NBiKGyyT7xSbz4x3d&sz=w600", // joginder-nagar
  "Jatoli Shiv Temple": "https://drive.google.com/thumbnail?id=1IiTMdi6E_Sr8ah_wOtY4K30pyXohd7YE&sz=w600", // jatoli-shiv-temple
  "Jangi Village": "https://drive.google.com/thumbnail?id=1Wp-66Z_Hv3vVa5xhQuYaVriX98E9PITy&sz=w600", // jangi-village
  "Jakhu Temple": "https://drive.google.com/thumbnail?id=1Ipwl5Th_AufIWSNr5qGjiXoG_ddYdQpi&sz=w600", // jakhu-temple
  "Jakhu Ropeway": "https://drive.google.com/thumbnail?id=1lr3659146iZaBL7XAawb2YGmENSDYjBd&sz=w600", // jakhu-ropeway
  "Jaitak Fort": "https://drive.google.com/thumbnail?id=1NzWAk3lXR_-4h6tBtxWXCzMR918Df0W1&sz=w600", // jaitak-fort
  "Jagatsukh": "https://drive.google.com/thumbnail?id=1KUsZ-zN5B2Wo6Iu1ftQpGD64I4lZDBXT&sz=w600", // jagatsukh
  "Hatu Peak": "https://drive.google.com/thumbnail?id=17835CCZr4oj5XNjHxv5gzIkY3aKOoNBK&sz=w600", // hatu-peak
  "Haripurdhar Temple": "https://drive.google.com/thumbnail?id=1GDqE-Eott6viSFYNiU12xr4h_SUkiY_P&sz=w600", // haripurdhar-temple
  "Hampta Pass (trailhead)": "https://drive.google.com/thumbnail?id=18apY3jcBVtGcrMHX7BQJGFJJNOjHs4Pj&sz=w600", // hampta-pass-trek-start
  "Green Valley Manali": "https://drive.google.com/thumbnail?id=1G1fyL-y4qygleLzNCyztHmRA3M99Mgx0&sz=w600", // green-valley
  "Gondhla Fort": "https://drive.google.com/thumbnail?id=1fn0_2stn6cEAST7dUxxQoU-byXfkWhDP&sz=w600", // gondhla-fort
  "Ganji Pahari": "https://drive.google.com/thumbnail?id=1vvpNTmvqzQN_2t5fJBgIv9eyhtzUrfAq&sz=w600", // ganji-pahari
  "Dehnasar Lake Trek": "https://drive.google.com/thumbnail?id=1ioDKPGvIXat_JbEQPoNUGUdtTamZdArg&sz=w600", // dehnasar-lake-trek
  "Darcha": "https://drive.google.com/thumbnail?id=1cOoqr4k98jjJ_RqPArC36MpvJkP9aG8i&sz=w600", // darcha
  "Dal Lake Dharamshala": "https://drive.google.com/thumbnail?id=1O52tbT-BJdh1DGeF0uC8gCWe5V9Gv7uY&sz=w600", // dal-lake-dharamshala
  "Dainkund Peak": "https://drive.google.com/thumbnail?id=1M6IkuSm1LeCcNbpNq3zCXNhWCjDW_T0V&sz=w600", // dainkund-peak
  "Christ Church": "https://drive.google.com/thumbnail?id=1sqrRW_NIP1Mr0-yELm6j2xsh3nQaCfDq&sz=w600", // christ-church
  "Chindi Mata Temple": "https://drive.google.com/thumbnail?id=1oGjcwrZ5p3tvps-HIABClNVOQmCJzDfb&sz=w600", // chindi-mata-temple
  "Chicham Bridge": "https://drive.google.com/thumbnail?id=1rRdhO4gLpQWwWO4uQe7wKSHIhzS7KNOG&sz=w600", // chicham-bridge
  "Bon Monastery, Solan": "https://drive.google.com/thumbnail?id=1miTFePv3lnddFMNSf6mvvPeOdk9_zWe7&sz=w600", // bon-monastery-near-solan
  "Bhuri Singh Museum": "https://drive.google.com/thumbnail?id=1XcMQpLDnghpcoBisNshfFEAYBEp9Rczp&sz=w600", // bhuri-singh-museum
  "Bhuntar": "https://drive.google.com/thumbnail?id=19PxfaDl_AKPetHpJfwIBsFPvuK2ZTWO8&sz=w600", // bhuntar
  "Bhrigu Lake Trek": "https://drive.google.com/thumbnail?id=1TRR61v2H8xfjqeNqUpMq4Ih5CSHrafLn&sz=w600", // bhrigu-lake-trek
  "Bhagsunag Waterfall": "https://drive.google.com/thumbnail?id=10bF_tyup4NjF3GRB1KaOqaMEa7eyWcl4&sz=w600", // bhagsunag-waterfall-mcleodganj
};

// ─── 3. HERO / PACKAGE IMAGES ────────────────────────────────────────────────
window.HERO_IMAGES = [
  "https://drive.google.com/thumbnail?id=1Wj2vfI0R68ZDlhPr1P06tNxRXKKK67GC&sz=w1920",   // Manali
  "https://drive.google.com/thumbnail?id=1ut5eL2H-hIjMeELodJDuY4ZrZCauGBoZ&sz=w1920",   // Shimla
  "https://drive.google.com/thumbnail?id=1ID7IQkkHg7MxblQTRtS1-ycTif86Xluz&sz=w1920", // Kaza
  "https://drive.google.com/thumbnail?id=1ISC4INjpuSNCn6Cgctn48dQAasPvpraB&sz=w1920",   // Dharamshala
  "https://drive.google.com/thumbnail?id=1ss1z4p4J8INkSX-J7kEo6IoWjai7IYiB&sz=w1920", // Keylong
];

window.FALLBACK_IMG = "https://drive.google.com/thumbnail?id=1Wj2vfI0R68ZDlhPr1P06tNxRXKKK67GC&sz=w600";

// ─── Helpers ─────────────────────────────────────────────────────────────────
window.getStartImg = function(city) { return START_IMAGES[city] || FALLBACK_IMG; }
window.getDestImg = function(dest)  { return DEST_IMAGES[dest]  || FALLBACK_IMG; }
