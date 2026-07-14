import { useState } from "react";
import { C, mono, fmt } from "./theme";
import { BOOKINGS } from "./data";
import { Card, Btn, StatusTag, PlateBadge } from "./components";

const Booking = ({ onNewBooking }) => {
  const [filter, setFilter] = useState("All");
  const statuses = ["All","Active","Upcoming","Ending Today","Completed"];
  const filtered = filter === "All" ? BOOKINGS : BOOKINGS.filter(b => b.status === filter);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>Bookings</div>
          <div style={{ fontSize: 11, color: C.textMuted }}>{BOOKINGS.length} total bookings</div>
        </div>
        <Btn primary onClick={onNewBooking}>＋ New Booking</Btn>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {statuses.map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600,
            cursor: "pointer", border: `1px solid ${filter === s ? C.teal : C.border}`,
            background: filter === s ? C.teal : C.surface,
            color: filter === s ? "#fff" : C.textSec, fontFamily: "inherit",
          }}>{s}</button>
        ))}
      </div>

      <Card>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: C.bg }}>
              {["Booking ID","Car","Customer","IC / Passport","Contact","Rental Period","Days","Rate","Total","Pickup","Status"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "9px 12px", fontSize: 10, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.5, borderBottom: `1px solid ${C.border}`, whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(b => {
              const days = Math.round((new Date(b.end) - new Date(b.start)) / 86400000);
              return (
                <tr key={b.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: "11px 12px", ...mono, fontSize: 11, fontWeight: 700, color: C.navyMid }}>{b.id}</td>
                  <td style={{ padding: "11px 12px" }}><PlateBadge plate={b.plate} small /></td>
                  <td style={{ padding: "11px 12px", fontSize: 12, fontWeight: 600 }}>{b.customer}</td>
                  <td style={{ padding: "11px 12px", ...mono, fontSize: 10, color: C.textMuted }}>{b.ic}</td>
                  <td style={{ padding: "11px 12px", fontSize: 11, color: C.textSec }}>{b.contact}</td>
                  <td style={{ padding: "11px 12px", fontSize: 11, color: C.textSec, whiteSpace: "nowrap" }}>{b.start} → {b.end}</td>
                  <td style={{ padding: "11px 12px", ...mono, fontSize: 11, textAlign: "center" }}>{days}</td>
                  <td style={{ padding: "11px 12px", ...mono, fontSize: 11 }}>${b.rate}/d</td>
                  <td style={{ padding: "11px 12px", ...mono, fontSize: 12, fontWeight: 700, color: C.teal }}>{fmt(b.rate * days)}</td>
                  <td style={{ padding: "11px 12px", fontSize: 11, color: C.textMuted }}>{b.pickup}</td>
                  <td style={{ padding: "11px 12px" }}><StatusTag status={b.status} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding: 40, textAlign: "center", color: C.textMuted, fontSize: 13 }}>No bookings with status "{filter}"</div>
        )}
      </Card>
    </div>
  );
};

export default Booking;