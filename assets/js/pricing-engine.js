/**
 * pricing-engine.js — Himachal Explorer SINGLE SOURCE OF TRUTH for package cost.
 * Central pricing controls are stored in Firebase at /pricing_control.
 * All public/package/booking calculators use this engine.
 */
(function (global) {
  'use strict';

  const DB_BASE = 'https://garg-enterprise-default-rtdb.asia-southeast1.firebasedatabase.app';
  const CONFIG_PATH = '/pricing_control.json';
  const CACHE_KEY = 'hx_pricing_control_cache_v1';

  const VEHICLES = [
    { name: 'Sedan', cap: 4, offpeak: 3200, peak: 5300 },
    { name: 'SUV/Innova', cap: 7, offpeak: 5200, peak: 6600 },
    { name: 'Tempo Traveller', cap: 14, offpeak: 5600, peak: 8800 }
  ];
  const DRIVER_HALT_PER_NIGHT = 50;
  const TOLL_PER_VEHICLE = 350;
  const HOTEL_TIER_RATE = { budget: 1480, premium: 2020, luxury: 3360 };
  const SERVICE_FEE = 0.10;
  const MARGIN = 0.25;
  const PEAK_MONTHS = new Set([5, 6, 12, 1]);            // hotel season (+15% hotel rate)
  // Vehicle day-rates follow the taxi-service.html rate card:
  // peak = May-June & Sep-Oct. Change this one line to change transport season.
  const TRANSPORT_PEAK_MONTHS = new Set([5, 6, 9, 10]);

  const DEFAULT_CONTROL = {
    version: 1,
    enabled: true,
    global: { percent: 0, fixed: 0 },
    transport: { percent: 0, fixed: 0 },
    hotel: { percent: 0, fixed: 0 },
    driverTolls: { percent: 0, fixed: 0 },
    serviceFee: { rate: SERVICE_FEE },
    margin: { rate: MARGIN },
    tiers: {
      budget: { percent: 0, fixed: 0 },
      premium: { percent: 0, fixed: 0 },
      luxury: { percent: 0, fixed: 0 }
    },
    packages: {}
  };

  let control = readCache() || clone(DEFAULT_CONTROL);
  let readyPromise = null;

  function clone(x) { return JSON.parse(JSON.stringify(x)); }
  function num(v, fallback) { const n = Number(v); return Number.isFinite(n) ? n : fallback; }
  function adjustment(obj) {
    obj = obj || {};
    return { percent: num(obj.percent, 0), fixed: num(obj.fixed, 0) };
  }
  function applyAdjustment(value, obj) {
    obj = adjustment(obj);
    return Math.max(0, value * (1 + obj.percent / 100) + obj.fixed);
  }
  function packageAdjustment(pkgId) {
    return control.packages && control.packages[pkgId] ? adjustment(control.packages[pkgId]) : { percent: 0, fixed: 0 };
  }
  function readCache() {
    try {
      const raw = global.localStorage && global.localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : null;
    } catch (_) { return null; }
  }
  function writeCache(value) {
    try { global.localStorage && global.localStorage.setItem(CACHE_KEY, JSON.stringify(value)); } catch (_) {}
  }

  function normalizeControl(raw) {
    const c = clone(DEFAULT_CONTROL);
    if (!raw || typeof raw !== 'object') return c;
    c.enabled = raw.enabled !== false;
    c.global = adjustment(raw.global);
    c.transport = adjustment(raw.transport);
    c.hotel = adjustment(raw.hotel);
    c.driverTolls = adjustment(raw.driverTolls);
    c.serviceFee = { rate: Math.max(0, num(raw.serviceFee && raw.serviceFee.rate, SERVICE_FEE)) };
    c.margin = { rate: Math.max(0, num(raw.margin && raw.margin.rate, MARGIN)) };
    ['budget','premium','luxury'].forEach(t => { c.tiers[t] = adjustment(raw.tiers && raw.tiers[t]); });
    c.packages = {};
    if (raw.packages && typeof raw.packages === 'object') {
      Object.keys(raw.packages).forEach(id => { c.packages[id] = adjustment(raw.packages[id]); });
    }
    c.updatedAt = raw.updatedAt || null;
    c.updatedBy = raw.updatedBy || null;
    return c;
  }

  async function refresh() {
    try {
      const response = await fetch(DB_BASE + CONFIG_PATH + '?_=' + Date.now(), { cache: 'no-store' });
      if (!response.ok) throw new Error('pricing control request failed');
      const raw = await response.json();
      control = normalizeControl(raw || DEFAULT_CONTROL);
      writeCache(control);
      global.dispatchEvent(new CustomEvent('pricing-config-updated', { detail: clone(control) }));
    } catch (_) {
      // Cached/default controls remain active when Firebase is unavailable.
    }
    return clone(control);
  }

  function ready() {
    if (!readyPromise) readyPromise = refresh();
    return readyPromise;
  }

  function setLocalControl(next) {
    control = normalizeControl(next);
    writeCache(control);
    global.dispatchEvent(new CustomEvent('pricing-config-updated', { detail: clone(control) }));
  }

  function getControl() { return clone(control); }
  function isHotelPeakMonth(month) { return PEAK_MONTHS.has(Number(month)); }
  function isTransportPeakMonth(month) { return TRANSPORT_PEAK_MONTHS.has(Number(month)); }
  // "Peak" for display = either hotel season or transport season applies.
  function isPeakMonth(month) { return isHotelPeakMonth(month) || isTransportPeakMonth(month); }

  function cheapestFleet(pax) {
    let best = null;
    for (let ns = 0; ns <= 8; ns++) {
      for (let nsuv = 0; nsuv <= 6; nsuv++) {
        for (let nt = 0; nt <= 6; nt++) {
          const cap = ns * 4 + nsuv * 7 + nt * 14;
          if (cap < pax) continue;
          const count = ns + nsuv + nt;
          if (!count) continue;
          const dayOffpeak = ns * 3200 + nsuv * 5200 + nt * 5600;
          if (!best || dayOffpeak < best.dayOffpeak) {
            best = { ns, nsuv, nt, cap, count, dayOffpeak, dayPeak: ns * 5300 + nsuv * 6600 + nt * 8800 };
          }
        }
      }
    }
    return best;
  }

  function fleetLabel(f) {
    const parts = [];
    if (f.ns) parts.push(`${f.ns}× Sedan`);
    if (f.nsuv) parts.push(`${f.nsuv}× SUV/Innova`);
    if (f.nt) parts.push(`${f.nt}× Tempo Traveller`);
    return parts.join(' + ');
  }

  /**
   * computePrice({days,pax,tier,month,packageId})
   * packageId is optional; when supplied, its package-specific adjustment is
   * applied after the component/tier controls and before rounding.
   */
  function computePrice(opts) {
    opts = opts || {};
    const days = Math.max(1, Number(opts.days) || 1);
    const pax = Math.max(1, Number(opts.pax) || 1);
    const tier = HOTEL_TIER_RATE[opts.tier] ? opts.tier : 'budget';
    const month = opts.month != null ? Number(opts.month) : (new Date().getMonth() + 1);
    const packageId = opts.packageId || opts.id || '';
    const isHotelPeak = isHotelPeakMonth(month);
    const isTransportPeak = isTransportPeakMonth(month);
    const isPeak = isHotelPeak || isTransportPeak;   // label only
    const nights = Math.max(1, days - 1);
    const fleet = cheapestFleet(pax);

    let dayRate = isTransportPeak ? fleet.dayPeak : fleet.dayOffpeak;
    dayRate = applyAdjustment(dayRate, control.transport);
    const vehicleBase = dayRate * days;
    const driverHalt = applyAdjustment(DRIVER_HALT_PER_NIGHT * nights * fleet.count, control.driverTolls);
    const toll = applyAdjustment(TOLL_PER_VEHICLE * fleet.count, control.driverTolls);
    const vehicleTotal = vehicleBase + driverHalt + toll;
    const vehiclePP = vehicleTotal / pax;

    let hotelRate = HOTEL_TIER_RATE[tier] * (isHotelPeak ? 1.15 : 1);
    hotelRate = applyAdjustment(hotelRate, control.hotel);
    hotelRate = applyAdjustment(hotelRate, control.tiers[tier]);
    const hotelPP = hotelRate * nights;

    const subtotal = vehiclePP + hotelPP;
    const serviceFeeRate = Math.max(0, num(control.serviceFee.rate, SERVICE_FEE));
    const serviceFee = subtotal * serviceFeeRate;
    const preMargin = subtotal + serviceFee;
    const marginRate = Math.max(0, num(control.margin.rate, MARGIN));
    const marginAmt = preMargin * marginRate;
    const beforePackageAdjustment = preMargin + marginAmt;
    const globalAdjusted = applyAdjustment(beforePackageAdjustment, control.enabled ? control.global : { percent: 0, fixed: 0 });
    const packageAdjusted = applyAdjustment(globalAdjusted, packageAdjustment(packageId));
    const totalRounded = Math.round(packageAdjusted / 50) * 50;
    const groupTotal = totalRounded * pax;

    return {
      totalPP: totalRounded,
      groupTotal,
      fleet,
      fleetLabel: fleetLabel(fleet),
      breakdown: {
        days, nights, pax, tier, month, isPeak, isHotelPeak, isTransportPeak, dayRate,
        vehicleTotal,
        vehicleBase,
        driverHalt,
        toll,
        vehiclePP,
        hotelRate,
        hotelPP,
        subtotal,
        serviceFee,
        serviceFeeRate,
        marginAmt,
        marginRate,
        beforePackageAdjustment,
        globalAdjustment: adjustment(control.global),
        packageAdjustment: packageAdjustment(packageId)
      }
    };
  }

  global.PricingEngine = {
    VEHICLES, HOTEL_TIER_RATE, SERVICE_FEE, MARGIN, PEAK_MONTHS, TRANSPORT_PEAK_MONTHS,
    DB_BASE, CONFIG_PATH, DEFAULT_CONTROL,
    isPeakMonth, isHotelPeakMonth, isTransportPeakMonth, cheapestFleet, fleetLabel, computePrice,
    ready, refresh, getControl, setLocalControl
  };

  // Start the Firebase refresh immediately. Pages that calculate after their
  // package data arrives will normally use the fresh control; cached values
  // are used immediately when available for instant rendering.
  ready();
})(window);
