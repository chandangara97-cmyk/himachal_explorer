import { useState, useEffect, useRef } from "react";

// ─── PLACES DATA (lat/lng from Firebase) ───────────────────────────────────
const PLACES = {
  andretta: { name: "Andretta", lat: 32.0833, lng: 76.55, region: "Kangra Valley", category: "art-village", tagline: "Artists' colony established in the 1920s — haven for painters & potters." },
  "atal-tunnel-viewpoint": { name: "Atal Tunnel Viewpoint", lat: 32.364, lng: 77.131, region: "Lahaul Access", category: "scenic", tagline: "Gateway to Lahaul through the world's longest highway tunnel at 3,060m." },
  baijnath_temple: { name: "Baijnath Temple", lat: 32.0522, lng: 76.6667, region: "Kangra Valley", category: "temple", tagline: "12th-century Shiva temple, one of the most revered shrines in Himachal." },
  barog: { name: "Barog", lat: 30.8833, lng: 77.0833, region: "Solan", category: "hillstation", tagline: "Quaint hill town on the Kalka-Shimla Railway — the famous tunnel stop." },
  "barot-valley": { name: "Barot Valley", lat: 32.0392, lng: 76.8443, region: "Uhl River Valley", category: "scenic", tagline: "Pristine trout streams, dense forests & colonial-era hydropower ruins." },
  bharmour: { name: "Bharmour", lat: 32.4439, lng: 76.5133, region: "Chamba Valley", category: "heritage", tagline: "Ancient capital of Chamba — 84 temple complex carved in rock." },
  "bijli-mahadev": { name: "Bijli Mahadev", lat: 31.9772, lng: 77.1644, region: "Kullu Valley", category: "temple", tagline: "Temple atop a 2,460m hill — the shivalinga is shattered by lightning each year and repaired with butter." },
  "bir-billing": { name: "Bir Billing", lat: 32.0461, lng: 76.7161, region: "Kangra Valley", category: "adventure", tagline: "World's second-best paragliding site — launch from 2,400m over tea gardens." },
  "chadwick-falls": { name: "Chadwick Falls", lat: 31.1215, lng: 77.1558, region: "Shimla Hills", category: "nature", tagline: "67m waterfall hidden in cedar forests just 5km from Shimla's Ridge." },
  chail: { name: "Chail", lat: 30.969, lng: 77.196, region: "Shimla Hills", category: "scenic", tagline: "Once a maharaja's retreat — home to the world's highest cricket ground at 2,250m." },
  chalal: { name: "Chalal", lat: 32.0078, lng: 77.3294, region: "Parvati Valley", category: "village", tagline: "A short riverside hike from Kasol — bohemian camping by the Parvati River." },
  chamba: { name: "Chamba Town", lat: 32.556, lng: 76.126, region: "Chamba Valley", category: "core", tagline: "1,400-year-old town on the Ravi River — ancient temples and rumal embroidery." },
  "chamera-lake": { name: "Chamera Lake", lat: 32.5458, lng: 76.195, region: "Chamba Valley", category: "lake", tagline: "Stunning reservoir created by Chamera Dam — ideal for boating and birding." },
  chandratal: { name: "Chandratal Lake", lat: 32.482, lng: 77.615, region: "Spiti Valley", category: "scenic", tagline: "The 'Moon Lake' at 4,300m — a crescent of turquoise water surrounded by snow peaks." },
  chintpurni: { name: "Chintpurni Temple", lat: 31.7167, lng: 76.1333, region: "Una", category: "temple", tagline: "One of the 51 Shakti Peethas — goddess who fulfils all wishes." },
  chitkul: { name: "Chitkul", lat: 31.346, lng: 78.436, region: "Baspa Valley", category: "scenic", tagline: "India's last inhabited village before the Tibet border — 3,450m above sea level." },
  churdhar: { name: "Churdhar Peak", lat: 30.8833, lng: 77.4, region: "Sirmaur", category: "trek", tagline: "Highest peak of outer Himalaya at 3,647m — panoramic views from Shimla to Dehradun." },
  craignano: { name: "Craignano Nature Park", lat: 31.1275, lng: 77.2115, region: "Shimla Hills", category: "park", tagline: "British-era botanical garden with orchards, herb gardens & pine trails." },
  dalhousie: { name: "Dalhousie", lat: 32.538, lng: 75.97, region: "Chamba Valley", category: "scenic", tagline: "Colonial hill station across five hills — panoramic views of Dhauladhar & Pir Panjal." },
  dharamshala: { name: "Dharamshala", lat: 32.219, lng: 76.3234, region: "Kangra Valley", category: "core", tagline: "Home of the Dalai Lama — Tibetan culture meets Himalayan trekking." },
  "gobind-sagar": { name: "Gobind Sagar Lake", lat: 31.4167, lng: 76.4333, region: "Una", category: "lake", tagline: "One of India's largest man-made lakes — formed by Bhakra Dam on the Sutlej." },
  ghnp: { name: "Great Himalayan National Park", lat: 31.7333, lng: 77.4, region: "Kullu Valley", category: "national-park", tagline: "UNESCO World Heritage Site — snow leopards, western tragopan & Himalayan brown bear." },
  "gue-mummy": { name: "Gue Mummy Village", lat: 32.1833, lng: 78.6167, region: "Spiti Valley", category: "heritage", tagline: "A 500-year-old naturally mummified Buddhist monk — one of the world's only intact mummies." },
  "habban-valley": { name: "Habban Valley", lat: 30.8, lng: 77.35, region: "Sirmaur", category: "valley", tagline: "Untouched valley of apple orchards and terraced paddy fields in Sirmaur district." },
  hadimba: { name: "Hadimba Temple", lat: 32.2485, lng: 77.185, region: "Kullu Valley", category: "spiritual", tagline: "4-storey pagoda temple built in 1553 amid dense deodar cedars." },
  hikkim: { name: "Hikkim", lat: 32.325, lng: 78.0, region: "Spiti Valley", category: "village", tagline: "Home to the world's highest post office at 4,400m — send a postcard to eternity." },
  jalori: { name: "Jalori Pass", lat: 31.53, lng: 77.415, region: "Seraj Region", category: "adventure", tagline: "Accessible pass at 3,120m — gateway to Serolsar Lake and vast meadows." },
  "jana-waterfall": { name: "Jana Waterfall", lat: 32.1001, lng: 77.195, region: "Kullu Valley", category: "nature", tagline: "Cascading multi-tier fall hidden off the Manali-Naggar road in deodar forests." },
  janjehli: { name: "Janjehli", lat: 31.365, lng: 77.21, region: "Mandi", category: "trek", tagline: "Dense forest meadows at 2,150m — base for Shikari Mata Temple trek." },
  jibhi: { name: "Jibhi", lat: 31.581, lng: 77.351, region: "Seraj Region", category: "scenic", tagline: "Offbeat wooden-house village on a stream — Himachal's best kept secret." },
  kalga: { name: "Kalga", lat: 32.0006, lng: 77.465, region: "Parvati Valley", category: "village", tagline: "Hillside village above Kasol — pine forests, mountain views & total silence." },
  kalpa: { name: "Kalpa", lat: 31.539, lng: 78.254, region: "Kinnaur Valley", category: "scenic", tagline: "Apple orchards facing the sacred Kinnaur Kailash — one of Himachal's great views." },
  "kamrunag-lake": { name: "Kamrunag Lake", lat: 31.5, lng: 77.0667, region: "Mandi", category: "lake", tagline: "Sacred lake at 3,334m — legend says gold & silver treasure lies at its bottom." },
  "kangra-fort": { name: "Kangra Fort", lat: 32.0913, lng: 76.2573, region: "Kangra Valley", category: "fort", tagline: "One of the oldest and largest forts in the Himalayan foothills — over 3,500 years old." },
  "kareri-lake": { name: "Kareri Lake", lat: 32.2858, lng: 76.305, region: "Kangra Valley", category: "lake", tagline: "Glacial lake at 2,950m — a moderately challenging trek through oak and rhododendron forests." },
  karsog: { name: "Karsog Valley", lat: 31.3333, lng: 77.2167, region: "Mandi", category: "heritage", tagline: "Ancient temples, saffron fields and apple orchards in a quiet valley." },
  kasauli: { name: "Kasauli", lat: 30.9013, lng: 76.9649, region: "Solan", category: "core", tagline: "British colonial cantonment town — Victorian architecture, Monkey Point & brewery." },
  kasol: { name: "Kasol", lat: 32.01, lng: 77.316, region: "Parvati Valley", category: "adventure", tagline: "The 'Mini Israel of India' — riverside camping, cafes and trekking hub." },
  kaza: { name: "Kaza", lat: 32.227, lng: 78.067, region: "Spiti Valley", category: "core", tagline: "Sub-divisional headquarters of Spiti at 3,800m — base for all high-altitude explorations." },
  "key-monastery": { name: "Key Monastery", lat: 32.299, lng: 78.012, region: "Spiti Valley", category: "spiritual", tagline: "Thousand-year-old Tibetan Buddhist monastery perched on a rocky hill at 4,166m." },
  khajjiar: { name: "Khajjiar", lat: 32.549, lng: 76.059, region: "Chamba Valley", category: "scenic", tagline: "The 'Mini Switzerland of India' — circular meadow lake surrounded by cedars." },
  kheerganga: { name: "Kheerganga Trek", lat: 32.033, lng: 77.451, region: "Parvati Valley", category: "adventure", tagline: "12km trek to a natural hot spring at 2,960m — magical campsite under stars." },
  kibber: { name: "Kibber Village", lat: 32.3333, lng: 78.0167, region: "Spiti Valley", category: "village", tagline: "Once claimed to be the world's highest motorable village at 4,205m." },
  komic: { name: "Komic", lat: 32.3083, lng: 78.0167, region: "Spiti Valley", category: "village", tagline: "Home to the world's highest motorable monastery — Tangyud Gompa at 4,587m." },
  kotgarh: { name: "Kotgarh", lat: 31.2581, lng: 77.4475, region: "Upper Shimla", category: "orchard", tagline: "Apple orchards introduced by American missionary Samuel Stokes — spiritual & scenic." },
  kufri: { name: "Kufri", lat: 31.0978, lng: 77.267, region: "Shimla Hills", category: "scenic", tagline: "Snow sports, yak rides & panoramic Himalayan views just 16km from Shimla." },
  kunzum: { name: "Kunzum Pass", lat: 32.3667, lng: 77.6333, region: "Spiti Valley", category: "pass", tagline: "Sacred pass at 4,590m — connecting Lahaul and Spiti, with a goddess temple at the top." },
  langza: { name: "Langza Village", lat: 32.27, lng: 78.07, region: "Spiti Valley", category: "heritage", tagline: "Marine fossils at 4,400m — ancient sea floor turned into the roof of the world." },
  malana: { name: "Malana Village", lat: 32.062, lng: 77.265, region: "Parvati Valley", category: "heritage", tagline: "Claimed to be the world's oldest democracy — an isolated village with its own laws." },
  "mall-road": { name: "Mall Road Shimla", lat: 31.1045, lng: 77.173, region: "Shimla Hills", category: "core", tagline: "The heartbeat of Shimla — colonial shops, cafes and the famous Gaiety Theatre." },
  manali: { name: "Manali", lat: 32.2432, lng: 77.1892, region: "Kullu Valley", category: "core", tagline: "Gateway to Leh and Spiti — adventure, apple orchards & snow-capped peaks." },
  manikaran: { name: "Manikaran Sahib", lat: 32.026, lng: 77.35, region: "Parvati Valley", category: "spiritual", tagline: "Sikh pilgrimage & Hindu hot springs — the gurduara langar is cooked in natural geothermal springs." },
  manimahesh: { name: "Manimahesh Lake", lat: 32.3956, lng: 76.6433, region: "Chamba Valley", category: "lake", tagline: "Sacred glacial lake at 4,080m — the abode of Lord Shiva, beneath Manimahesh Kailash." },
  mashobra: { name: "Mashobra", lat: 31.1345, lng: 77.2198, region: "Shimla Hills", category: "scenic", tagline: "President's summer retreat — serene cedar forests 12km from Shimla." },
  "masroor-temples": { name: "Masroor Rock Cut Temples", lat: 31.9, lng: 76.45, region: "Kangra Valley", category: "temple", tagline: "8th-century monolithic rock-cut temples — Himachal's answer to Ellora." },
  mcleodganj: { name: "McLeod Ganj", lat: 32.2426, lng: 76.3213, region: "Kangra Valley", category: "core", tagline: "Residence of the Dalai Lama — Tibetan monasteries, cafes & Triund base camp." },
  naggar: { name: "Naggar Castle", lat: 32.112, lng: 77.164, region: "Kullu Valley", category: "fort", tagline: "500-year-old castle turned heritage hotel — panoramic views of the Kullu valley." },
  nahan: { name: "Nahan", lat: 30.55, lng: 77.3, region: "Sirmaur", category: "town", tagline: "Planned hill town of Sirmaur — colonial architecture, Renuka Lake day trips." },
  nako: { name: "Nako Village", lat: 31.8814, lng: 78.6276, region: "Kinnaur", category: "scenic", tagline: "Highest lake village in Kinnaur — a monastery and turquoise lake above 3,600m." },
  naldehra: { name: "Naldehra", lat: 31.1664, lng: 77.2343, region: "Shimla Hills", category: "scenic", tagline: "India's oldest golf course (est. 1905) set in cedar forests — Lord Curzon's favourite." },
  narkanda: { name: "Narkanda", lat: 31.269, lng: 77.46, region: "Upper Shimla", category: "scenic", tagline: "Apple orchards and ski slopes at 2,700m — Hatu Peak viewpoint above the clouds." },
  "old-manali": { name: "Old Manali", lat: 32.251, lng: 77.188, region: "Kullu Valley", category: "culture", tagline: "Ancient village 3km from town — Manu Temple, stone lanes and backpacker cafes." },
  "pangi-valley": { name: "Pangi Valley", lat: 33.05, lng: 76.5, region: "Pangi Valley", category: "valley", tagline: "Remote valley cut off by snow for 6 months — tribal culture untouched by modernity." },
  "pin-valley": { name: "Pin Valley National Park", lat: 31.9, lng: 78.2, region: "Spiti Valley", category: "nature", tagline: "Cold desert wildlife sanctuary — snow leopards, Siberian ibex and rare Spiti birds." },
  "pong-dam": { name: "Pong Dam Lake", lat: 32.0, lng: 76.0833, region: "Kangra Valley", category: "lake", tagline: "Ramsar Wetland — one of India's most important wintering grounds for migratory birds." },
  prashar: { name: "Prashar Lake", lat: 31.754, lng: 77.1009, region: "Mandi", category: "spiritual", tagline: "Sacred lake at 2,730m with a floating island — 13th-century three-tiered pagoda temple." },
  pulga: { name: "Pulga", lat: 32.0089, lng: 77.4739, region: "Parvati Valley", category: "village", tagline: "Near-abandoned forest village — the last outpost before the Mantalai glacier." },
  raison: { name: "Raison", lat: 31.9567, lng: 77.1667, region: "Kullu Valley", category: "river-side", tagline: "Beas riverside camp — orchard walks and white water rafting base." },
  rakcham: { name: "Rakcham", lat: 31.3967, lng: 78.33, region: "Baspa Valley", category: "village", tagline: "Wooden hut village above Sangla — traditional Kinnauri architecture and apple fields." },
  "reckong-peo": { name: "Reckong Peo", lat: 31.53, lng: 78.27, region: "Kinnaur Valley", category: "core", tagline: "District headquarters of Kinnaur — base for Kinner Kailash circumambulation." },
  "renuka-lake": { name: "Renuka Lake", lat: 30.605, lng: 77.458, region: "Sirmaur", category: "nature", tagline: "Largest natural lake in HP shaped like a reclining woman — a Vishnu pilgrimage site." },
  "rohtang-pass": { name: "Rohtang Pass", lat: 32.3716, lng: 77.2466, region: "Kullu Valley", category: "scenic", tagline: "The 'Pile of Corpses' pass at 3,978m — historic gateway to Lahaul, Spiti & Ladakh." },
  "sach-pass": { name: "Sach Pass", lat: 33.0294, lng: 76.3267, region: "Pangi Valley", category: "pass", tagline: "One of India's most dangerous passes at 4,420m — open barely 3 months a year." },
  "sainj-valley": { name: "Sainj Valley", lat: 31.65, lng: 77.3833, region: "Seraj Region", category: "valley", tagline: "Part of the Great Himalayan National Park buffer zone — rare medicinal plants & birding." },
  sangla: { name: "Sangla", lat: 31.429, lng: 78.262, region: "Baspa Valley", category: "scenic", tagline: "Valley of flowers and apple orchards — Kamru Fort guards the ancient trade route." },
  "serolsar-lake": { name: "Serolsar Lake", lat: 31.54, lng: 77.42, region: "Seraj Region", category: "trek", tagline: "5km trek from Jalori Pass to a sacred lake — rhododendron forests and Budhi Nagin temple." },
  shimla: { name: "Shimla", lat: 31.1048, lng: 77.1734, region: "Shimla Hills", category: "core", tagline: "Former summer capital of British India — the Ridge, Mall Road and Scandal Point." },
  shoja: { name: "Shoja", lat: 31.554, lng: 77.382, region: "Seraj Region", category: "scenic", tagline: "Tiny meadow village between Jalori Pass and Jibhi — apple orchards and wooden temples." },
  sissu: { name: "Sissu", lat: 32.474, lng: 77.124, region: "Lahaul Valley", category: "scenic", tagline: "First village in Lahaul after Atal Tunnel — frozen waterfalls in winter, wildflowers in July." },
  solang: { name: "Solang Valley", lat: 32.316, lng: 77.157, region: "Kullu Valley", category: "adventure", tagline: "Year-round adventure hub — skiing, zorbing, paragliding and cable car rides." },
  "sujanpur-fort": { name: "Sujanpur Tira Fort", lat: 31.8333, lng: 76.5, region: "Hamirpur", category: "fort", tagline: "18th-century Katoch dynasty fort complex — historic temples and ghats on the Beas." },
  tabo: { name: "Tabo Monastery", lat: 32.093, lng: 78.383, region: "Spiti Valley", category: "heritage", tagline: "1,000-year-old monastery — the 'Ajanta of the Himalayas', with original murals intact." },
  "tani-jubbar": { name: "Tani Jubbar Lake", lat: 31.28, lng: 77.42, region: "Upper Shimla", category: "lake", tagline: "Sacred lake at 2,700m — a hidden gem near Narkanda in dense oak forest." },
  tattapani: { name: "Tattapani", lat: 31.2333, lng: 77.2667, region: "Sutlej Valley", category: "hot-spring", tagline: "Natural sulphur hot springs on the Sutlej river banks — therapeutic river-side bathing." },
  "the-ridge": { name: "The Ridge Shimla", lat: 31.1048, lng: 77.1734, region: "Shimla Hills", category: "core", tagline: "The iconic open space at 2,213m — panoramic Himalayan views and Christ Church." },
  "tirthan-valley": { name: "Tirthan Valley", lat: 31.612, lng: 77.355, region: "Seraj Region", category: "scenic", tagline: "Crystal-clear trout river in a UNESCO buffer zone — rustic homestays and forest walks." },
  tosh: { name: "Tosh", lat: 32.025, lng: 77.45, region: "Parvati Valley", category: "adventure", tagline: "Steep climb to a ridge village at 2,400m — classic backpacker destination above Kasol." },
  triund: { name: "Triund", lat: 32.2618, lng: 76.3503, region: "Kangra Valley", category: "trek", tagline: "Gentle 9km trek to a ridge at 2,875m — snowline camping with Dhauladhar panorama." },
  vashisht: { name: "Vashisht Hot Springs", lat: 32.256, lng: 77.195, region: "Kullu Valley", category: "nature", tagline: "Ancient sage Vashisht's village — hot sulphur springs and old stone temples." },
};

// ─── ITINERARY DATA ────────────────────────────────────────────────────────
const ITINERARIES = {
  
  
  "chamba-pangi-5d": {
    name: "Chamba Deep Circuit",
    days: 5, start: "PATHANKOT", km: 340,
    budget: 8010, premium: 12015, luxury: 16020,
    tags: ["adventure", "offbeat", "trek"],
    region: "Chamba",
    highlight: "Bharmour, Manimahesh & Pangi Valley",
    itinerary: [
      { day: 1, title: "Pathankot → Chamba", drive: "120 km · 3.5 hrs", stays: "Chamba", places: ["chamba", "chamera-lake"], activities: ["Chamera Lake viewpoint", "Evening at Chamba town", "Lakshmi Narayan temple complex"] },
      { day: 2, title: "Chamba → Bharmour", drive: "65 km · 2.5 hrs", stays: "Bharmour", places: ["bharmour"], activities: ["84 Chaurasi temple complex", "Manimahesh Lake acclimatisation walk", "Local interaction with Gaddi tribe"] },
      { day: 3, title: "Bharmour → Manimahesh Lake", drive: "22 km + trek", stays: "Bharmour", places: ["manimahesh"], activities: ["Drive to Hadsar", "13km trek to Manimahesh Lake (4,080m)", "Sacred bath in glacial waters", "Trek back to Bharmour"] },
      { day: 4, title: "Bharmour → Pangi Valley", drive: "100 km · 4 hrs", stays: "Pangi", places: ["pangi-valley"], activities: ["Drive through Sach Pass approach", "Pangi tribal village walk", "Chandrabhaga riverside camp"] },
      { day: 5, title: "Pangi → Pathankot", drive: "220 km · 6 hrs", stays: "—", places: [], activities: ["Morning Chandrabhaga river walk", "Drive back via Chamba and Dalhousie", "Drop at Pathankot"] },
    ]
  },
  "chamba-sach-6d": {
    name: "Chamba & Sach Pass",
    days: 6, start: "PATHANKOT", km: 520,
    budget: 8313, premium: 12469, luxury: 16626,
    tags: ["adventure", "extreme", "offbeat"],
    region: "Chamba",
    highlight: "The Most Dangerous Road",
    itinerary: [
      { day: 1, title: "Pathankot → Dalhousie", drive: "80 km · 2.5 hrs", stays: "Dalhousie", places: ["dalhousie", "kalatop-wildlife-sanctuary"], activities: ["Kalatop Forest walk", "Sunset from Bakrota Hills"] },
      { day: 2, title: "Dalhousie → Chamba", drive: "55 km · 1.5 hrs", stays: "Chamba", places: ["chamba", "bhuri-singh-museum", "khajjiar"], activities: ["Khajjiar half-day", "Chamba town evening walk", "Bhuri Singh Museum"] },
      { day: 3, title: "Chamba → Bharmour", drive: "65 km · 2.5 hrs", stays: "Bharmour", places: ["bharmour", "manimahesh"], activities: ["Chaurasi Temples", "Manimahesh Lake short trek", "Gaddi tribal culture evening"] },
      { day: 4, title: "Bharmour → Sach Pass Base", drive: "80 km · 4 hrs", stays: "Killar / Pangi", places: ["sach-pass", "pangi-valley"], activities: ["Cross the legendary Sach Pass (4,420m)", "Rocky switchbacks and snow fields", "Enter remote Pangi Valley"] },
      { day: 5, title: "Pangi Valley Exploration", drive: "Local", stays: "Killar", places: ["pangi-valley"], activities: ["Chandrabhaga river gorge walk", "Village temple visits", "Interaction with isolated Pangwal tribe"] },
      { day: 6, title: "Pangi → Pathankot", drive: "280 km · 8 hrs", stays: "—", places: [], activities: ["Dawn departure via Chamba", "Mountain highway drive", "Evening arrival at Pathankot"] },
    ]
  },
  "chandigarh-best-value-5d": {
    name: "Best Value Himachal from Chandigarh",
    days: 5, start: "CHANDIGARH", km: 520,
    budget: 8280, premium: 12420, luxury: 16560,
    tags: ["friends", "couple", "family"],
    region: "Multi-region",
    highlight: "Shimla to Kasol",
    itinerary: [
      { day: 1, title: "Chandigarh → Shimla", drive: "110 km · 3 hrs", stays: "Shimla", places: ["shimla", "mall-road", "the-ridge"], activities: ["Mall Road walk", "The Ridge and Christ Church", "Scandal Point sunset"] },
      { day: 2, title: "Shimla Exploration", drive: "Local", stays: "Shimla", places: ["kufri", "mashobra", "chadwick-falls"], activities: ["Kufri snow point", "Mashobra forest walk", "Chadwick Falls"] },
      { day: 3, title: "Shimla → Jibhi", drive: "190 km · 5 hrs", stays: "Jibhi", places: ["jibhi", "shoja"], activities: ["Jibhi waterfall trail", "Shoja meadow walk", "Homestay dinner with Himachali cuisine"] },
      { day: 4, title: "Jibhi → Kasol via Jalori Pass", drive: "150 km · 5 hrs", stays: "Kasol", places: ["jalori", "serolsar-lake", "kasol"], activities: ["Jalori Pass viewpoint", "Serolsar Lake short trek (5km)", "Evening arrival at Kasol"] },
      { day: 5, title: "Kasol & Return to Chandigarh", drive: "320 km · 8 hrs", stays: "—", places: ["manikaran"], activities: ["Manikaran Sahib morning visit", "Depart via NH3", "Evening drop at Chandigarh"] },
    ]
  },
  "chandigarh-jibhi-seraj-4d": {
    name: "Chandigarh to Seraj Valley",
    days: 4, start: "CHANDIGARH", km: 380,
    budget: 6570, premium: 9855, luxury: 13140,
    tags: ["couple", "offbeat", "scenic"],
    region: "Seraj Valley",
    highlight: "Jibhi, Shoja & Jalori Pass",
    itinerary: [
      { day: 1, title: "Chandigarh → Jibhi", drive: "190 km · 5 hrs", stays: "Jibhi", places: ["jibhi"], activities: ["Riverside wooden camp check-in", "Jibhi waterfall short trail", "Stream-side dinner"] },
      { day: 2, title: "Jibhi → Shoja → Jalori Pass", drive: "25 km · 1 hr", stays: "Jibhi / Shoja", places: ["shoja", "jalori", "serolsar-lake"], activities: ["Jalori Pass (3,120m) walk", "Serolsar Lake trek (5km)", "Shoja apple orchard walk"] },
      { day: 3, title: "Tirthan Valley Day Trip", drive: "40 km · 1.5 hrs", stays: "Jibhi", places: ["tirthan-valley", "ghnp"], activities: ["Tirthan River trout spotting", "GHNP entry point walk", "Sainj Valley exploration"] },
      { day: 4, title: "Jibhi → Chandigarh", drive: "190 km · 5 hrs", stays: "—", places: [], activities: ["Morning meadow walk", "Bahu village visit en route", "Evening drop at Chandigarh"] },
    ]
  },
  "chandigarh-kasauli-barog-2d": {
    name: "Chandigarh Weekend Escape",
    days: 2, start: "CHANDIGARH", km: 120,
    budget: 3180, premium: 4770, luxury: 6360,
    tags: ["couple", "weekend", "heritage"],
    region: "Shimla Belt",
    highlight: "Kasauli & Barog Railway",
    itinerary: [
      { day: 1, title: "Chandigarh → Kasauli → Barog", drive: "75 km · 2 hrs", stays: "Kasauli / Barog", places: ["kasauli", "barog"], activities: ["Kasauli Brewery visit", "Monkey Point viewpoint", "Kasauli Club (heritage)", "Barog tunnel railway heritage walk"] },
      { day: 2, title: "Barog → Chandigarh via Dagshai", drive: "60 km · 2 hrs", stays: "—", places: ["dagshai"], activities: ["Dagshai Jail Museum", "Solan orchid garden", "Return to Chandigarh by noon"] },
    ]
  },
  "chandigarh-prashar-mandi-3d": {
    name: "Chandigarh to Prashar Lake",
    days: 3, start: "CHANDIGARH", km: 320,
    budget: 4980, premium: 7470, luxury: 9960,
    tags: ["friends", "trek", "spiritual"],
    region: "Mandi",
    highlight: "Hidden Jewel of Mandi",
    itinerary: [
      { day: 1, title: "Chandigarh → Mandi → Prashar Lake", drive: "200 km · 5 hrs", stays: "Prashar Lake camp", places: ["prashar"], activities: ["Drive to Baggi village", "7km trek up to Prashar Lake (2,730m)", "Floating island phenomenon", "Sunset and stargazing at 2,730m"] },
      { day: 2, title: "Prashar → Mandi Exploration", drive: "25 km descent", stays: "Mandi", places: ["mandi", "rewalsar-lake", "pandoh-dam"], activities: ["Rewalsar Lake and Buddhist monastery", "Pandoh Dam viewpoint", "Mandi temples & town walk"] },
      { day: 3, title: "Mandi → Chandigarh", drive: "190 km · 4.5 hrs", stays: "—", places: ["sundernagar-lake"], activities: ["Sundernagar Lake stop", "Return journey via NH3", "Afternoon arrival in Chandigarh"] },
    ]
  },
  "delhi-himachal-best-value-7d": {
    name: "Best of Himachal from Delhi",
    days: 7, start: "DELHI", km: 680,
    budget: 11520, premium: 17280, luxury: 23040,
    tags: ["friends", "family", "couple"],
    region: "Multi-region",
    highlight: "Shimla, Jibhi & Kasol",
    itinerary: [
      { day: 1, title: "Delhi → Shimla (Overnight Drive)", drive: "350 km · 8 hrs", stays: "Shimla", places: ["shimla"], activities: ["Arrive Shimla by morning", "Mall Road exploration", "Christ Church & Ridge"] },
      { day: 2, title: "Shimla Sightseeing", drive: "Local", stays: "Shimla", places: ["mall-road", "kufri", "chadwick-falls", "naldehra"], activities: ["Kufri snow point", "Naldehra golf course view", "Chadwick Falls trek", "Scandal Point evening"] },
      { day: 3, title: "Shimla → Jibhi", drive: "180 km · 5 hrs", stays: "Jibhi", places: ["jibhi", "shoja"], activities: ["Jibhi waterfall", "Shoja apple orchards", "Riverside homestay dinner"] },
      { day: 4, title: "Seraj Valley & Jalori Pass", drive: "50 km · 2 hrs", stays: "Jibhi", places: ["jalori", "serolsar-lake", "tirthan-valley"], activities: ["Jalori Pass sunrise", "Serolsar Lake trek (5km)", "Tirthan Valley trout fishing"] },
      { day: 5, title: "Jibhi → Kasol", drive: "130 km · 4 hrs", stays: "Kasol", places: ["kasol", "chalal"], activities: ["Chalal village hike", "Parvati riverside cafes", "Israeli-style dinner"] },
      { day: 6, title: "Kasol Exploration", drive: "Local", stays: "Kasol", places: ["manikaran", "tosh", "kheerganga"], activities: ["Manikaran Sahib visit", "Tosh village morning hike OR Kheerganga full day trek"] },
      { day: 7, title: "Kasol → Delhi", drive: "520 km · 10 hrs", stays: "—", places: [], activities: ["Early departure via Mandi–Chandigarh", "NH44 to Delhi", "Overnight arrival"] },
    ]
  },
  "delhi-kinnaur-spiti-10d": {
    name: "Kinnaur & Spiti Grand Expedition",
    days: 10, start: "DELHI", km: 1800,
    budget: 15045, premium: 22567, luxury: 30090,
    tags: ["adventure", "offbeat", "expedition"],
    region: "Kinnaur & Spiti",
    highlight: "The Ultimate Himalayan Circuit",
    itinerary: [
      { day: 1, title: "Delhi → Shimla (Overnight Drive)", drive: "350 km · 8 hrs", stays: "Shimla", places: ["shimla", "mall-road"], activities: ["Arrive morning", "Mall Road & Ridge orientation", "Rest and acclimatise"] },
      { day: 2, title: "Shimla → Narkanda → Reckong Peo", drive: "195 km · 6 hrs", stays: "Reckong Peo", places: ["narkanda", "reckong-peo", "kalpa"], activities: ["Narkanda Hatu Peak view", "Apple orchards of Kotgarh", "Evening at Reckong Peo", "Kalpa village sunset over Kinner Kailash"] },
      { day: 3, title: "Reckong Peo → Sangla Valley", drive: "85 km · 3 hrs", stays: "Sangla / Chitkul", places: ["sangla", "rakcham", "chitkul"], activities: ["Sangla Kamru Fort", "Rakcham village walk", "Chitkul — India's last village"] },
      { day: 4, title: "Chitkul → Nako → Tabo", drive: "180 km · 7 hrs", stays: "Tabo", places: ["nako", "tabo"], activities: ["Nako Lake and monastery", "Malling Nala gorge drive", "Tabo Monastery (1,000 years old)"] },
      { day: 5, title: "Tabo → Pin Valley → Kaza", drive: "80 km · 3 hrs", stays: "Kaza", places: ["pin-valley", "kaza"], activities: ["Pin Valley National Park entry", "Mud village walk", "Kaza market orientation"] },
      { day: 6, title: "Spiti Village Circuit from Kaza", drive: "80 km circuit", stays: "Kaza", places: ["langza", "hikkim", "komic", "key-monastery"], activities: ["Langza marine fossils (4,400m)", "Hikkim world's highest post office", "Komic monastery", "Key Monastery sunset"] },
      { day: 7, title: "Kaza → Kunzum → Chandratal", drive: "115 km · 5 hrs", stays: "Chandratal camp", places: ["kunzum", "chandratal"], activities: ["Kunzum Pass puja (4,590m)", "Chandratal Moon Lake arrival", "Sunset over turquoise waters", "High-altitude stargazing"] },
      { day: 8, title: "Chandratal → Manali", drive: "115 km · 5 hrs", stays: "Manali", places: ["manali", "rohtang-pass"], activities: ["Rohtang Pass crossing", "Manali arrival and rest", "Old Manali evening walk"] },
      { day: 9, title: "Manali → Gue Mummy → Kaza (day trip alt: rest)", drive: "Optional", stays: "Manali", places: ["gue-mummy", "solang", "hadimba"], activities: ["Hadimba Temple", "Solang Valley adventure sports", "Old Manali temples and cafes"] },
      { day: 10, title: "Manali → Delhi", drive: "560 km · 11 hrs", stays: "—", places: [], activities: ["Early departure via NH3", "Mandi, Chandigarh, Delhi", "Overnight arrival"] },
    ]
  },
  
  "kangra-offbeat-4d": {
    name: "Kangra Hidden Gems",
    days: 4, start: "DHARAMSHALA", km: 180,
    budget: 6270, premium: 9405, luxury: 12540,
    tags: ["offbeat", "culture", "heritage"],
    region: "Kangra",
    highlight: "Masroor Temples, Andretta & Pong Lake",
    itinerary: [
      { day: 1, title: "Dharamshala → Norbulingka → Andretta", drive: "40 km · 1.5 hrs", stays: "Palampur / Andretta", places: ["mcleodganj", "andretta"], activities: ["Norbulingka Institute Tibetan arts", "Andretta pottery centre visit", "Artist studios and folk culture"] },
      { day: 2, title: "Masroor Rock Cut Temples", drive: "70 km · 2.5 hrs", stays: "Kangra", places: ["masroor-temples", "kangra-fort"], activities: ["Masroor 8th-century temples", "Kangra Fort exploration", "Kangra town heritage walk"] },
      { day: 3, title: "Pong Dam Wetland", drive: "50 km · 1.5 hrs", stays: "Kangra", places: ["pong-dam", "bir-billing"], activities: ["Pong Dam birdwatching", "Bir Billing paragliding viewpoint", "Palampur tea garden walk"] },
      { day: 4, title: "Kangra → Dharamshala", drive: "30 km · 1 hr", stays: "—", places: ["dharamshala", "baijnath-temple"], activities: ["Baijnath Temple morning puja", "Dharamshala market", "Depart by afternoon"] },
    ]
  },
  "kinnaur-complete-6d": {
    name: "Kinnaur Complete Circuit",
    days: 6, start: "SHIMLA", km: 480,
    budget: 9720, premium: 14580, luxury: 19440,
    tags: ["offbeat", "scenic", "heritage"],
    region: "Kinnaur & Spiti",
    highlight: "Sangla, Chitkul & Hidden Villages",
    itinerary: [
      { day: 1, title: "Shimla → Narkanda → Reckong Peo", drive: "195 km · 6 hrs", stays: "Reckong Peo", places: ["narkanda", "kotgarh", "reckong-peo"], activities: ["Narkanda Hatu Peak viewpoint", "Kotgarh apple orchards", "Reckong Peo town walk"] },
      { day: 2, title: "Reckong Peo → Kalpa → Sangla", drive: "80 km · 3 hrs", stays: "Sangla", places: ["kalpa", "sangla"], activities: ["Kalpa sunrise over Kinner Kailash", "Roghi village apple walk", "Sangla Kamru Fort"] },
      { day: 3, title: "Sangla → Rakcham → Chitkul", drive: "25 km · 1 hr", stays: "Chitkul", places: ["rakcham", "chitkul"], activities: ["Rakcham Kinnauri village life", "Chitkul — India's last village", "Chitkul Fort temple", "Baspa River sunset"] },
      { day: 4, title: "Chitkul → Nako", drive: "130 km · 5 hrs", stays: "Nako", places: ["nako"], activities: ["Nako Lake and Monastery", "Kinnaur desert landscape entry", "Village lhakang walk"] },
      { day: 5, title: "Nako → Pooh → Reckong Peo", drive: "90 km · 3.5 hrs", stays: "Reckong Peo", places: ["pooh", "reckong-peo", "kinnaur-kailash-view-point"], activities: ["Pooh village monastery", "Kinnaur Kailash viewpoint", "Evening rest at Reckong Peo"] },
      { day: 6, title: "Reckong Peo → Shimla", drive: "195 km · 6 hrs", stays: "—", places: ["narkanda"], activities: ["Mountain highway drive", "Narkanda apple belt stop", "Evening arrival at Shimla"] },
    ]
  },
  
  "manali-lahaul-5d": {
    name: "Manali & Lahaul Valley",
    days: 5, start: "MANALI", km: 280,
    budget: 7920, premium: 11880, luxury: 15840,
    tags: ["adventure", "scenic", "offbeat"],
    region: "Manali",
    highlight: "Sissu, Atal Tunnel & Keylong",
    itinerary: [
      { day: 1, title: "Manali Acclimatisation", drive: "Local", stays: "Manali", places: ["manali", "hadimba", "solang"], activities: ["Hadimba Temple", "Solang Valley", "Vashisht hot springs rest"] },
      { day: 2, title: "Manali → Atal Tunnel → Sissu", drive: "60 km · 1.5 hrs", stays: "Sissu", places: ["atal-tunnel-viewpoint", "sissu"], activities: ["Atal Tunnel (world's longest highway tunnel)", "Sissu frozen waterfall (winter) / wildflowers (summer)", "Drone-worthy Lahaul landscape"] },
      { day: 3, title: "Sissu → Keylong → Jispa", drive: "50 km · 2 hrs", stays: "Keylong / Jispa", places: [], activities: ["Keylong district HQ", "Kardang Monastery across the river", "Jispa riverside meadow camp"] },
      { day: 4, title: "Chandratal Day Trip", drive: "100 km · 4 hrs", stays: "Sissu", places: ["chandratal", "kunzum"], activities: ["Kunzum Pass (4,590m)", "Chandratal Lake (4,300m)", "Return via same route"] },
      { day: 5, title: "Lahaul → Manali", drive: "60 km · 1.5 hrs", stays: "—", places: ["rohtang-pass"], activities: ["Rohtang Pass view", "Return through Atal Tunnel", "Afternoon depart from Manali"] },
    ]
  },
  "mandi-janjehli-4d": {
    name: "Janjehli & Karsog Valley",
    days: 4, start: "MANDI", km: 220,
    budget: 6330, premium: 9495, luxury: 12660,
    tags: ["offbeat", "nature", "trek"],
    region: "Mandi",
    highlight: "Alpine Meadows & Ancient Temples",
    itinerary: [
      { day: 1, title: "Mandi → Janjehli", drive: "100 km · 3.5 hrs", stays: "Janjehli", places: ["janjehli", "prashar"], activities: ["Prashar Lake en route (short stop)", "Janjehli meadow arrival", "Forest walk around alpine meadows"] },
      { day: 2, title: "Shikari Mata Temple Trek", drive: "Local", stays: "Janjehli", places: ["janjehli"], activities: ["12km trek to Shikari Mata Temple (3,300m)", "Dense fir and cedar forests", "Panoramic Dhauladhar views"] },
      { day: 3, title: "Janjehli → Karsog Valley", drive: "70 km · 2.5 hrs", stays: "Karsog", places: ["karsog", "kamrunag-lake"], activities: ["Karsog ancient temples", "Kamrunag Lake trekking approach", "Saffron fields in season"] },
      { day: 4, title: "Karsog → Mandi", drive: "65 km · 2 hrs", stays: "—", places: ["rewalsar-lake"], activities: ["Rewalsar Lake morning visit", "Mandi temples exploration", "Depart by afternoon"] },
    ]
  },
  "mandi-offbeat-3d": {
    name: "Mandi Hidden Gems",
    days: 3, start: "MANDI", km: 160,
    budget: 4740, premium: 7110, luxury: 9480,
    tags: ["offbeat", "nature", "trek"],
    region: "Mandi",
    highlight: "Prashar Lake, Barot & Kamrunag",
    itinerary: [
      { day: 1, title: "Mandi → Prashar Lake", drive: "50 km · 2 hrs + 7km trek", stays: "Prashar Lake camp", places: ["prashar"], activities: ["Baggi village trailhead", "7km trek to Prashar Lake (2,730m)", "Floating island", "Sunrise and stargazing"] },
      { day: 2, title: "Prashar → Barot Valley", drive: "60 km · 2.5 hrs", stays: "Barot", places: ["barot-valley"], activities: ["Uhl River trout angling", "Nargu Wildlife Sanctuary walk", "Barot village life"] },
      { day: 3, title: "Barot → Mandi", drive: "70 km · 2.5 hrs", stays: "—", places: ["rewalsar-lake", "kamrunag-lake"], activities: ["Rewalsar Lake and Buddhist monastery", "Mandi Shivratri Fair town walk", "Depart by afternoon"] },
    ]
  },
  
  
  "seraj-offbeat-4d": {
    name: "Seraj Hidden Valley",
    days: 4, start: "AUT", km: 150,
    budget: 6225, premium: 9337, luxury: 12450,
    tags: ["offbeat", "couple", "nature"],
    region: "Seraj Valley",
    highlight: "Jibhi, Shoja & Jalori Pass",
    itinerary: [
      { day: 1, title: "Aut → Jibhi", drive: "35 km · 1 hr", stays: "Jibhi", places: ["jibhi"], activities: ["Wooden bridge stream walk", "Jibhi waterfall short trail", "Homestay with local thali dinner"] },
      { day: 2, title: "Jalori Pass & Serolsar Lake", drive: "20 km · 45 min", stays: "Jibhi / Shoja", places: ["jalori", "serolsar-lake", "shoja"], activities: ["Jalori Pass sunrise (3,120m)", "Serolsar Lake trek (5km round trip)", "Budhi Nagin temple", "Shoja meadow evening"] },
      { day: 3, title: "Tirthan Valley", drive: "40 km · 1.5 hrs", stays: "Tirthan / Jibhi", places: ["tirthan-valley", "ghnp"], activities: ["Tirthan River trout spotting", "GHNP entry walk", "Mahila Mandal village interaction"] },
      { day: 4, title: "Jibhi → Aut", drive: "35 km · 1 hr", stays: "—", places: [], activities: ["Morning forest walk", "Drive back through Banjar", "Depart from Aut"] },
    ]
  },
  "shimla-apple-belt-4d": {
    name: "Shimla Apple Belt & Hidden Lakes",
    days: 4, start: "SHIMLA", km: 220,
    budget: 6330, premium: 9495, luxury: 12660,
    tags: ["scenic", "offbeat", "family"],
    region: "Shimla Belt",
    highlight: "Apple Orchards & Hidden Lakes",
    itinerary: [
      { day: 1, title: "Shimla → Narkanda", drive: "65 km · 2 hrs", stays: "Narkanda", places: ["narkanda", "kotgarh", "tani-jubbar"], activities: ["Kotgarh apple orchards", "Tani Jubbar Lake trail (4km)", "Hatu Peak sunset (3,100m)"] },
      { day: 2, title: "Narkanda → Rampur → Tattapani", drive: "100 km · 3 hrs", stays: "Tattapani", places: ["tattapani"], activities: ["Sutlej river canyon drive", "Tattapani hot sulphur springs", "River beach relaxation"] },
      { day: 3, title: "Tattapani → Chail → Shimla", drive: "80 km · 3 hrs", stays: "Chail / Shimla", places: ["chail", "shimla"], activities: ["Chail Palace and world's highest cricket ground", "Kufri snow point en route", "Shimla Mall Road evening"] },
      { day: 4, title: "Shimla Hidden Gems", drive: "Local", stays: "—", places: ["chadwick-falls", "craignano", "naldehra"], activities: ["Chadwick Falls forest walk", "Craignano nature park", "Naldehra golf course", "Depart afternoon"] },
    ]
  },
  "shimla-hidden-3d": {
    name: "Shimla Hidden Gems",
    days: 3, start: "SHIMLA", km: 80,
    budget: 4620, premium: 6930, luxury: 9240,
    tags: ["couple", "heritage", "offbeat"],
    region: "Shimla Belt",
    highlight: "Mashobra, Naldehra & Craignano",
    itinerary: [
      { day: 1, title: "Shimla Heritage Walk", drive: "Local", stays: "Shimla", places: ["mall-road", "the-ridge", "shimla-state-museum", "annandale"], activities: ["Gaiety Theatre heritage tour", "Ridge & Christ Church", "State Museum heritage walk", "Annandale Army Museum"] },
      { day: 2, title: "Mashobra & Craignano", drive: "15 km · 30 min", stays: "Shimla", places: ["mashobra", "craignano", "naldehra"], activities: ["Mashobra presidential retreat area", "Craignano herb garden and nature walk", "Naldehra golf course and cedar forest"] },
      { day: 3, title: "Chadwick Falls & Departure", drive: "Local", stays: "—", places: ["chadwick-falls", "kufri"], activities: ["Chadwick Falls 3km forest trek", "Kufri panorama stop", "Afternoon depart Shimla"] },
    ]
  },
  "sirmaur-hidden-4d": {
    name: "Sirmaur Unexplored",
    days: 4, start: "NAHAN", km: 200,
    budget: 6300, premium: 9450, luxury: 12600,
    tags: ["offbeat", "nature", "heritage"],
    region: "Sirmaur",
    highlight: "Renuka Lake, Churdhar & Habban",
    itinerary: [
      { day: 1, title: "Nahan → Renuka Lake", drive: "45 km · 1.5 hrs", stays: "Renuka", places: ["nahan", "renuka-lake"], activities: ["Nahan town colonial walk", "Renuka Lake boating", "Renuka Ji temple evening aarti"] },
      { day: 2, title: "Churdhar Trek", drive: "70 km · 2.5 hrs to base", stays: "Sarahan / Nahan", places: ["churdhar"], activities: ["Drive to Nohra Dhar base", "12km trek to Churdhar Peak (3,647m)", "Outer Himalaya's highest peak", "360° views to Dehradun"] },
      { day: 3, title: "Habban Valley", drive: "50 km · 2 hrs", stays: "Habban", places: ["habban-valley"], activities: ["Apple and terraced field walks", "Jamu Peak base camp short trek", "Haripurdhar village temple visit"] },
      { day: 4, title: "Habban → Nahan", drive: "70 km · 2.5 hrs", stays: "—", places: ["renuka-lake"], activities: ["Morning Renuka lake walk", "Nahan Rani Tal garden", "Depart from Nahan"] },
    ]
  },
  
  
  "tirthan-sainj-5d": {
    name: "Tirthan & Sainj Valley",
    days: 5, start: "AUT", km: 200,
    budget: 7800, premium: 11700, luxury: 15600,
    tags: ["nature", "offbeat", "couple"],
    region: "Seraj Valley",
    highlight: "Great Himalayan National Park",
    itinerary: [
      { day: 1, title: "Aut → Tirthan Valley", drive: "30 km · 1 hr", stays: "Tirthan", places: ["tirthan-valley"], activities: ["Tirthan River homestay check-in", "Trout fish spotting walk", "Evening bonfire by the stream"] },
      { day: 2, title: "GHNP Entry Zone Trek", drive: "10 km · 30 min", stays: "Tirthan", places: ["ghnp"], activities: ["GHNP check post entry", "Rolla forest camp trek (6km)", "Birding and medicinal herb spotting"] },
      { day: 3, title: "Jalori Pass & Serolsar Lake", drive: "45 km · 1.5 hrs", stays: "Jibhi / Tirthan", places: ["jalori", "serolsar-lake", "jibhi"], activities: ["Jalori Pass motor-able crossing", "Serolsar Lake trek (5km round trip)", "Jibhi waterfall short trail"] },
      { day: 4, title: "Sainj Valley Exploration", drive: "40 km · 1.5 hrs", stays: "Sainj / Tirthan", places: ["sainj-valley"], activities: ["Sainj Valley GHNP buffer zone", "Neuli watchtower bird walk", "Ecocamp dinner"] },
      { day: 5, title: "Tirthan → Aut", drive: "30 km · 1 hr", stays: "—", places: ["tirthan-valley"], activities: ["Morning trout stream walk", "Local GHNP craft market", "Depart from Aut"] },
    ]
  },
  "delhi-himachal-complete-10d": {
    name: "Complete Himachal Grand Tour",
    days: 10, start: "DELHI", km: 1200,
    budget: 16800, premium: 25200, luxury: 33600,
    tags: ["family", "couple", "multi-region"],
    region: "Multi-region",
    highlight: "All Regions — Shimla, Manali, Kasol, Kangra",
    itinerary: [
      { day: 1, title: "Delhi → Shimla", drive: "350 km · 8 hrs", stays: "Shimla", places: ["shimla", "mall-road"], activities: ["Arrive Shimla", "Mall Road orientation", "Christ Church & Ridge"] },
      { day: 2, title: "Shimla Sightseeing", drive: "Local", stays: "Shimla", places: ["kufri", "naldehra", "chadwick-falls"], activities: ["Kufri snow", "Naldehra golf", "Chadwick Falls"] },
      { day: 3, title: "Shimla → Jibhi", drive: "180 km · 5 hrs", stays: "Jibhi", places: ["jibhi", "shoja"], activities: ["Jibhi waterfall", "Shoja meadow", "Homestay"] },
      { day: 4, title: "Jalori Pass & Tirthan", drive: "50 km loop", stays: "Jibhi", places: ["jalori", "serolsar-lake", "tirthan-valley"], activities: ["Jalori Pass", "Serolsar Lake trek", "Tirthan trout walk"] },
      { day: 5, title: "Jibhi → Kasol", drive: "130 km · 4 hrs", stays: "Kasol", places: ["kasol", "manikaran"], activities: ["Manikaran Sahib", "Kasol cafes", "Chalal hike"] },
      { day: 6, title: "Kasol Treks", drive: "Local", stays: "Kasol", places: ["kheerganga", "tosh"], activities: ["Tosh village morning", "Kheerganga or Kalga evening"] },
      { day: 7, title: "Kasol → Manali", drive: "120 km · 3.5 hrs", stays: "Manali", places: ["manali", "kullu"], activities: ["Kullu Shawl market", "Manali arrival", "Old Manali walk"] },
      { day: 8, title: "Manali Adventure Day", drive: "Local", stays: "Manali", places: ["solang", "hadimba", "old-manali"], activities: ["Solang Valley activities", "Hadimba Temple", "Vashisht hot springs"] },
      { day: 9, title: "Manali → Dharamshala", drive: "250 km · 6 hrs", stays: "McLeod Ganj", places: ["mcleodganj", "dharamshala"], activities: ["Norbulingka Institute", "McLeod Ganj walk", "Tibetan food dinner"] },
      { day: 10, title: "Kangra → Delhi", drive: "500 km · 10 hrs", stays: "—", places: ["kangra-fort", "baijnath-temple"], activities: ["Kangra Fort morning", "Baijnath Temple", "Depart for Delhi"] },
    ]
  },
  "delhi-renuka-tattapani-3d": {
    name: "Delhi to Hidden HP",
    days: 3, start: "DELHI", km: 440,
    budget: 5160, premium: 7740, luxury: 10320,
    tags: ["couple", "nature", "weekend"],
    region: "Sirmaur",
    highlight: "Renuka Lake & Tattapani Hot Springs",
    itinerary: [
      { day: 1, title: "Delhi → Nahan → Renuka Lake", drive: "290 km · 6 hrs", stays: "Renuka", places: ["nahan", "renuka-lake"], activities: ["Nahan scenic town", "Renuka Lake afternoon arrival", "Renuka Ji temple aarti"] },
      { day: 2, title: "Renuka → Tattapani", drive: "120 km · 3 hrs", stays: "Tattapani", places: ["tattapani"], activities: ["Sutlej river canyon drive", "Hot sulphur springs soak", "River beach relaxation", "Sunset over Sutlej gorge"] },
      { day: 3, title: "Tattapani → Delhi", drive: "280 km · 6 hrs", stays: "—", places: ["shimla"], activities: ["Optional Shimla stop", "NH5 scenic drive", "Evening Delhi arrival"] },
    ]
  },
  
  "lower-hp-offbeat-3d": {
    name: "Lower Himachal Offbeat",
    days: 3, start: "CHANDIGARH", km: 280,
    budget: 4920, premium: 7380, luxury: 9840,
    tags: ["offbeat", "heritage", "family"],
    region: "Lower HP",
    highlight: "Chintpurni, Sujanpur & Gobind Sagar",
    itinerary: [
      { day: 1, title: "Chandigarh → Chintpurni → Sujanpur", drive: "180 km · 4 hrs", stays: "Sujanpur / Hamirpur", places: ["chintpurni", "sujanpur-fort"], activities: ["Chintpurni Shakti Peetha temple", "Sujanpur Tira Fort and ghats", "Beas river bathing"] },
      { day: 2, title: "Gobind Sagar & Bhakra Dam", drive: "80 km · 2.5 hrs", stays: "Bilaspur", places: ["gobind-sagar"], activities: ["Gobind Sagar Lake boat ride", "Bhakra Dam viewpoint", "Naina Devi temple short detour"] },
      { day: 3, title: "Return to Chandigarh", drive: "200 km · 4.5 hrs", stays: "—", places: ["awah-devi-temple"], activities: ["Awah Devi Temple morning visit", "Scenic Shivalik foothills drive", "Afternoon Chandigarh arrival"] },
    ]
  },
};

// ─── COLOUR PALETTE ────────────────────────────────────────────────────────
const CAT_COLORS = {
  "core": "#f97316", "scenic": "#10b981", "heritage": "#8b5cf6",
  "lake": "#3b82f6", "adventure": "#ef4444", "pass": "#f59e0b",
  "temple": "#ec4899", "spiritual": "#a855f7", "village": "#84cc16",
  "trek": "#06b6d4", "valley": "#14b8a6", "fort": "#f97316",
  "nature": "#22c55e", "hot-spring": "#f59e0b", "culture": "#e879f9",
  "national-park": "#16a34a", "museum": "#7c3aed", "art-village": "#fb923c",
  "orchard": "#a3e635", "park": "#4ade80", "dam": "#60a5fa",
  "hillstation": "#34d399", "river-side": "#38bdf8", "viewpoint": "#fbbf24",
  "wildlife": "#65a30d",
};

const REGION_COLORS = {
  "Chamba": "#ef4444", "Parvati Valley": "#8b5cf6", "Multi-region": "#f97316",
  "Seraj Valley": "#10b981", "Shimla Belt": "#3b82f6", "Mandi": "#f59e0b",
  "Kinnaur & Spiti": "#06b6d4", "Kangra": "#ec4899", "Manali": "#22c55e",
  "Sirmaur": "#a855f7", "Lower HP": "#84cc16",
};

const ALL_PACKAGES = Object.entries(ITINERARIES).map(([id, data]) => ({ id, ...data }));
const ALL_REGIONS = ["All", ...new Set(ALL_PACKAGES.map(p => p.region))];

// ─── MINI MAP COMPONENT (SVG-based) ────────────────────────────────────────
function MiniMap({ stops, activeDay }) {
  if (!stops || stops.length === 0) return null;

  // Compute bounding box
  const lats = stops.map(s => s.lat);
  const lngs = stops.map(s => s.lng);
  const minLat = Math.min(...lats) - 0.3;
  const maxLat = Math.max(...lats) + 0.3;
  const minLng = Math.min(...lngs) - 0.3;
  const maxLng = Math.max(...lngs) + 0.3;

  const W = 360, H = 260;
  const toX = (lng) => ((lng - minLng) / (maxLng - minLng)) * (W - 40) + 20;
  const toY = (lat) => H - ((lat - minLat) / (maxLat - minLat)) * (H - 40) - 20;

  return (
    <div style={{ background: "#fdfbf7", borderRadius: 12, overflow: "hidden", border: "1px solid #e8e0d4" }}>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }}>
        {/* Grid lines */}
        {[...Array(5)].map((_, i) => (
          <line key={`h${i}`} x1={20} y1={20 + i * (H - 40) / 4} x2={W - 20} y2={20 + i * (H - 40) / 4} stroke="rgba(0,0,0,0.06)" strokeWidth={1} />
        ))}
        {[...Array(5)].map((_, i) => (
          <line key={`v${i}`} x1={20 + i * (W - 40) / 4} y1={20} x2={20 + i * (W - 40) / 4} y2={H - 20} stroke="rgba(0,0,0,0.06)" strokeWidth={1} />
        ))}

        {/* Route line */}
        {stops.length > 1 && (
          <polyline
            points={stops.map(s => `${toX(s.lng)},${toY(s.lat)}`).join(" ")}
            fill="none"
            stroke="rgba(176,125,58,0.35)"
            strokeWidth={1.5}
            strokeDasharray="4 3"
          />
        )}

        {/* Day route highlight */}
        {activeDay && stops.filter(s => s.day === activeDay).length > 1 && (
          <polyline
            points={stops.filter(s => s.day === activeDay).map(s => `${toX(s.lng)},${toY(s.lat)}`).join(" ")}
            fill="none"
            stroke="#b07d3a"
            strokeWidth={2.5}
          />
        )}

        {/* Place dots */}
        {stops.map((s, i) => {
          const x = toX(s.lng), y = toY(s.lat);
          const isActive = s.day === activeDay;
          return (
            <g key={i}>
              {isActive && <circle cx={x} cy={y} r={10} fill={CAT_COLORS[s.category] || "#b07d3a"} opacity={0.15} />}
              <circle cx={x} cy={y} r={isActive ? 5 : 3.5}
                fill={isActive ? (CAT_COLORS[s.category] || "#b07d3a") : "rgba(0,0,0,0.18)"}
                stroke={isActive ? "#fff" : "transparent"}
                strokeWidth={1}
              />
              {isActive && (
                <text x={x + 7} y={y + 4} fill="#1c1409" fontSize={8.5} fontFamily="monospace">{s.name}</text>
              )}
            </g>
          );
        })}

        {/* Day number labels for all stops */}
        {stops.map((s, i) => {
          if (stops.findIndex(o => o.day === s.day) !== i) return null;
          return (
            <text key={`d${i}`} x={toX(s.lng) - 3} y={toY(s.lat) - 8} fill="#9b8a74" fontSize={7} fontFamily="monospace">D{s.day}</text>
          );
        })}
      </svg>
    </div>
  );
}

// ─── MAIN APP ──────────────────────────────────────────────────────────────
export default function PackageItinerary({ initialPkgId } = {}) {
  // If initialPkgId provided (from URL), find that package as starting state
  const initPkg = initialPkgId ? ALL_PACKAGES.find(p => p.id === initialPkgId) || null : null;

  const [selectedRegion, setSelectedRegion] = useState("All");
  const [selectedPkg, setSelectedPkg] = useState(initPkg);
  const [activeDay, setActiveDay] = useState(1);
  const [tier, setTier] = useState("budget");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPackages = ALL_PACKAGES.filter(p => {
    const matchRegion = selectedRegion === "All" || p.region === selectedRegion;
    const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.highlight.toLowerCase().includes(searchQuery.toLowerCase());
    return matchRegion && matchSearch;
  });

  const openPackage = (pkg) => {
    setSelectedPkg(pkg);
    setActiveDay(1);
  };

  // Build map stops for selected package
  const mapStops = selectedPkg ? selectedPkg.itinerary.flatMap(day =>
    day.places.map(pid => {
      const p = PLACES[pid];
      if (!p) return null;
      return { ...p, day: day.day };
    }).filter(Boolean)
  ) : [];

  const priceKey = tier === "budget" ? "budget" : tier === "premium" ? "premium" : "luxury";

  return (
    <div style={{
      fontFamily: "'Crimson Pro', Georgia, serif",
      background: "#f8f5ef",
      minHeight: "100vh",
      color: "#1c1409",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Space+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: #f8f5ef; }
        ::-webkit-scrollbar-thumb { background: #d4c9b5; border-radius: 2px; }

        .header {
          padding: 24px 20px 0;
          border-bottom: 1px solid rgba(0,0,0,0.07);
          background: #fff;
        }
        .header-label {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.2em;
          color: #b07d3a;
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .header-title {
          font-size: 26px;
          font-weight: 300;
          color: #1c1409;
          margin-bottom: 16px;
          line-height: 1.2;
        }

        .search-bar {
          width: 100%;
          background: #fdfbf7;
          border: 1px solid #d4c9b5;
          border-radius: 8px;
          padding: 10px 14px;
          font-family: 'Crimson Pro', Georgia, serif;
          font-size: 14px;
          color: #1c1409;
          margin-bottom: 12px;
          outline: none;
        }
        .search-bar::placeholder { color: #9b8a74; }
        .search-bar:focus { border-color: #b07d3a; }

        .region-scroll {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          padding-bottom: 14px;
          scrollbar-width: none;
        }
        .region-scroll::-webkit-scrollbar { display: none; }
        .region-chip {
          padding: 5px 12px;
          border-radius: 20px;
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.08em;
          white-space: nowrap;
          cursor: pointer;
          border: 1px solid #d4c9b5;
          background: #fff;
          color: #5a4a36;
          transition: all 0.15s;
          flex-shrink: 0;
        }
        .region-chip.active {
          background: rgba(176,125,58,0.1);
          border-color: #b07d3a;
          color: #b07d3a;
        }

        .pkg-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(155px, 1fr));
          gap: 10px;
          padding: 16px;
        }
        .pkg-card {
          background: #fff;
          border: 1px solid #e8e0d4;
          border-radius: 10px;
          padding: 14px 13px;
          cursor: pointer;
          transition: all 0.18s;
          position: relative;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .pkg-card:hover {
          background: #fdfbf7;
          transform: translateY(-2px);
          border-color: #c9b99a;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }
        .pkg-card.active {
          border-color: #b07d3a;
          background: rgba(176,125,58,0.04);
        }
        .pkg-region-dot {
          display: inline-block;
          width: 6px; height: 6px;
          border-radius: 50%;
          margin-right: 5px;
          vertical-align: middle;
        }
        .pkg-region-label {
          font-family: 'Space Mono', monospace;
          font-size: 8.5px;
          letter-spacing: 0.08em;
          color: #9b8a74;
          text-transform: uppercase;
          margin-bottom: 7px;
        }
        .pkg-name {
          font-size: 14px;
          font-weight: 600;
          color: #1c1409;
          line-height: 1.3;
          margin-bottom: 6px;
        }
        .pkg-highlight {
          font-size: 12px;
          color: #5a4a36;
          font-style: italic;
          line-height: 1.3;
          margin-bottom: 8px;
        }
        .pkg-meta {
          display: flex;
          gap: 6px;
          align-items: center;
          flex-wrap: wrap;
        }
        .pkg-days-badge {
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          background: rgba(176,125,58,0.08);
          border: 1px solid rgba(176,125,58,0.25);
          color: #b07d3a;
          border-radius: 4px;
          padding: 2px 7px;
        }
        .pkg-price {
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          color: #a06428;
        }
        .pkg-tags {
          display: flex; flex-wrap: wrap; gap: 4px; margin-top: 6px;
        }
        .pkg-tag {
          font-size: 10px;
          background: #f8f5ef;
          border: 1px solid #e8e0d4;
          border-radius: 10px;
          padding: 2px 7px;
          color: #9b8a74;
        }

        /* Detail View */
        .detail-header {
          padding: 0 16px 0;
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }
        .back-btn {
          background: #fdfbf7;
          border: 1px solid #d4c9b5;
          border-radius: 8px;
          color: #5a4a36;
          cursor: pointer;
          padding: 8px 12px;
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          flex-shrink: 0;
          margin-top: 2px;
          transition: all 0.15s;
        }
        .back-btn:hover { background: #f0ebe2; border-color: #b07d3a; color: #b07d3a; }
        .detail-title {
          font-size: 22px;
          font-weight: 600;
          color: #1c1409;
          line-height: 1.2;
        }
        .detail-highlight {
          font-size: 14px;
          font-style: italic;
          color: #b07d3a;
          margin-top: 3px;
        }
        .detail-meta-row {
          display: flex;
          gap: 10px;
          align-items: center;
          flex-wrap: wrap;
          padding: 10px 16px;
          border-bottom: 1px solid rgba(0,0,0,0.06);
        }
        .meta-chip {
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          padding: 4px 10px;
          border-radius: 20px;
          border: 1px solid #d4c9b5;
          color: #5a4a36;
          background: #fff;
        }

        .tier-row {
          display: flex;
          gap: 8px;
          padding: 12px 16px;
          border-bottom: 1px solid rgba(0,0,0,0.06);
        }
        .tier-btn {
          flex: 1;
          border-radius: 8px;
          border: 1px solid #d4c9b5;
          background: #fff;
          color: #9b8a74;
          cursor: pointer;
          padding: 8px 4px;
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.05em;
          text-align: center;
          transition: all 0.15s;
        }
        .tier-btn.active.budget { background: rgba(46,125,82,0.08); border-color: #2e7d52; color: #2e7d52; }
        .tier-btn.active.premium { background: rgba(176,125,58,0.1); border-color: #b07d3a; color: #b07d3a; }
        .tier-btn.active.luxury { background: rgba(126,58,168,0.08); border-color: #7e3aa8; color: #7e3aa8; }
        .tier-price {
          font-size: 14px;
          font-weight: 700;
          display: block;
          margin-bottom: 1px;
        }
        .tier-label {
          font-size: 8px;
          display: block;
          opacity: 0.7;
        }

        .map-section { padding: 12px 16px; }

        .day-tabs {
          display: flex;
          gap: 0;
          overflow-x: auto;
          padding: 0 16px;
          border-bottom: 1px solid rgba(0,0,0,0.06);
          scrollbar-width: none;
          background: #fff;
        }
        .day-tabs::-webkit-scrollbar { display: none; }
        .day-tab {
          padding: 9px 14px;
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          border: none;
          background: transparent;
          color: #9b8a74;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          white-space: nowrap;
          transition: all 0.15s;
          flex-shrink: 0;
        }
        .day-tab.active { color: #b07d3a; border-bottom-color: #b07d3a; }

        .day-content { padding: 14px 16px; }
        .day-title-row {
          display: flex;
          align-items: baseline;
          gap: 10px;
          margin-bottom: 10px;
        }
        .day-number {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          color: #b07d3a;
          background: rgba(176,125,58,0.08);
          border: 1px solid rgba(176,125,58,0.25);
          border-radius: 5px;
          padding: 3px 8px;
        }
        .day-title {
          font-size: 17px;
          font-weight: 600;
          color: #1c1409;
        }
        .day-drive {
          color: #9b8a74;
          font-style: italic;
          margin-bottom: 12px;
          font-family: 'Space Mono', monospace;
          font-size: 9px;
        }
        .day-stays {
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          color: #a06428;
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .places-row {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          margin-bottom: 14px;
          scrollbar-width: none;
          padding-bottom: 4px;
        }
        .places-row::-webkit-scrollbar { display: none; }
        .place-chip {
          flex-shrink: 0;
          background: #fff;
          border: 1px solid #e8e0d4;
          border-radius: 8px;
          padding: 8px 11px;
          min-width: 110px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }
        .place-chip-cat {
          font-family: 'Space Mono', monospace;
          font-size: 8px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 4px;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .place-chip-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .place-chip-name {
          font-size: 13px;
          font-weight: 600;
          color: #1c1409;
          line-height: 1.2;
          margin-bottom: 3px;
        }
        .place-chip-tagline {
          font-size: 11px;
          color: #9b8a74;
          font-style: italic;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .activities-list { list-style: none; }
        .activity-item {
          display: flex;
          gap: 8px;
          padding: 6px 0;
          border-bottom: 1px solid rgba(0,0,0,0.05);
          font-size: 14px;
          color: #3d3020;
          line-height: 1.4;
        }
        .activity-item:last-child { border-bottom: none; }
        .activity-bullet {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #b07d3a;
          flex-shrink: 0;
          margin-top: 6px;
          opacity: 0.7;
        }
      `}</style>

      {/* ─── HEADER ─── */}
      <div className="header">
        <p className="header-label">Garg Enterprise · Packages</p>
        {selectedPkg ? (
          <div style={{ paddingTop: 6 }}>
            <div className="detail-header">
              <button className="back-btn" onClick={() => {
            if (initialPkgId) { window.location.href = 'packages.html'; }
            else { setSelectedPkg(null); }
          }}>← Back</button>
              <div>
                <div className="detail-title">{selectedPkg.name}</div>
                <div className="detail-highlight">{selectedPkg.highlight}</div>
              </div>
            </div>
          </div>
        ) : (
          <h1 className="header-title">Day-wise Itineraries</h1>
        )}
      </div>

      {/* ─── PACKAGE LIST ─── */}
      {!selectedPkg && (
        <>
          <div style={{ padding: "14px 16px 0" }}>
            <input
              className="search-bar"
              placeholder="Search packages or destinations…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <div className="region-scroll">
              {ALL_REGIONS.map(r => (
                <button key={r} className={`region-chip ${selectedRegion === r ? "active" : ""}`}
                  onClick={() => setSelectedRegion(r)}>
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div style={{ padding: "4px 16px 8px", fontFamily: "'Space Mono', monospace", fontSize: 9, color: "#475569" }}>
            {filteredPackages.length} packages
          </div>
          <div className="pkg-grid">
            {filteredPackages.map(pkg => (
              <div key={pkg.id} className="pkg-card" onClick={() => openPackage(pkg)}>
                <div className="pkg-region-label">
                  <span className="pkg-region-dot" style={{ background: REGION_COLORS[pkg.region] || "#64748b" }} />
                  {pkg.region}
                </div>
                <div className="pkg-name">{pkg.name}</div>
                <div className="pkg-highlight">{pkg.highlight}</div>
                <div className="pkg-meta">
                  <span className="pkg-days-badge">{pkg.days}D/{pkg.days - 1}N</span>
                  <span className="pkg-price">₹{pkg.budget.toLocaleString()}+</span>
                </div>
                <div className="pkg-tags">
                  {pkg.tags.map(t => <span key={t} className="pkg-tag">{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ─── PACKAGE DETAIL ─── */}
      {selectedPkg && (
        <>
          {/* Meta row */}
          <div className="detail-meta-row">
            <span className="meta-chip">{selectedPkg.days}D / {selectedPkg.days - 1}N</span>
            <span className="meta-chip">{selectedPkg.km} km est.</span>
            <span className="meta-chip" style={{ color: REGION_COLORS[selectedPkg.region] || "#94a3b8", borderColor: REGION_COLORS[selectedPkg.region] || "rgba(255,255,255,0.1)" }}>{selectedPkg.region}</span>
            {selectedPkg.tags.map(t => <span key={t} className="meta-chip">{t}</span>)}
          </div>

          {/* Tier selector */}
          <div className="tier-row">
            {["budget", "premium", "luxury"].map(t => (
              <button key={t} className={`tier-btn ${tier === t ? `active ${t}` : ""}`} onClick={() => setTier(t)}>
                <span className="tier-price">₹{selectedPkg[t].toLocaleString()}</span>
                <span className="tier-label">{t} / pax</span>
              </button>
            ))}
          </div>

          {/* Map */}
          <div className="map-section">
            <MiniMap stops={mapStops} activeDay={activeDay} />
          </div>

          {/* Day tabs */}
          <div className="day-tabs">
            {selectedPkg.itinerary.map(day => (
              <button key={day.day} className={`day-tab ${activeDay === day.day ? "active" : ""}`}
                onClick={() => setActiveDay(day.day)}>
                Day {day.day}
              </button>
            ))}
          </div>

          {/* Day content */}
          {selectedPkg.itinerary.filter(d => d.day === activeDay).map(day => (
            <div key={day.day} className="day-content">
              <div className="day-title-row">
                <span className="day-number">Day {day.day}</span>
                <span className="day-title">{day.title}</span>
              </div>
              <div className="day-drive">🚗 {day.drive}</div>
              {day.stays !== "—" && (
                <div className="day-stays">
                  <span>🏨</span>
                  <span>Stay: {day.stays}</span>
                </div>
              )}

              {/* Places row */}
              {day.places.length > 0 && (
                <div className="places-row">
                  {day.places.map(pid => {
                    const place = PLACES[pid];
                    if (!place) return null;
                    const col = CAT_COLORS[place.category] || "#64748b";
                    return (
                      <div key={pid} className="place-chip">
                        <div className="place-chip-cat" style={{ color: col }}>
                          <span className="place-chip-dot" style={{ background: col }} />
                          {place.category}
                        </div>
                        <div className="place-chip-name">{place.name}</div>
                        <div className="place-chip-tagline">{place.tagline}</div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Activities */}
              <ul className="activities-list">
                {day.activities.map((act, i) => (
                  <li key={i} className="activity-item">
                    <span className="activity-bullet" />
                    {act}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
