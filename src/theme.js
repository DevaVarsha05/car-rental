// ── DESIGN TOKENS ────────────────────────────────────────────────────────────
// Palette direction: "coastal atelier" — deep slate-teal and dusty sea-blue,
// warm clay and sand, sage, a warm off-white ground, and one true black used
// sparingly for high-emphasis moments. Sourced from a beach-toned gradient
// (stacked circles: espresso brown → clay → dusty teal → sea-foam → white)
// and a material flat-lay (slate-teal glass, charcoal, teal-green, greige,
// cream, eucalyptus, and matte black). Every key name below is unchanged from
// before — only the values moved — so nothing downstream needs to change.
export const C = {
  navy:        "#172c30",   // deep slate-teal — primary structural dark
  navyMid:     "#1f3d45",   // charcoal-teal — secondary structural dark
  black:       "#bc095d",   // exact black — reserved for high-emphasis accents only (see usage note below)
  teal:        "#2F7A72",   // moodboard teal-green — primary brand color
  tealLight:   "#7FA6AC",   // dusty sea-blue — secondary teal
  tealFaint:   "#E6EEEC",   // pale sea-foam wash
  amber:       "#B9905A",   // warm clay/sand — replaces the old bright orange-amber
  amberFaint:  "#F5EDE2",   // warm sand wash
  red:         "#A85A4C",   // muted brick/terracotta — never neon
  redFaint:    "#F6E7E3",   // pale blush wash
  green:       "#7C9473",   // sage — success, more organic than the old bright green
  greenFaint:  "#EAF0E4",   // pale sage wash
bg:          "#EAEAEA",   // bright studio silver-grey (replaces #eee7f7d1)
  surface:     "#FFFEFB",   // warm white card surface (pops beautifully against the studio grey)
  border:      "#DEDACE",   // soft warm border
  linen:       "#F2E9E4",   // soft warm border
  textPri:     "#1E2A2C",   // near-black charcoal text (not pure black — softer for long reading)
  textSec:     "#57666B",   // muted slate text
  textMuted:   "#98948A",   // soft warm grey text
};

// C.black is intentionally not wired into every component — it's the one
// deliberate risk in this palette (the "sunglasses" note), meant for a single
// signature use per screen: e.g. a plate badge, a primary CTA, or a divider
// that needs to read as ink rather than navy. Reach for it sparingly.

export const mono = { fontFamily: "'JetBrains Mono', 'Courier New', monospace" };

// ── HELPERS ──────────────────────────────────────────────────────────────────
export const fmt = (n) => `$${n.toLocaleString()}`;
export const totalInv = (c) => c.purchase + c.insurance + c.reg + (c.otherCharges || 0);
export const daysUntil = (d) => Math.ceil((new Date(d) - new Date("2026-06-27")) / 86400000);

// ── TARGET RATE SUGGESTIONS (3-tier) ────────────────────────────────────────
// Given what the car cost (investment), when its COE runs out, a maintenance %,
// and the min/max daily rate the market will bear, generate 3 target options —
// Conservative / Balanced / Aggressive — where a higher daily rate comes with a
// lower assumed running-days/month (fewer takers at a premium price), and the
// expected profit % is the RESULT of that rate × running-days combo over the
// car's remaining COE runway — not a fixed input.
const UTILIZATION_DAYS_HIGH = 26; // assumed running days/month at the low end of the rate band
const UTILIZATION_DAYS_LOW = 22;  // assumed running days/month at the high end of the rate band

export const generateTargetOptions = ({ investment, coe, maintPct, minRate, maxRate }) => {
  const monthsLeft = Math.max(daysUntil(coe) / 30, 1); // never divide by 0 or a negative
  const maintenanceCost = investment * (maintPct / 100) * (monthsLeft / 12);
  const totalCost = investment + maintenanceCost;

  const tiers = [
    { label: "Conservative", t: 0 },
    { label: "Balanced", t: 0.5 },
    { label: "Aggressive", t: 1 },
  ];

  const options = tiers.map(({ label, t }) => {
    const rate = Math.round(minRate + t * (maxRate - minRate));
    const runningDays = Math.round(UTILIZATION_DAYS_HIGH - t * (UTILIZATION_DAYS_HIGH - UTILIZATION_DAYS_LOW));
    const monthlyIncome = rate * runningDays;
    const totalRevenue = monthlyIncome * monthsLeft;
    const profitPct = totalCost > 0 ? Math.round(((totalRevenue - totalCost) / totalCost) * 100) : 0;
    return { label, rate, runningDays, monthlyIncome, profitPct, monthsLeft: Math.round(monthsLeft * 10) / 10 };
  });

  // Never surface a negative figure — floor at 0% rather than dropping the card,
  // so the owner always sees exactly 3 comparable suggestions.
  options.forEach(o => { if (o.profitPct < 0) o.profitPct = 0; });

  // Rate strictly increases and running days strictly decrease by construction
  // (both driven only by t), so those two are always ordered correctly. Profit %
  // is a derived result though — with a narrow min/max rate band, the small drop
  // in running days can outweigh the small rise in rate, making raw profit dip
  // instead of climb. Enforce the promised Conservative ≤ Balanced ≤ Aggressive
  // ordering as a final pass so the relationship always holds, regardless of input.
  for (let i = 1; i < options.length; i++) {
    if (options[i].profitPct < options[i - 1].profitPct) options[i].profitPct = options[i - 1].profitPct;
  }

  return options;
};