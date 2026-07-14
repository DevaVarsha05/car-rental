import { useState } from "react";
import { C, mono, fmt } from "./theme";
import { FLEET, EXPENSES } from "./data";
import { Card, CardHeader, Btn, Badge, PlateBadge } from "./components";

const Expenses = () => {
  const [showForm, setShowForm] = useState(false);
  const total = EXPENSES.reduce((s, e) => s + e.amount, 0);

  const cats = {};
  EXPENSES.forEach(e => { cats[e.category] = (cats[e.category] || 0) + e.amount; });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>Expense Management</div>
          <div style={{ fontSize: 11, color: C.textMuted }}>Log running costs, maintenance, and repairs per car</div>
        </div>
        <Btn primary onClick={() => setShowForm(!showForm)}>＋ Log Expense</Btn>
      </div>

      {showForm && (
        <Card style={{ marginBottom: 16 }}>
          <CardHeader title="Log New Expense" />
          <div style={{ padding: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
              {[
                { label: "Car (Plate)", type: "select", opts: FLEET.map(c => c.plate) },
                { label: "Date", type: "date" },
                { label: "Category", type: "select", opts: ["Routine Service","Body Repair","Tyre Replacement","Electrical Repair","Engine Repair","Air-Con Service","Insurance Renewal","Road Tax / Registration","COE Renewal","Cleaning & Detailing","Parking / Fines","Other / Miscellaneous"] },
              ].map(f => (
                <div key={f.label}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, marginBottom: 4 }}>{f.label}</div>
                  {f.type === "select"
                    ? <select style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: `1px solid ${C.border}`, fontFamily: "inherit", fontSize: 12, color: C.textPri, background: C.surface, outline: "none" }}>
                        {f.opts.map(o => <option key={o}>{o}</option>)}
                      </select>
                    : <input type={f.type} style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: `1px solid ${C.border}`, fontFamily: "inherit", fontSize: 12, color: C.textPri, outline: "none" }} />
                  }
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12, marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, marginBottom: 4 }}>Description</div>
                <input type="text" placeholder="e.g. 60,000 km oil change and filter" style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: `1px solid ${C.border}`, fontFamily: "inherit", fontSize: 12, outline: "none" }} />
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, marginBottom: 4 }}>Amount (SGD)</div>
                <input type="number" placeholder="0.00" style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: `1px solid ${C.border}`, fontFamily: "'Courier New',monospace", fontSize: 12, outline: "none" }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn primary small>Save Expense</Btn>
              <Btn small onClick={() => setShowForm(false)}>Cancel</Btn>
            </div>
          </div>
        </Card>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr", gap: 16 }}>
        <Card>
          <CardHeader title="Expense Records — June 2026" right={<Badge>{fmt(total)} total</Badge>} />
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: C.bg }}>
                {["ID","Car","Date","Category","Description","Amount","Receipt"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "9px 12px", fontSize: 10, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.5, borderBottom: `1px solid ${C.border}`, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {EXPENSES.map(e => (
                <tr key={e.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: "10px 12px", ...mono, fontSize: 11, fontWeight: 700, color: C.navyMid }}>{e.id}</td>
                  <td style={{ padding: "10px 12px" }}><PlateBadge plate={e.plate} small /></td>
                  <td style={{ padding: "10px 12px", fontSize: 11, color: C.textMuted, whiteSpace: "nowrap" }}>{e.date}</td>
                  <td style={{ padding: "10px 12px" }}><Badge color={C.navyMid} bg={C.bg}>{e.category}</Badge></td>
                  <td style={{ padding: "10px 12px", fontSize: 11, color: C.textSec }}>{e.desc}</td>
                  <td style={{ padding: "10px 12px", ...mono, fontSize: 12, fontWeight: 700, color: C.red }}>{fmt(e.amount)}</td>
                  <td style={{ padding: "10px 12px" }}>
                    {e.receipt
                      ? <span style={{ fontSize: 11, color: C.green }}>✓ Yes</span>
                      : <span style={{ fontSize: 11, color: C.textMuted }}>– No</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card>
          <CardHeader title="By Category" />
          <div style={{ padding: 16 }}>
            {Object.entries(cats).sort(([,a],[,b]) => b - a).map(([cat, amt]) => (
              <div key={cat} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 11 }}>
                  <span style={{ color: C.textSec, fontWeight: 500 }}>{cat}</span>
                  <span style={{ ...mono, fontWeight: 700, color: C.red }}>{fmt(amt)}</span>
                </div>
                <div style={{ height: 5, background: C.bg, borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ width: `${(amt / total) * 100}%`, height: "100%", background: C.navyMid, borderRadius: 3, opacity: 0.7 }} />
                </div>
              </div>
            ))}
            <div style={{ borderTop: `2px solid ${C.navy}`, paddingTop: 10, display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontWeight: 700, fontSize: 12 }}>Total</span>
              <span style={{ ...mono, fontWeight: 700, fontSize: 13, color: C.red }}>{fmt(total)}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Expenses;