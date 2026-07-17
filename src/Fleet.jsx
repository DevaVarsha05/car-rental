import { useState } from "react";
import { C, mono, fmt, totalInv, daysUntil, generateTargetOptions } from "./theme";
import { Card, CardHeader, Btn, StatusTag, PlateBadge, SectionTitle } from "./components";
import AddCarWizard from "./AddCarWizard";

// Shows the car's saved target (rate / running days / expected profit) if one has
// been set, plus a "Set Target" / "Update Target" flow that generates 3 options
// (Conservative / Balanced / Aggressive) from the car's investment, COE runway,
// maintenance %, and a min/max market rate — and saves the chosen one onto the
// car record via onSave. Rendered with key={car.plate} so its open/closed state
// resets whenever the selected car changes.
const TargetPanel = ({ car, onSave }) => {
  const inv = totalInv(car);
  const hasTarget = !!car.targetRate;
  const [editing, setEditing] = useState(false);
  const [maintPct, setMaintPct] = useState(car.maint ? Math.min(Math.max(car.maint, 5), 10) : 7.5);
  const [minRate, setMinRate] = useState(car.minRate || "");
  const [maxRate, setMaxRate] = useState(car.maxRate || "");
  const [options, setOptions] = useState(null);
  const [chosen, setChosen] = useState(null);

  const handleGenerate = () => {
    const min = parseFloat(minRate);
    const max = parseFloat(maxRate);
    if (!min || !max || min <= 0 || max <= 0) {
      alert("Please enter a valid Min and Max daily rate");
      return;
    }
    if (min > max) {
      alert("Min rate can't be more than Max rate");
      return;
    }
    setOptions(generateTargetOptions({ investment: inv, coe: car.coe, maintPct, minRate: min, maxRate: max }));
    setChosen(null);
  };

  const handleSave = () => {
    onSave(car.plate, {
      maint: maintPct,
      minRate: parseFloat(minRate),
      maxRate: parseFloat(maxRate),
      targetRate: chosen.rate,
      runningDaysTarget: chosen.runningDays,
      profitPctTarget: chosen.profitPct,
      status: car.status === "Maintenance" ? car.status : "Available",
    });
    setEditing(false);
    setOptions(null);
    setChosen(null);
  };

  return (
    <div style={{ marginTop: 14, padding: 12, background: C.bg, borderRadius: 8 }}>
      {!editing ? (
        hasTarget ? (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.navy }}>Rental Target</div>
              <Btn small onClick={() => setEditing(true)}>Update Target</Btn>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
              <div style={{ padding: 8, background: C.surface, borderRadius: 6, textAlign: "center" }}>
                <div style={{ fontSize: 9, color: C.textMuted, marginBottom: 2 }}>Target Rent</div>
                <div style={{ ...mono, fontSize: 14, fontWeight: 700, color: C.teal }}>${car.targetRate}/d</div>
              </div>
              <div style={{ padding: 8, background: C.surface, borderRadius: 6, textAlign: "center" }}>
                <div style={{ fontSize: 9, color: C.textMuted, marginBottom: 2 }}>Avg Running Days</div>
                <div style={{ ...mono, fontSize: 14, fontWeight: 700, color: C.navy }}>{car.runningDaysTarget}d/mo</div>
              </div>
              <div style={{ padding: 8, background: C.surface, borderRadius: 6, textAlign: "center" }}>
                <div style={{ fontSize: 9, color: C.textMuted, marginBottom: 2 }}>Est. Profit</div>
                <div style={{ ...mono, fontSize: 14, fontWeight: 700, color: car.profitPctTarget >= 0 ? C.green : C.red }}>{car.profitPctTarget}%</div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.amber }}>⚠ Target not set</div>
              <div style={{ fontSize: 10, color: C.textMuted, marginTop: 2 }}>Generate a suggested rental target for this car</div>
            </div>
            <Btn small primary onClick={() => setEditing(true)}>Set Target</Btn>
          </div>
        )
      ) : (
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.navy, marginBottom: 10 }}>{hasTarget ? "Update" : "Set"} Rental Target</div>
          <div style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.textMuted, marginBottom: 4 }}>
              <span>Maintenance %</span>
              <span style={{ ...mono, fontWeight: 700, color: C.navy }}>{maintPct}%</span>
            </div>
            <input type="range" min="5" max="10" step="0.5" value={maintPct}
              onChange={e => setMaintPct(parseFloat(e.target.value))}
              style={{ width: "100%", accentColor: C.teal }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 4 }}>Min Rate ($/day)</div>
              <input type="number" value={minRate} onChange={e => setMinRate(e.target.value)} placeholder="e.g. 70"
                style={{ width: "100%", padding: "7px 9px", borderRadius: 6, border: `1px solid ${C.border}`, fontFamily: mono.fontFamily, fontSize: 12, outline: "none", boxSizing: "border-box" }} />
            </div>
            <div>
              <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 4 }}>Max Rate ($/day)</div>
              <input type="number" value={maxRate} onChange={e => setMaxRate(e.target.value)} placeholder="e.g. 110"
                style={{ width: "100%", padding: "7px 9px", borderRadius: 6, border: `1px solid ${C.border}`, fontFamily: mono.fontFamily, fontSize: 12, outline: "none", boxSizing: "border-box" }} />
            </div>
          </div>

          <Btn small primary onClick={handleGenerate} style={{ width: "100%" }}>Generate Suggestions</Btn>

          {options && (
            <div style={{ marginTop: 10 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 8 }}>
                {options.map(o => {
                  const isBalanced = /balanced/i.test(o.label);
                  const isChosen = chosen?.label === o.label;
                  return (
                    <div key={o.label} onClick={() => setChosen(o)}
                      style={{
                        position: "relative",
                        border: `2px solid ${isChosen ? C.teal : C.border}`,
                        background: isChosen ? C.tealFaint : C.surface,
                        borderRadius: 8, padding: 8, cursor: "pointer", textAlign: "center",
                      }}>
                      {isBalanced && (
                        <div style={{ position: "absolute", top: -9, left: "50%", transform: "translateX(-50%)", background: C.amber, color: "#fff", fontSize: 7.5, fontWeight: 700, padding: "2px 7px", borderRadius: 9, whiteSpace: "nowrap" }}>
                          ⭐ Recommended
                        </div>
                      )}
                      <div style={{ fontSize: 8.5, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", marginBottom: 4, marginTop: isBalanced ? 5 : 0 }}>{o.label}</div>
                      <div style={{ ...mono, fontSize: 13, fontWeight: 700, color: C.navy }}>${o.rate}/d</div>
                      <div style={{ fontSize: 9, color: C.textSec }}>{o.runningDays}d/mo</div>
                      <div style={{ fontSize: 8, color: C.textMuted, marginTop: 4 }}>Target Income</div>
                      <div style={{ ...mono, fontSize: 10, fontWeight: 700, color: C.teal }}>{fmt(o.monthlyIncome)}</div>
                      <div style={{ ...mono, fontSize: 11, fontWeight: 700, color: o.profitPct >= 0 ? C.green : C.red }}>{o.profitPct}%</div>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Btn small onClick={() => { setEditing(false); setOptions(null); setChosen(null); }} style={{ flex: 1 }}>Cancel</Btn>
                <Btn small primary onClick={handleSave} disabled={!chosen} style={{ flex: 1, opacity: chosen ? 1 : 0.5 }}>Save Target</Btn>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Fleet = ({ fleet = [], onAddFleet, onUpdateCar, onDeleteCar, calculateCarMetrics }) => {
  const [selected, setSelected] = useState(null);
  const [wizardOpen, setWizardOpen] = useState(false);
  const car = selected !== null ? fleet[selected] : null;

  // The wizard collects everything (purchase details, investment recap, rate/maintenance,
  // and a chosen target) and hands back one finished car object on completion — Fleet
  // just forwards it to whatever the app's existing "add car" handler expects.
  const handleWizardComplete = (carData) => {
    onAddFleet(carData);
    setWizardOpen(false);
  };

  const handleDelete = (plate) => {
    if (window.confirm("Are you sure you want to delete this car? This action cannot be undone.")) {
      onDeleteCar(plate);
      setSelected(null);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>Fleet Management</div>
          <div style={{ fontSize: 11, color: C.textMuted }}>{fleet.length} cars registered · Click a row to view details</div>
        </div>
        <Btn primary onClick={() => setWizardOpen(true)}>+ Add New Car</Btn>
      </div>

      {wizardOpen && (
        <AddCarWizard onComplete={handleWizardComplete} onClose={() => setWizardOpen(false)} />
      )}

      <div style={{ display: "grid", gridTemplateColumns: car ? "1fr 380px" : "1fr", gap: 16 }}>
        <Card>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: C.bg }}>
                {["Plate", "Make / Model", "Year", "Colour", "Investment (SGD)", "COE Expiry", "Maint %", "Status", ""].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "9px 12px", fontSize: 10, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.5, borderBottom: `1px solid ${C.border}`, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fleet.map((c, i) => {
                const inv = totalInv(c);
                const d = daysUntil(c.coe);
                const isSelected = selected === i;
                const metrics = calculateCarMetrics(c.plate);
                return (
                  <tr key={c.plate} onClick={() => setSelected(isSelected ? null : i)}
                    style={{ borderBottom: `1px solid ${C.border}`, cursor: "pointer", background: isSelected ? C.tealFaint : "transparent" }}>
                    <td style={{ padding: "11px 12px" }}><PlateBadge plate={c.plate} /></td>
                    <td style={{ padding: "11px 12px" }}>
                      <div style={{ fontSize: 12, fontWeight: 600 }}>{c.make}</div>
                      <div style={{ fontSize: 10, color: C.textMuted }}>{c.model}</div>
                    </td>
                    <td style={{ padding: "11px 12px", fontSize: 12 }}>{c.year}</td>
                    <td style={{ padding: "11px 12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: { Silver: "#C0C0C0", White: "#F5F5F5", Blue: "#4472C4", Black: "#222", Red: "#D64045", Grey: "#888" }[c.color] || "#aaa", border: `1px solid ${C.border}` }} />
                        <span style={{ fontSize: 12 }}>{c.color}</span>
                      </div>
                    </td>
                    <td style={{ padding: "11px 12px", ...mono, fontSize: 11 }}>{fmt(inv)}</td>
                    <td style={{ padding: "11px 12px", fontSize: 11, color: d < 30 ? C.red : d < 90 ? C.amber : C.textMuted, fontWeight: d < 90 ? 700 : 400 }}>
                      {c.coe} {d < 30 ? "⚠" : d < 90 ? "⚡" : ""}
                    </td>
                    <td style={{ padding: "11px 12px", ...mono, fontSize: 11 }}>{c.maint}%</td>
                    <td style={{ padding: "11px 12px" }}><StatusTag status={c.status} /></td>
                    <td style={{ padding: "11px 12px" }}>
                      <span style={{ fontSize: 11, color: C.teal, fontWeight: 600 }}>{isSelected ? "Close" : "Details"}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {fleet.length === 0 && (
            <div style={{ padding: 40, textAlign: "center", color: C.textMuted, fontSize: 13 }}>No cars registered yet</div>
          )}
        </Card>

        {car && (
          <Card>
            <CardHeader title={`${car.make} ${car.model}`} subtitle={car.plate}
              right={<StatusTag status={car.status} />} />
            <div style={{ padding: 16 }}>
              <SectionTitle>Car Details</SectionTitle>
              {[
                ["Plate Number", car.plate],
                ["Make", car.make],
                ["Model", car.model],
                ["Year", car.year],
                ["Colour", car.color],
              ].map(([l, v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${C.border}`, fontSize: 12 }}>
                  <span style={{ color: C.textMuted }}>{l}</span>
                  <span style={{ fontWeight: 600 }}>{v}</span>
                </div>
              ))}

              <div style={{ marginTop: 14 }}><SectionTitle>Investment Breakdown</SectionTitle></div>
              {[
                ["Purchase Cost", fmt(car.purchase)],
                ["Insurance Cost", fmt(car.insurance)],
                ["Registration Cost", fmt(car.reg)],
                ["Other Charges", fmt(car.otherCharges || 0)],
              ].map(([l, v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${C.border}`, fontSize: 12 }}>
                  <span style={{ color: C.textMuted }}>{l}</span>
                  <span style={{ ...mono, fontWeight: 600 }}>{v}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", fontSize: 13, fontWeight: 700 }}>
                <span style={{ color: C.navy }}>Total Investment</span>
                <span style={{ ...mono, color: C.teal }}>{fmt(totalInv(car))}</span>
              </div>

              <div style={{ marginTop: 8, padding: 12, background: C.bg, borderRadius: 8 }}>
                <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 4 }}>Annual Maintenance Budget</div>
                <div style={{ ...mono, fontSize: 15, fontWeight: 700, color: C.navy }}>{fmt(Math.round(totalInv(car) * car.maint / 100))}</div>
                <div style={{ fontSize: 10, color: C.textMuted }}>@ {car.maint}% of total investment</div>
              </div>

              <div style={{ marginTop: 14 }}><SectionTitle>Performance</SectionTitle></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                <div style={{ padding: 10, background: C.bg, borderRadius: 8 }}>
                  <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 2 }}>Total Earnings</div>
                  <div style={{ ...mono, fontSize: 14, fontWeight: 700, color: C.green }}>{fmt(calculateCarMetrics(car.plate).earnings)}</div>
                </div>
                <div style={{ padding: 10, background: C.bg, borderRadius: 8 }}>
                  <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 2 }}>Recovery %</div>
                  <div style={{ ...mono, fontSize: 14, fontWeight: 700, color: C.teal }}>{calculateCarMetrics(car.plate).recoveryPct}%</div>
                </div>
              </div>

              {/* Investment recovery bar — same rule as the Dashboard's Target vs Actual:
                  the track IS the target (100% = fully recovered), the fill is one fixed
                  "actual" color and is capped so it can never visually pass the target
                  line, and the target tick sits fixed at the 100% mark. */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9.5, color: C.textMuted, marginBottom: 4 }}>
                  <span>Investment Recovery</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <div style={{ width: 10, height: 2, background: C.amber, borderRadius: 1 }} />
                    Target
                  </div>
                </div>
                <div style={{ position: "relative", height: 7, background: C.bg, borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ width: `${Math.min(calculateCarMetrics(car.plate).recoveryPct, 100)}%`, height: "100%", background: C.teal, borderRadius: 4 }} />
                  <div style={{ position: "absolute", top: -1, bottom: -1, right: 0, width: 2, background: C.amber }} />
                </div>
              </div>

              <div style={{ marginTop: 14 }}><SectionTitle>COE Status</SectionTitle></div>
              <div style={{ padding: 12, background: daysUntil(car.coe) < 30 ? C.redFaint : daysUntil(car.coe) < 90 ? C.amberFaint : C.greenFaint, borderRadius: 8, borderLeft: `3px solid ${daysUntil(car.coe) < 30 ? C.red : daysUntil(car.coe) < 90 ? C.amber : C.green}` }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: daysUntil(car.coe) < 30 ? C.red : daysUntil(car.coe) < 90 ? C.amber : C.green }}>
                  {daysUntil(car.coe) < 30 ? "⚠ Urgent — " : daysUntil(car.coe) < 90 ? "⚡ Warning — " : "✓ "} Expires: {car.coe}
                </div>
                <div style={{ fontSize: 10, color: C.textMuted, marginTop: 3 }}>{daysUntil(car.coe)} days remaining</div>
              </div>

              <TargetPanel car={car} key={car.plate} onSave={onUpdateCar} />

              <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                <Btn small>Edit Car</Btn>
                <Btn small onClick={() => handleDelete(car.plate)}>Delete</Btn>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Fleet;