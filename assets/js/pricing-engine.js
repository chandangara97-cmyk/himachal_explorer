/**
 * pricing-engine.js — Himachal Explorer SINGLE SOURCE OF TRUTH for package cost.
 * ─────────────────────────────────────────────────────────────────────────
 * This is the exact formula used on /group-pricing.html. Every other page
 * that shows a per-person or group price (packages.html, package-detail.html,
 * booking.html, index.html package cards, pkg/*.html) MUST call
 * PricingEngine.computePrice() instead of maintaining its own cost math or
 * fetching a separate Firebase pricing matrix. This keeps every quote on the
 * site consistent with the public calculator — one formula, one place to
 * change it.
 *
 * Usage:
 *   const result = PricingEngine.computePrice({ days: pkg.days, pax, tier, month });
 *   result.totalPP     → rounded per-person price (₹, nearest 50)
 *   result.groupTotal  → totalPP * pax
 *   result.fleet        → { ns, nsuv, nt, cap, count, dayOffpeak, dayPeak }
 *   result.breakdown    → { vehicleTotal, driverHalt, toll, vehiclePP, hotelRate, hotelPP,
 *                           subtotal, serviceFee, marginAmt, nights, isPeak, dayRate }
 * ─────────────────────────────────────────────────────────────────────────
 */
(function (global) {
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
  const PEAK_MONTHS = new Set([5, 6, 12, 1]);

  function isPeakMonth(month) {
    return PEAK_MONTHS.has(Number(month));
  }

  // Find the cheapest vehicle combination (up to 8 sedans / 6 SUVs / 6 tempo travellers) covering `pax` seats.
  function cheapestFleet(pax) {
    let best = null;
    for (let ns = 0; ns <= 8; ns++) {
      for (let nsuv = 0; nsuv <= 6; nsuv++) {
        for (let nt = 0; nt <= 6; nt++) {
          const cap = ns * VEHICLES[0].cap + nsuv * VEHICLES[1].cap + nt * VEHICLES[2].cap;
          if (cap < pax) continue;
          const count = ns + nsuv + nt;
          if (count === 0) continue;
          const dayOffpeak = ns * VEHICLES[0].offpeak + nsuv * VEHICLES[1].offpeak + nt * VEHICLES[2].offpeak;
          if (!best || dayOffpeak < best.dayOffpeak) {
            best = {
              ns, nsuv, nt, cap, count, dayOffpeak,
              dayPeak: ns * VEHICLES[0].peak + nsuv * VEHICLES[1].peak + nt * VEHICLES[2].peak
            };
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
   * computePrice — the canonical per-person price for a package.
   * @param {{days:number, pax:number, tier:('budget'|'premium'|'luxury'), month:number}} opts
   */
  function computePrice(opts) {
    const days = Math.max(1, Number(opts.days) || 1);
    const pax = Math.max(1, Number(opts.pax) || 1);
    const tier = HOTEL_TIER_RATE[opts.tier] ? opts.tier : 'budget';
    const month = opts.month != null ? Number(opts.month) : (new Date().getMonth() + 1);
    const isPeak = isPeakMonth(month);

    const nights = Math.max(1, days - 1);
    const fleet = cheapestFleet(pax);
    const dayRate = isPeak ? fleet.dayPeak : fleet.dayOffpeak;

    const vehicleTotal = dayRate * days + DRIVER_HALT_PER_NIGHT * nights * fleet.count + TOLL_PER_VEHICLE * fleet.count;
    const vehiclePP = vehicleTotal / pax;

    const hotelRate = HOTEL_TIER_RATE[tier] * (isPeak ? 1.15 : 1);
    const hotelPP = hotelRate * nights;

    const subtotal = vehiclePP + hotelPP;
    const serviceFee = subtotal * SERVICE_FEE;
    const preMargin = subtotal + serviceFee;
    const marginAmt = preMargin * MARGIN;
    const totalPP = preMargin + marginAmt;
    const totalRounded = Math.round(totalPP / 50) * 50;
    const groupTotal = totalRounded * pax;

    return {
      totalPP: totalRounded,
      groupTotal,
      fleet,
      fleetLabel: fleetLabel(fleet),
      breakdown: {
        days, nights, pax, tier, month, isPeak,
        dayRate,
        vehicleTotal: dayRate * days,
        driverHalt: DRIVER_HALT_PER_NIGHT * nights * fleet.count,
        toll: TOLL_PER_VEHICLE * fleet.count,
        vehiclePP,
        hotelRate,
        hotelPP,
        subtotal,
        serviceFee,
        marginAmt
      }
    };
  }

  global.PricingEngine = {
    VEHICLES, HOTEL_TIER_RATE, SERVICE_FEE, MARGIN, PEAK_MONTHS,
    isPeakMonth, cheapestFleet, fleetLabel, computePrice
  };
})(window);
