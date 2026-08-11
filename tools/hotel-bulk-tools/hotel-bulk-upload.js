#!/usr/bin/env node

/**
 * HIMACHAL EXPLORER — HOTEL BULK UPLOAD
 * Reads hotel-bulk-template.csv and pushes all records to Firebase in parallel
 * 
 * USAGE:
 *   node hotel-bulk-upload.js hotel-bulk-template.csv
 * 
 * SETUP (first time in Termux):
 *   npm install csv-parser
 */

const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

// Configuration
const DB = "https://garg-enterprise.firebaseio.com"; // Your Firebase Realtime DB URL
const INPUT_FILE = process.argv[2] || "hotel-bulk-template.csv";

if (!fs.existsSync(INPUT_FILE)) {
  console.error(`❌ File not found: ${INPUT_FILE}`);
  process.exit(1);
}

// Colors for terminal output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m"
};

function log(color, ...args) {
  console.log(color + args.join(" ") + colors.reset);
}

// Parse CSV and validate rows
const records = [];
let lineNum = 0;

fs.createReadStream(INPUT_FILE)
  .pipe(csv())
  .on("data", (row) => {
    lineNum++;
    
    // Skip empty rows and comments
    if (!row.city || !row.name || row.city.startsWith("#")) return;
    
    // Validate required fields
    const errors = [];
    if (!row.city) errors.push("city");
    if (!row.name) errors.push("name");
    if (!row.tier || !["budget", "premium", "luxury"].includes(row.tier)) errors.push("tier (must be budget|premium|luxury)");
    if (!row.rate) errors.push("rate");
    
    if (errors.length > 0) {
      log(colors.yellow, `⚠️  Line ${lineNum}: skipped (missing: ${errors.join(", ")})`);
      return;
    }
    
    // Convert to expected types
    const rate = parseFloat(row.rate);
    const ratePeak = row.ratePeak ? parseFloat(row.ratePeak) : null;
    const rateOff = row.rateOff ? parseFloat(row.rateOff) : Math.round(rate * 0.9);
    const rooms = row.rooms ? parseInt(row.rooms) : null;
    const lat = row.lat ? parseFloat(row.lat) : null;
    const lng = row.lng ? parseFloat(row.lng) : null;
    
    records.push({
      city: row.city.toLowerCase().trim().replace(/[^a-z0-9-]/g, "-"),
      name: row.name.trim(),
      tier: row.tier.toLowerCase(),
      location: row.location ? row.location.trim() : "",
      contact: row.contact ? row.contact.trim() : "",
      rooms: rooms,
      rate: rate,
      ratePeak: ratePeak,
      rateOff: rateOff,
      photo: row.photo ? row.photo.trim() : "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400",
      lat: lat,
      lng: lng,
      discountNote: row.discountNote ? row.discountNote.trim() : "Welcome offer",
      addedAt: Date.now()
    });
  })
  .on("end", () => {
    if (records.length === 0) {
      log(colors.red, "❌ No valid hotel records found in CSV");
      process.exit(1);
    }
    
    log(colors.cyan, `\n📊 Parsed ${records.length} hotel(s) from ${INPUT_FILE}`);
    log(colors.gray, "Sample record:", JSON.stringify(records[0], null, 2));
    
    uploadToFirebase();
  })
  .on("error", (err) => {
    log(colors.red, "❌ CSV parse error:", err.message);
    process.exit(1);
  });

function uploadToFirebase() {
  log(colors.cyan, `\n🚀 Uploading ${records.length} hotel(s) to Firebase…\n`);
  
  const uploads = records.map((h, idx) => {
    return new Promise((resolve) => {
      const payload = {
        name: h.name,
        tier: h.tier,
        rate: h.rate,
        ratePeak: h.ratePeak,
        rateOff: h.rateOff,
        rooms: h.rooms,
        contact: h.contact,
        location: h.location,
        photo: h.photo,
        lat: h.lat,
        lng: h.lng,
        discountNote: h.discountNote,
        addedAt: h.addedAt
      };
      
      // Remove null/undefined values
      Object.keys(payload).forEach(k => payload[k] === null || payload[k] === undefined ? delete payload[k] : 0);
      
      const url = `${DB}/hotels/${h.city}.json`;
      
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then(data => {
          log(colors.green, `✓ [${idx + 1}/${records.length}] ${h.name} (${h.city}/${h.tier}) → ${data.name}`);
          resolve(true);
        })
        .catch(err => {
          log(colors.red, `✗ [${idx + 1}/${records.length}] ${h.name}: ${err.message}`);
          resolve(false);
        });
    });
  });
  
  Promise.all(uploads).then(results => {
    const success = results.filter(r => r).length;
    log(colors.cyan, `\n✅ Uploaded ${success}/${records.length} hotels`);
    if (success === records.length) {
      log(colors.green, "🎉 All records pushed to Firebase!");
    } else {
      log(colors.yellow, `⚠️  ${records.length - success} failed (check network/Firebase rules)`);
    }
  });
}
