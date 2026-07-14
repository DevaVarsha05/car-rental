import { useState } from "react";
import { C, mono, fmt, totalInv, daysUntil } from "./theme";
import { FLEET } from "./data";
import { Card, CardHeader, Btn, StatusTag, PlateBadge, SectionTitle } from "./components";

const Fleet = ({ onAddFleet }) => {
  const [selected, setSelected] = useState(null);
  const car = selected !== null ? FLEET[selected] : null;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>Fleet Management</div>
          <div style={{ fontSize: 11, color: C.textMuted }}>8 cars registered · Click a row to view details</div>
        </div>
      <Btn primary onClick={onAddFleet}>+ Add New Vehicle</Btn>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: car ? "1fr 380px" : "1fr", gap: 16 }}>
        <Card>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: C.bg }}>
                {["Plate","Make / Model","Year","Colour","Investment (SGD)","COE Expiry","Maint %","Status",""].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "9px 12px", fontSize: 10, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.5, borderBottom: `1px solid ${C.border}`, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FLEET.map((c, i) => {
                const inv = totalInv(c);
                const d = daysUntil(c.coe);
                const isSelected = selected === i;
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
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: {Silver:"#C0C0C0",White:"#F5F5F5",Blue:"#4472C4",Black:"#222",Red:"#D64045",Grey:"#888"}[c.color] || "#aaa", border: `1px solid ${C.border}` }} />
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
                ["Purchase Cost",     fmt(car.purchase)],
                ["Insurance Cost",    fmt(car.insurance)],
                ["Registration Cost", fmt(car.reg)],
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

              <div style={{ marginTop: 14 }}><SectionTitle>COE Status</SectionTitle></div>
              <div style={{ padding: 12, background: daysUntil(car.coe) < 30 ? C.redFaint : daysUntil(car.coe) < 90 ? C.amberFaint : C.greenFaint, borderRadius: 8, borderLeft: `3px solid ${daysUntil(car.coe) < 30 ? C.red : daysUntil(car.coe) < 90 ? C.amber : C.green}` }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: daysUntil(car.coe) < 30 ? C.red : daysUntil(car.coe) < 90 ? C.amber : C.green }}>
                  {daysUntil(car.coe) < 30 ? "⚠ Urgent — " : daysUntil(car.coe) < 90 ? "⚡ Warning — " : "✓ "} Expires: {car.coe}
                </div>
                <div style={{ fontSize: 10, color: C.textMuted, marginTop: 3 }}>{daysUntil(car.coe)} days remaining</div>
              </div>

              <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                <Btn small primary>Edit Car</Btn>
                <Btn small>View Bookings</Btn>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Fleet;