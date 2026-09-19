/* ============================================================
   Partner Desk settings. This is the ONLY file you need to edit.
   Used by agent-partner.html and agent-admin.html.
   ============================================================ */
window.PARTNER_CONFIG = {
  firebase: {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    appId: "YOUR_APP_ID"
  },
  collections: { packages: "packages", agents: "agents", rates: "agent_rates", applications: "agent_applications" },
  gateways: ["Delhi", "Chandigarh", "Amritsar"],
  tiers: ["Standard", "Premium"],               // match your Firebase tier names
  levels: {                                     // shown publicly AND used by the engine
    starter: { label: "Starter", pct: 10, note: "Every newly approved partner" },
    regular: { label: "Regular", pct: 12, note: "After 5 confirmed bookings" },
    elite:   { label: "Elite",   pct: 15, note: "After 15 confirmed bookings" }
  },
  priceNote: "Public price is the price shown to customers on himachalexplorer.in for the selected start city and tier. Your price is the public price minus your commission.",
  siteUrl: "https://himachalexplorer.in",
  whatsappNumber: ""                           // YOUR WhatsApp, country code first, digits only: "91XXXXXXXXXX"
};
