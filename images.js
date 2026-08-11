/**
 * images.js — Himachal Explorer Image Library
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
