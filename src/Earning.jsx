import { C, mono, fmt } from "./theme";
import { EARNINGS } from "./data";
import { Card, CardHeader, Btn, Badge, PlateBadge, KpiCard } from "./components";

const Earning = () => {
  const total = EARNINGS.reduce((s, e) => s + e.total, 0);
  const locked = EARNINGS.filter(e => e.locked).reduce((s, e) => s + e.total, 0);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>Actual Earnings</div>
          <div style={{ fontSize: 11, color: C.textMuted }}>Auto-fed from completed bookings · Locked records are non-editable</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn small>⬇ Export</Btn>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 16 }}>
        <KpiCard label="Total Earned (Jun)" value={fmt(total)}  sub="All bookings" accent={C.teal}  badge="6 records" badgeColor={C.teal} badgeBg={C.tealFaint} />
        <KpiCard label="Locked & Confirmed" value={fmt(locked)} sub="3 locked records" accent={C.green} badge="Audit-safe" badgeColor={C.green} badgeBg={C.greenFaint} />
        <KpiCard label="Pending Lock"       value={fmt(total - locked)} sub="3 active bookings" accent={C.amber} badge="Awaiting completion" badgeColor={C.amber} badgeBg={C.amberFaint} />
      </div>

      <Card>
        <CardHeader title="Earnings Records — June 2026" subtitle="Records auto-generated from bookings on completion" />
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: C.bg }}>
              {["Ref","Booking","Car","Customer","Period","Days","Rate/Day","Total","Status"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "9px 12px", fontSize: 10, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.5, borderBottom: `1px solid ${C.border}`, whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {EARNINGS.map(e => (
              <tr key={e.id} style={{ borderBottom: `1px solid ${C.border}`, background: e.locked ? C.greenFaint + "55" : "transparent" }}>
                <td style={{ padding: "11px 12px", ...mono, fontSize: 11, fontWeight: 700, color: C.navyMid }}>{e.id}</td>
                <td style={{ padding: "11px 12px", ...mono, fontSize: 11, color: C.textMuted }}>{e.bookingId}</td>
                <td style={{ padding: "11px 12px" }}><PlateBadge plate={e.plate} small /></td>
                <td style={{ padding: "11px 12px", fontSize: 12, fontWeight: 600 }}>{e.customer}</td>
                <td style={{ padding: "11px 12px", fontSize: 11, color: C.textSec, whiteSpace: "nowrap" }}>{e.start} → {e.end}</td>
                <td style={{ padding: "11px 12px", ...mono, fontSize: 11, textAlign: "center" }}>{e.days}</td>
                <td style={{ padding: "11px 12px", ...mono, fontSize: 11 }}>${e.rate}/d</td>
                <td style={{ padding: "11px 12px", ...mono, fontSize: 13, fontWeight: 700, color: C.green }}>{fmt(e.total)}</td>
                <td style={{ padding: "11px 12px" }}>
                  {e.locked
                    ? <Badge color={C.green} bg={C.greenFaint}>🔒 Locked</Badge>
                    : <Badge color={C.amber} bg={C.amberFaint}>⏳ Pending</Badge>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: "12px 18px", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "flex-end", gap: 24 }}>
          <div style={{ fontSize: 11, color: C.textMuted }}>Total: <span style={{ ...mono, fontWeight: 700, color: C.green, fontSize: 14 }}>{fmt(total)}</span></div>
        </div>
      </Card>

      <div style={{ marginTop: 12, padding: 12, background: C.amberFaint, borderRadius: 8, borderLeft: `3px solid ${C.amber}`, fontSize: 11, color: C.textMuted }}>
        <span style={{ fontWeight: 700, color: C.amber }}>Immutability Rule:</span> Once a booking is marked Completed and the earning record is locked, it cannot be edited or deleted by any user. This ensures financial audit integrity.
      </div>
    </div>
  );
};

export default Earning;