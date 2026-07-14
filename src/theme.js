// ── DESIGN TOKENS ────────────────────────────────────────────────────────────
export const C = {
  navy:        "#0F2545",
  navyMid:     "#1B3A6B",
  teal:        "#0A8C7E",
  tealLight:   "#12B09F",
  tealFaint:   "#E6F7F5",
  amber:       "#E8921A",
  amberFaint:  "#FEF3E2",
  red:         "#D64045",
  redFaint:    "#FDEAEA",
  green:       "#2E9E5B",
  greenFaint:  "#E8F7EE",
  bg:          "#F0F4F8",
  surface:     "#FFFFFF",
  border:      "#DDE4EE",
  textPri:     "#0F2545",
  textSec:     "#4A5E7A",
  textMuted:   "#8A9BB5",
};

export const mono = { fontFamily: "'Courier New', monospace" };

// ── HELPERS ──────────────────────────────────────────────────────────────────
export const fmt = (n) => `$${n.toLocaleString()}`;
export const totalInv = (c) => c.purchase + c.insurance + c.reg;
export const daysUntil = (d) => Math.ceil((new Date(d) - new Date("2026-06-27")) / 86400000);