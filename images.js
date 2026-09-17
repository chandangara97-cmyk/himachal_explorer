/**
 * images.js — Himachal Explorer Image Library
 * ─────────────────────────────────────────────────────────────────────────────
 * Single source of truth for all images used across the packages page.
 * Images are self-hosted under assets/images/places-fresh/ (migrated from
 * Google Drive hotlinks, then swapped for fresh Pexels stock photos —
 * see tools/fresh-images/README.md for the fetch/attribution process).
 * Format: assets/images/places-fresh/{slug}.jpg
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
  "Delhi": "assets/images/places-fresh/delhi.jpg",   // 1
  "Chandigarh": "assets/images/places-fresh/chandigarh.jpg",   // 2
  "Amritsar": "assets/images/places-fresh/amritsar.jpg",   // 3
  "Dehradun": "assets/images/places-fresh/dehradun.jpg",   // 4
  "Lucknow": "assets/images/places-fresh/lucknow.jpg",   // 5
  "Jaipur": "assets/images/places-fresh/jaipur.jpg",   // 6
  "Shimla": "assets/images/places-fresh/shimla.jpg",   // 7
  "Manali": "assets/images/places-fresh/manali.jpg",   // 8
  "Dharamshala": "assets/images/places-fresh/dharamshala.jpg",   // 9
  "Kasol": "assets/images/places-fresh/kasol.jpg",   // 10
  "Kaza": "assets/images/places-fresh/kaza.jpg", // 11
  "Kalpa": "assets/images/places-fresh/kalpa.jpg", // 12
  "Dalhousie": "assets/images/places-fresh/dalhousie.jpg", // 13
  "Palampur": "assets/images/places-fresh/palampur.jpg", // 14
  "Keylong": "assets/images/places-fresh/keylong.jpg", // 15
  "Chamba": "assets/images/places-fresh/chamba.jpg", // 16
  "Kinnaur": "assets/images/places-fresh/kinnaur.jpg", // 17
  "Kullu": "assets/images/places-fresh/kullu.jpg", // 18
  "Bharmour": "assets/images/places-fresh/bharmour.jpg", // 19
};

// ─── 2. DESTINATION IMAGES ───────────────────────────────────────────────────
window.DEST_IMAGES = {
  "Manali": "assets/images/places-fresh/manali.jpg",   // 8
  "Shimla": "assets/images/places-fresh/shimla.jpg",   // 7
  "Kaza": "assets/images/places-fresh/kaza.jpg", // 11
  "Dharamshala": "assets/images/places-fresh/dharamshala.jpg",   // 9
  "McLeod Ganj": "assets/images/places-fresh/mcleod-ganj.jpg", // 20
  "Dalhousie": "assets/images/places-fresh/dalhousie.jpg", // 13
  "Kasol": "assets/images/places-fresh/kasol.jpg",   // 10
  "Jibhi": "assets/images/places-fresh/jibhi.jpg", // 21
  "Kalpa": "assets/images/places-fresh/kalpa.jpg", // 12
  "Chitkul": "assets/images/places-fresh/chitkul.jpg", // 22
  "Sangla": "assets/images/places-fresh/sangla.jpg", // sangla
  "Keylong": "assets/images/places-fresh/keylong.jpg", // 15
  "Narkanda": "assets/images/places-fresh/narkanda.jpg", // 23
  "Palampur": "assets/images/places-fresh/palampur.jpg", // 14
  "Tosh": "assets/images/places-fresh/tosh.jpg", // 24
  "Sarahan": "assets/images/places-fresh/sarahan.jpg", // 24

  // --- New places added (Drive photo audit) ---
  "Sunset Point Kasauli": "assets/images/places-fresh/sunset-point-kasauli.jpg", // sunset-point-kasauli
  "Cholling Monastery": "assets/images/places-fresh/cholling-monastery.jpg", // cholling-monastery
  "Trilokinath Temple": "assets/images/places-fresh/trilokinath-temple.jpg", // trilokinath-temple
  "Tauni Devi Temple": "assets/images/places-fresh/tauni-devi-temple.jpg", // tauni-devi-temple
  "Tarna Devi Temple": "assets/images/places-fresh/tarna-devi-temple.jpg", // tarna-devi-temple
  "Tara Devi Temple": "assets/images/places-fresh/tara-devi-temple.jpg", // tara-devi-temple
  "Sundernagar Lake": "assets/images/places-fresh/sundernagar-lake.jpg", // sundernagar-lake
  "St. John's Church": "assets/images/places-fresh/st-john-s-church.jpg", // st-johns-church
  "St. Francis Church": "assets/images/places-fresh/st-francis-church.jpg", // st-francis-church
  "Vyas Cave": "assets/images/places-fresh/vyas-cave.jpg", // vyas-cave
  "Shikari Devi Temple": "assets/images/places-fresh/shikari-devi-temple.jpg", // shikari-devi-temple
  "Roghi Village": "assets/images/places-fresh/roghi-village.jpg", // roghi-village
  "Rewalsar Lake": "assets/images/places-fresh/rewalsar-lake.jpg", // rewalsar-lake
  "Renuka Temple": "assets/images/places-fresh/renuka-temple.jpg", // renuka-temple
  "Norbulingka Institute": "assets/images/places-fresh/norbulingka-institute.jpg", // norbulingka-institute
  "Nicholas Roerich Art Gallery": "assets/images/places-fresh/nicholas-roerich-art-gallery.jpg", // nicholas-roerich-art-gallery
  "Mud Village": "assets/images/places-fresh/mud-village.jpg", // mud-village
  "Moorang": "assets/images/places-fresh/moorang.jpg", // moorang
  "Lalung Monastery": "assets/images/places-fresh/lalung-monastery.jpg", // lalung-monastery
  "Lakshmi Narayan Temple": "assets/images/places-fresh/lakshmi-narayan-temple.jpg", // lakshmi-narayan-temple
  "Kutlehar Fort Ruins": "assets/images/places-fresh/kutlehar-fort-ruins.jpg", // kutlehar-fort-ruins
  "Kullu": "assets/images/places-fresh/kullu.jpg", // kullu
  "Kufri Fun World": "assets/images/places-fresh/kufri-fun-world.jpg", // kufri-fun-world
  "Koldam Dam": "assets/images/places-fresh/koldam-dam.jpg", // koldam-dam
  "Kiarighat": "assets/images/places-fresh/kiarighat.jpg", // kiarighat
  "Keylong": "assets/images/places-fresh/keylong.jpg", // keylong
  "Kamru Fort": "assets/images/places-fresh/kamru-fort.jpg", // kamru-fort
  "Kamlah Fort": "assets/images/places-fresh/kamlah-fort.jpg", // kamlah-fort
  "Kali Bari Temple": "assets/images/places-fresh/kali-bari-temple.jpg", // kali-bari-temple
  "Jogini Waterfall": "assets/images/places-fresh/jogini-waterfall.jpg", // jogini-waterfall
  "Joginder Nagar": "assets/images/places-fresh/joginder-nagar.jpg", // joginder-nagar
  "Jatoli Shiv Temple": "assets/images/places-fresh/jatoli-shiv-temple.jpg", // jatoli-shiv-temple
  "Jangi Village": "assets/images/places-fresh/jangi-village.jpg", // jangi-village
  "Jakhu Temple": "assets/images/places-fresh/jakhu-temple.jpg", // jakhu-temple
  "Jakhu Ropeway": "assets/images/places-fresh/jakhu-ropeway.jpg", // jakhu-ropeway
  "Jaitak Fort": "assets/images/places-fresh/jaitak-fort.jpg", // jaitak-fort
  "Jagatsukh": "assets/images/places-fresh/jagatsukh.jpg", // jagatsukh
  "Hatu Peak": "assets/images/places-fresh/hatu-peak.jpg", // hatu-peak
  "Haripurdhar Temple": "assets/images/places-fresh/haripurdhar-temple.jpg", // haripurdhar-temple
  "Hampta Pass (trailhead)": "assets/images/places-fresh/hampta-pass-trailhead.jpg", // hampta-pass-trek-start
  "Green Valley Manali": "assets/images/places-fresh/green-valley-manali.jpg", // green-valley
  "Gondhla Fort": "assets/images/places-fresh/gondhla-fort.jpg", // gondhla-fort
  "Ganji Pahari": "assets/images/places-fresh/ganji-pahari.jpg", // ganji-pahari
  "Dehnasar Lake Trek": "assets/images/places-fresh/dehnasar-lake-trek.jpg", // dehnasar-lake-trek
  "Darcha": "assets/images/places-fresh/darcha.jpg", // darcha
  "Dal Lake Dharamshala": "assets/images/places-fresh/dal-lake-dharamshala.jpg", // dal-lake-dharamshala
  "Dainkund Peak": "assets/images/places-fresh/dainkund-peak.jpg", // dainkund-peak
  "Christ Church": "assets/images/places-fresh/christ-church.jpg", // christ-church
  "Chindi Mata Temple": "assets/images/places-fresh/chindi-mata-temple.jpg", // chindi-mata-temple
  "Chicham Bridge": "assets/images/places-fresh/chicham-bridge.jpg", // chicham-bridge
  "Bon Monastery, Solan": "assets/images/places-fresh/bon-monastery-solan.jpg", // bon-monastery-near-solan
  "Bhuri Singh Museum": "assets/images/places-fresh/bhuri-singh-museum.jpg", // bhuri-singh-museum
  "Bhuntar": "assets/images/places-fresh/bhuntar.jpg", // bhuntar
  "Bhrigu Lake Trek": "assets/images/places-fresh/bhrigu-lake-trek.jpg", // bhrigu-lake-trek
  "Bhagsunag Waterfall": "assets/images/places-fresh/bhagsunag-waterfall.jpg", // bhagsunag-waterfall-mcleodganj
};

// ─── 3. HERO / PACKAGE IMAGES ────────────────────────────────────────────────
window.HERO_IMAGES = [
  "assets/images/places-fresh/manali.jpg",   // Manali
  "assets/images/places-fresh/shimla.jpg",   // Shimla
  "assets/images/places-fresh/kaza.jpg",   // Kaza
  "assets/images/places-fresh/dharamshala.jpg",   // Dharamshala
  "assets/images/places-fresh/keylong.jpg",   // Keylong

];

window.FALLBACK_IMG = "assets/images/places-fresh/manali.jpg";

// ─── Helpers ─────────────────────────────────────────────────────────────────
window.getStartImg = function(city) { return START_IMAGES[city] || FALLBACK_IMG; }
window.getDestImg = function(dest)  { return DEST_IMAGES[dest]  || FALLBACK_IMG; }
