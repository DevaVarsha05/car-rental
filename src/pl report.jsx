import { useState } from "react";
import { C, mono, fmt, totalInv } from "./theme";
import { FLEET, EARNINGS, EXPENSES, BOOKINGS, MONTHS } from "./data";
import { Card, CardHeader, Btn, StatusTag, PlateBadge, KpiCard, MiniBar, PLRow } from "./components";

const inMonth = (dateStr, month) => dateStr.startsWith(month);

const PlReport = () => {
  const [view, setView] = useState("fleet");
  const [selectedCar, setSelectedCar] = useState(FLEET[0].plate);
  const [month, setMonth] = useState(MONTHS[MONTHS.length - 1].value);
  const monthLabel = MONTHS.find(m => m.value === month)?.label || "";

  const monthEarnings = EARNINGS.filter(e => inMonth(e.start, month));
  const monthExpenses = EXPENSES.filter(e => inMonth(e.date, month));
  const monthBookings = BOOKINGS.filter(b => inMonth(b.start, month));

  const carEarnings = (plate) => monthEarnings.filter(e => e.plate === plate).reduce((s, e) => s + e.total, 0);
  const carExpenses = (plate) => monthExpenses.filter(e => e.plate === plate).reduce((s, e) => s + e.amount, 0);

  const fleetIncome = monthEarnings.reduce((s, e) => s + e.total, 0);
  const fleetExpense = monthExpenses.reduce((s, e) => s + e.amount, 0);
  const fleetNet = fleetIncome - fleetExpense;

  const MonthSelect = (
    <select value={month} onChange={e => setMonth(e.target.value)}
      style={{ padding: "8px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontFamily: "inherit", fontSize: 13, color: C.textPri, background: C.surface, outline: "none" }}>
      {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
    </select>
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>P&L Reports</div>
          <div style={{ fontSize: 11, color: C.textMuted }}>Profit & Loss by car or fleet level</div>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {MonthSelect}
          {["fleet","per-car"].map(v => (
            <button key={v} onClick={() => setView(v)} style={{
              padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer",
              border: `1px solid ${view === v ? C.teal : C.border}`,
              background: view === v ? C.teal : C.surface,
              color: view === v ? "#fff" : C.textSec, fontFamily: "inherit",
            }}>{v === "fleet" ? "Fleet Level" : "Per Car"}</button>
          ))}
          <Btn small>⬇ Export</Btn>
        </div>
      </div>

      {view === "fleet" ? (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 16 }}>
            <KpiCard label={`${monthLabel} Income`}   value={fmt(fleetIncome)}   sub="All completed & active" accent={C.teal}  badge={`${monthEarnings.length} bookings`} badgeColor={C.teal} badgeBg={C.tealFaint} />
            <KpiCard label={`${monthLabel} Expenses`} value={fmt(fleetExpense)}  sub="All categories"         accent={C.red}   badge={`${monthExpenses.length} items`} badgeColor={C.red} badgeBg={C.redFaint} />
            <KpiCard label="Net P&L"       value={fmt(fleetNet)}      sub="Income – Expenses"      accent={C.green} badge={fleetNet >= 0 ? "Profitable" : "Loss"} badgeColor={C.green} badgeBg={C.greenFaint} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Card>
              <CardHeader title={`Fleet P&L — ${monthLabel}`} />
              <div style={{ padding: 16 }}>
                <PLRow label="Total Rental Income"   value={`+${fmt(fleetIncome)}`}   positive={true} />
                <PLRow label="Total Expenses"        value={`−${fmt(fleetExpense)}`}  positive={false} />
                <PLRow label={`Net P&L — ${monthLabel}`} value={`${fleetNet >= 0 ? "+" : "−"}${fmt(Math.abs(fleetNet))}`} positive={fleetNet >= 0} bold divider />
                <div style={{ marginTop: 12 }}>
                  <PLRow label="YTD Income"    value="+$82,140" positive={true} />
                  <PLRow label="YTD Expenses"  value="−$19,990" positive={false} />
                  <PLRow label="YTD Net P&L"   value="+$62,150" positive={true} bold divider />
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader title={`Per-Car Income — ${monthLabel}`} />
              <div style={{ padding: 16 }}>
                {FLEET.slice(0, 6).map(c => {
                  const inc = carEarnings(c.plate);
                  const exp = carExpenses(c.plate);
                  const net = inc - exp;
                  return (
                    <div key={c.plate} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
                      <PlateBadge plate={c.plate} small />
                      <div style={{ flex: 1, fontSize: 11, color: C.textMuted }}>{c.make} {c.model}</div>
                      <div style={{ ...mono, fontSize: 11, color: C.teal, minWidth: 55 }}>{inc ? fmt(inc) : "–"}</div>
                      <div style={{ ...mono, fontSize: 11, color: C.red, minWidth: 55 }}>{exp ? `−${fmt(exp)}` : "–"}</div>
                      <div style={{ ...mono, fontSize: 12, fontWeight: 700, color: net >= 0 ? C.green : C.red, minWidth: 55 }}>{net ? (net > 0 ? "+" : "") + fmt(net) : "–"}</div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: 16 }}>
            <select value={selectedCar} onChange={e => setSelectedCar(e.target.value)}
              style={{ padding: "8px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontFamily: "inherit", fontSize: 13, color: C.textPri, background: C.surface, outline: "none" }}>
              {FLEET.map(c => <option key={c.plate} value={c.plate}>{c.plate} — {c.make} {c.model}</option>)}
            </select>
          </div>
          {(() => {
            const car = FLEET.find(c => c.plate === selectedCar);
            const inc = carEarnings(selectedCar);
            const exp = carExpenses(selectedCar);
            const net = inc - exp;
            const inv = totalInv(car);
            const totalCarEarnings = EARNINGS.filter(e => e.plate === selectedCar).reduce((s, e) => s + e.total, 0);
            const recovery = Math.round((totalCarEarnings / inv) * 100 * 2.5);
            const bookings = monthBookings.filter(b => b.plate === selectedCar);
            return (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Card>
                  <CardHeader title={`P&L — ${car.make} ${car.model}`} subtitle={selectedCar}
                    right={<StatusTag status={car.status} />} />
                  <div style={{ padding: 16 }}>
                    <PLRow label={`Rental Income (${monthLabel})`}   value={inc ? `+${fmt(inc)}` : "–"} positive={inc > 0} />
                    <PLRow label={`Expenses (${monthLabel})`}        value={exp ? `−${fmt(exp)}` : "–"} positive={exp === 0} />
                    <PLRow label={`Net P&L (${monthLabel})`}         value={net ? (net > 0 ? "+" : "") + fmt(net) : "–"} positive={net >= 0} bold divider />
                    <div style={{ marginTop: 12 }}>
                      <PLRow label="Total Investment"    value={fmt(inv)} />
                      <PLRow label="Total Recovered"     value={fmt(Math.round(inv * recovery / 100))} positive={true} />
                      <PLRow label="Recovery Progress"   value={`${recovery}%`} bold divider />
                    </div>
                    <div style={{ marginTop: 12 }}>
                      <MiniBar pct={recovery} color={recovery >= 70 ? C.green : recovery >= 40 ? C.teal : C.amber} />
                    </div>
                  </div>
                </Card>
                <Card>
                  <CardHeader title="Booking History" subtitle={`${selectedCar} · ${monthLabel}`} />
                  <div style={{ padding: 16 }}>
                    {bookings.length === 0 && <div style={{ color: C.textMuted, fontSize: 12 }}>No bookings recorded for {monthLabel}.</div>}
                    {bookings.map(b => {
                      const days = Math.round((new Date(b.end) - new Date(b.start)) / 86400000);
                      return (
                        <div key={b.id} style={{ padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>{b.customer}</div>
                            <div style={{ ...mono, fontSize: 12, fontWeight: 700, color: C.teal }}>{fmt(b.rate * days)}</div>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
                            <div style={{ fontSize: 10.5, color: C.textMuted }}>{b.start} → {b.end} · {days} days @ ${b.rate}/d</div>
                            <StatusTag status={b.status} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default PlReport;