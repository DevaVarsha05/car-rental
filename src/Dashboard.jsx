import { C, mono, fmt, totalInv, daysUntil } from "./theme";
import { FLEET, BOOKINGS, ALERTS } from "./data";
import { Badge, StatusTag, PlateBadge, Card, CardHeader, Btn, KpiCard, MiniBar, Ring, PLRow } from "./components";

const Dashboard = () => {
  const months = ["Jan","Feb","Mar","Apr","May","Jun"];
  const actual  = [68,64,82,88,76,66];
  const targets = [80,80,80,80,80,80];

  return (
    <div>
      {/* KPI Strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12, marginBottom: 20 }}>
        <KpiCard label="Total Fleet"    value="8"       sub="Cars registered"    badge="↑ 1 this month" badgeColor={C.green} badgeBg={C.greenFaint} accent={C.teal} />
        <KpiCard label="June Earnings"  value="$14,820" sub="Target: $18,000"    badge="82% of target"  badgeColor={C.amber} badgeBg={C.amberFaint} accent={C.green} />
        <KpiCard label="Active Rentals" value="5"       sub="3 cars available"   badge="63% occupancy"  badgeColor={C.green} badgeBg={C.greenFaint} accent={C.navyMid} />
        <KpiCard label="June Expenses"  value="$3,240"  sub="Budget: $5,625"     badge="Under budget"   badgeColor={C.green} badgeBg={C.greenFaint} accent={C.amber} />
        <KpiCard label="COE Alerts"     value="2"       sub="Expiring soon"      badge="Action needed"  badgeColor={C.red}   badgeBg={C.redFaint}   accent={C.red} />
      </div>

      {/* Row 1 */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* Monthly Chart */}
        <Card>
          <CardHeader title="Monthly Earnings vs Target" subtitle="Jan – Jun 2026 · All Cars"
            right={<Badge>YTD: $82,140</Badge>} />
          <div style={{ padding: "16px 18px" }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120, marginBottom: 8 }}>
              {months.map((m, i) => (
                <div key={m} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                  <div style={{ display: "flex", gap: 2, alignItems: "flex-end", width: "100%", height: 100 }}>
                    <div style={{ flex: 1, height: `${targets[i]}%`, background: C.navyMid, opacity: 0.2, borderRadius: "3px 3px 0 0" }} />
                    <div style={{ flex: 1, height: `${actual[i]}%`, background: i === 5 ? C.tealLight : C.teal, borderRadius: "3px 3px 0 0" }} />
                  </div>
                  <div style={{ fontSize: 9, color: i === 5 ? C.teal : C.textMuted, fontWeight: i === 5 ? 700 : 400 }}>{m}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: C.textMuted }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: C.teal }} /> Actual
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: C.textMuted }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: C.navyMid, opacity: 0.4 }} /> Target
              </div>
            </div>
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 12, display: "flex", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 10, color: C.textMuted }}>YTD Net P&L</div>
                <div style={{ ...mono, fontSize: 14, fontWeight: 700, color: C.green }}>+$62,150</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 10, color: C.textMuted }}>Fleet Recovery</div>
                <div style={{ ...mono, fontSize: 14, fontWeight: 700, color: C.navy }}>41%</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Active Bookings */}
        <Card>
          <CardHeader title="Active Bookings" subtitle="Today, 27 Jun 2026" right={<Badge>5 active</Badge>} />
          <div style={{ padding: "8px 18px 16px" }}>
            {BOOKINGS.filter(b => b.status !== "Completed").slice(0, 5).map(b => (
              <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: `1px solid ${C.border}` }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", flexShrink: 0,
                  background: b.status === "Active" ? C.teal : b.status === "Ending Today" ? C.amber : C.navyMid }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.navy, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b.customer}</div>
                  <div style={{ fontSize: 10, color: C.textMuted, marginTop: 1, display: "flex", alignItems: "center", gap: 4 }}>
                    <PlateBadge plate={b.plate} small /> {b.start.slice(5)} – {b.end.slice(5)}
                  </div>
                </div>
                <div style={{ ...mono, fontSize: 12, fontWeight: 700, color: C.teal, flexShrink: 0 }}>{fmt(b.rate * ((new Date(b.end)-new Date(b.start))/86400000))}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Alerts */}
        <Card>
          <CardHeader title="Alerts" subtitle="Requires attention"
            right={<Badge color={C.red} bg={C.redFaint}>3 active</Badge>} />
          <div style={{ padding: "8px 18px 16px" }}>
            {ALERTS.slice(0, 4).map(a => (
              <div key={a.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 18, flexShrink: 0 }}>{a.type === "coe" ? "⚠️" : a.type === "return" ? "🔔" : "📋"}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>
                    {a.type === "coe" ? `COE Expiry — ${a.plate}` : a.type === "return" ? "Return Today" : "Booking"}
                  </div>
                  <div style={{ fontSize: 10.5, color: C.textMuted, marginTop: 2 }}>{a.msg}</div>
                </div>
                <div style={{ ...mono, fontSize: 11, fontWeight: 700, padding: "3px 7px", borderRadius: 6, flexShrink: 0, alignSelf: "center",
                  background: a.urgent ? C.redFaint : C.amberFaint, color: a.urgent ? C.red : C.amber }}>
                  {a.days === 0 ? "Today" : `${a.days}d`}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Row 2: Fleet Table + Recovery Rings */}
      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 16, marginBottom: 16 }}>
        <Card>
          <CardHeader title="Fleet Overview" subtitle="All 8 registered cars" right={<Btn small>View Fleet →</Btn>} />
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: C.bg }}>
                {["Plate","Car","Status","Investment","COE Expiry","Jun Earned","Recovery"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: 10, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.6, borderBottom: `1px solid ${C.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FLEET.slice(0, 5).map((c, i) => {
                const inv = totalInv(c);
                const recovery = [68,52,38,77,91][i];
                const d = daysUntil(c.coe);
                return (
                  <tr key={c.plate} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: "10px 12px" }}><PlateBadge plate={c.plate} /></td>
                    <td style={{ padding: "10px 12px" }}>
                      <div style={{ fontSize: 12, fontWeight: 600 }}>{c.make} {c.model}</div>
                      <div style={{ fontSize: 10, color: C.textMuted }}>{c.year} · {c.color}</div>
                    </td>
                    <td style={{ padding: "10px 12px" }}><StatusTag status={c.status} /></td>
                    <td style={{ padding: "10px 12px", ...mono, fontSize: 11 }}>{fmt(inv)}</td>
                    <td style={{ padding: "10px 12px", fontSize: 11, color: d < 30 ? C.red : d < 90 ? C.amber : C.textMuted, fontWeight: d < 90 ? 700 : 400 }}>
                      {c.coe.slice(0,7)} {d < 30 ? "⚠" : d < 90 ? "⚡" : ""}
                    </td>
                    <td style={{ padding: "10px 12px", ...mono, fontSize: 11, color: C.green }}>{fmt([2100,1875,2500,1650,980][i])}</td>
                    <td style={{ padding: "10px 12px", minWidth: 100 }}><MiniBar pct={recovery} color={recovery >= 70 ? C.green : recovery >= 40 ? C.teal : C.amber} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div style={{ padding: "10px 18px", borderTop: `1px solid ${C.border}`, fontSize: 11, color: C.textMuted }}>
            Showing 5 of 8 cars
          </div>
        </Card>

        <Card>
          <CardHeader title="Investment Recovery" subtitle="% of total cost recovered per car" />
          <div style={{ padding: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
              <Ring pct={68} color={C.teal}  plate="SBA 1234 X" model="Toyota Corolla" note="COE: 18 days" noteColor={C.red} />
              <Ring pct={52} color={C.teal}  plate="SBC 5678 Y" model="Honda Civic"    note="Est. Mar 2027" />
              <Ring pct={38} color={C.amber} plate="SBD 9012 Z" model="Mazda 3"        note="Est. Aug 2028" />
              <Ring pct={91} color={C.green} plate="SBF 7890 B" model="Toyota Vios"    note="Nearly done!" noteColor={C.green} />
            </div>
            <div style={{ background: C.bg, borderRadius: 8, padding: 12 }}>
              <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 6 }}>Fleet Total Recovery</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ flex: 1, height: 10, background: C.border, borderRadius: 5, overflow: "hidden" }}>
                  <div style={{ width: "41%", height: "100%", background: `linear-gradient(90deg, ${C.teal}, ${C.tealLight})`, borderRadius: 5 }} />
                </div>
                <span style={{ ...mono, fontSize: 13, fontWeight: 700, color: C.navy }}>41%</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 10, color: C.textMuted }}>
                <span>Recovered: <b style={{ color: C.teal }}>$82,140</b></span>
                <span>Total: <b style={{ color: C.navy }}>$200,400</b></span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Row 3: Target vs Actual + Expenses + P&L */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 16 }}>
        <Card>
          <CardHeader title="Target vs Actual — June" subtitle="Per car rental performance"
            right={<div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: C.textMuted }}><div style={{ width: 10, height: 3, background: C.amber, borderRadius: 2 }} />Target</div>} />
          <div style={{ padding: 16 }}>
            {[
              { plate:"SBA 1234", model:"Corolla", pct:84, target:83.3 },
              { plate:"SBC 5678", model:"Civic",   pct:63, target:73.3 },
              { plate:"SBD 9012", model:"Mazda 3", pct:89, target:93.3 },
              { plate:"SBE 3456", model:"Sylphy",  pct:55, target:80 },
              { plate:"SBF 7890", model:"Vios",    pct:33, target:66.7 },
            ].map(r => (
              <div key={r.plate} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <div style={{ width: 70 }}>
                  <div style={{ ...mono, fontSize: 11, fontWeight: 700, color: C.navy }}>{r.plate}</div>
                  <div style={{ fontSize: 10, color: C.textMuted }}>{r.model}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ position: "relative", height: 8, background: C.bg, borderRadius: 4, overflow: "visible" }}>
                    <div style={{ width: `${r.pct}%`, height: "100%", borderRadius: 4,
                      background: r.pct >= 80 ? C.green : r.pct >= 60 ? C.teal : r.pct >= 40 ? C.amber : C.red }} />
                    <div style={{ position: "absolute", top: -2, bottom: -2, left: `${r.target}%`, width: 2, background: C.amber }} />
                  </div>
                </div>
                <div style={{ ...mono, fontSize: 11, fontWeight: 700, width: 38, textAlign: "right",
                  color: r.pct >= 80 ? C.green : r.pct >= 60 ? C.teal : r.pct >= 40 ? C.amber : C.red }}>{r.pct}%</div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Expense Breakdown" subtitle="June 2026" right={<Badge>$3,240</Badge>} />
          <div style={{ padding: 16 }}>
            <svg width="100%" height={110} viewBox="0 0 110 110" style={{ display: "block", margin: "0 auto 12px" }}>
              {[
                { pct:38, color:C.teal },
                { pct:25, color:C.navyMid },
                { pct:18, color:C.amber },
                { pct:12, color:C.green },
                { pct:7,  color:C.textMuted },
              ].reduce((acc, seg, i, arr) => {
                const circ = 2 * Math.PI * 38;
                const offset = -acc.offset;
                const dash = circ * seg.pct / 100;
                acc.els.push(
                  <circle key={i} cx={55} cy={55} r={38} fill="none" stroke={seg.color} strokeWidth={18}
                    strokeDasharray={`${dash} ${circ}`} strokeDashoffset={offset} transform="rotate(-90 55 55)" />
                );
                acc.offset -= dash;
                return acc;
              }, { els: [], offset: 0 }).els}
              <circle cx={55} cy={55} r={27} fill="white" />
              <text x={55} y={52} textAnchor="middle" fontFamily="'Courier New',monospace" fontSize={9} fontWeight={700} fill={C.navy}>$3,240</text>
              <text x={55} y={62} textAnchor="middle" fontFamily="inherit" fontSize={7} fill={C.textMuted}>total</text>
            </svg>
            {[
              { label:"Routine Service",  pct:38, color:C.teal,    amt:"$1,231" },
              { label:"Body Repair",      pct:25, color:C.navyMid, amt:"$810" },
              { label:"Insurance",        pct:18, color:C.amber,   amt:"$583" },
              { label:"Road Tax",         pct:12, color:C.green,   amt:"$389" },
              { label:"Other",            pct:7,  color:C.textMuted,amt:"$227" },
            ].map(e => (
              <div key={e.label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                <div style={{ width: 9, height: 9, borderRadius: 2, background: e.color, flexShrink: 0 }} />
                <div style={{ fontSize: 11, color: C.textSec, flex: 1 }}>{e.label}</div>
                <div style={{ width: 60, height: 4, background: C.bg, borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ width: `${e.pct}%`, height: "100%", background: e.color, borderRadius: 2 }} />
                </div>
                <div style={{ ...mono, fontSize: 11, fontWeight: 600, minWidth: 40, textAlign: "right" }}>{e.amt}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="P&L Summary" subtitle="June 2026 · Fleet" />
          <div style={{ padding: 16 }}>
            <PLRow label="Total Rental Income" value="+$14,820" positive={true} />
            <PLRow label="Total Expenses"       value="−$3,240"  positive={false} />
            <PLRow label="Net P&L — June"       value="+$11,580" positive={true} bold divider />
            <div style={{ marginTop: 12, padding: 10, background: C.greenFaint, borderRadius: 8, borderLeft: `3px solid ${C.green}` }}>
              <div style={{ fontSize: 10, color: C.green, fontWeight: 700 }}>↑ 18% vs May 2026</div>
              <div style={{ fontSize: 10, color: C.textMuted, marginTop: 2 }}>Best performing month in Q2</div>
            </div>
            <div style={{ marginTop: 10, padding: 10, background: C.bg, borderRadius: 8 }}>
              <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 4, fontWeight: 600 }}>YTD Progress</div>
              <PLRow label="Total Income YTD"   value="$82,140" />
              <PLRow label="Total Expense YTD"  value="$19,990" positive={false} />
              <PLRow label="Net YTD"            value="+$62,150" positive={true} bold divider />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;