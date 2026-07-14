import { useState } from "react";
import { C } from "./Theme";
import { FLEET, ALERTS } from "./data";
import { Btn, Badge, Modal, Input, Select } from "./components";

import Dashboard from "./Dashboard";
import Fleet from "./Fleet";
import Booking from "./Booking";
import Earning from "./Earning";
import Expenses from "./Expenses";
import PlReport from "./pl report";
import Alert from "./Alert";
import Settings from "./Settings";

export default function FleetOpzApp() {
  const [active, setActive] = useState("dashboard");
  const [selectedCar, setSelectedCar] = useState("All Cars");
  const [selectedRange, setSelectedRange] = useState("June 2026");
  const [showNewBooking, setShowNewBooking] = useState(false);
  const [showNewFleet, setShowNewFleet] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showNewUser, setShowNewUser] = useState(false);

  const [newBookingData, setNewBookingData] = useState({
    plate: "",
    customer: "",
    ic: "",
    contact: "",
    start: "",
    end: "",
    pickup: "",
    drop: "",
    rate: ""
  });

  const [newFleetData, setNewFleetData] = useState({
    plate: "",
    make: "",
    model: "",
    year: "",
    color: "",
    purchase: "",
    insurance: "",
    reg: "",
    maint: "",
    coe: "",
    status: "Available"
  });

  const [newUserData, setNewUserData] = useState({
    name: "",
    email: "",
    role: "Staff"
  });

  const NAV = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "fleet", label: "Fleet", icon: "🚗" },
    { id: "bookings", label: "Bookings", icon: "📅" },
    { id: "earnings", label: "Earnings", icon: "💰" },
    { id: "expenses", label: "Expenses", icon: "📝" },
    { id: "pl", label: "P&L", icon: "📈" },
    { id: "alerts", label: "Alerts", icon: "🔔", badge: ALERTS.length },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  const TAB_CONTENT = {
    dashboard: <Dashboard selectedCar={selectedCar} selectedRange={selectedRange} />,
    fleet:     <Fleet onAddFleet={() => setShowNewFleet(true)} />,
    bookings:  <Booking onNewBooking={() => setShowNewBooking(true)} />,
    earnings:  <Earning />,
    expenses:  <Expenses />,
    pl:        <PlReport />,
    alerts:    <Alert />,
    settings:  <Settings onAddUser={() => setShowNewUser(true)} />,
  };

  const topbar = {
    dashboard: { title: "Fleet Dashboard",    sub: "June 2026 · 8 cars active" },
    fleet:     { title: "Fleet Management",   sub: "8 cars registered" },
    bookings:  { title: "Bookings",           sub: "Manage customer rentals" },
    earnings:  { title: "Actual Earnings",    sub: "Locked rental income records" },
    expenses:  { title: "Expense Management", sub: "Log and track running costs" },
    pl:        { title: "P&L Reports",        sub: "Profitability by car and fleet" },
    alerts:    { title: "Alerts",             sub: "3 active · COE & operational" },
    settings:  { title: "Settings",           sub: "Company profile and users" },
  };

  const handleNewBookingSubmit = () => {
    alert(`Booking created for ${newBookingData.customer} on ${newBookingData.plate}`);
    setNewBookingData({ plate: "", customer: "", ic: "", contact: "", start: "", end: "", pickup: "", drop: "", rate: "" });
    setShowNewBooking(false);
  };

  const handleNewFleetSubmit = () => {
    alert(`New vehicle added: ${newFleetData.make} ${newFleetData.model} (${newFleetData.plate})`);
    setNewFleetData({ plate: "", make: "", model: "", year: "", color: "", purchase: "", insurance: "", reg: "", maint: "", coe: "", status: "Available" });
    setShowNewFleet(false);
  };

  const handleNewUserSubmit = () => {
    alert(`User added: ${newUserData.name} (${newUserData.role}) — ${newUserData.email}`);
    setNewUserData({ name: "", email: "", role: "Staff" });
    setShowNewUser(false);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.bg, fontFamily: "'Inter', 'Segoe UI', sans-serif", fontSize: 13, color: C.textPri }}>

      {/* SIDEBAR */}
      <aside style={{ width: 220, background: C.navy, minHeight: "100vh", display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 100 }}>
        {/* Logo */}
        <div style={{ padding: "18px 20px 14px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, background: C.teal, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🚗</div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, letterSpacing: -0.3 }}>FleetOpz</div>
              <div style={{ color: C.tealLight, fontSize: 10, fontWeight: 500, letterSpacing: 1.5, textTransform: "uppercase" }}>Car Rental SaaS</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: "16px 0", flex: 1 }}>
          <div style={{ padding: "10px 20px 4px", fontSize: 9, fontWeight: 600, letterSpacing: 1.8, color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>Overview</div>
          {NAV.slice(0, 3).map(n => (
            <div key={n.id} onClick={() => setActive(n.id)}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 20px", cursor: "pointer", fontSize: 12.5, fontWeight: active === n.id ? 600 : 400, color: active === n.id ? "#fff" : "rgba(255,255,255,0.55)", background: active === n.id ? "rgba(10,140,126,0.2)" : "transparent", borderLeft: `3px solid ${active === n.id ? C.tealLight : "transparent"}`, transition: "all 0.15s" }}>
              <span style={{ width: 16, textAlign: "center" }}>{n.icon}</span>
              {n.label}
            </div>
          ))}

          <div style={{ padding: "10px 20px 4px", marginTop: 10, fontSize: 9, fontWeight: 600, letterSpacing: 1.8, color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>Finance</div>
          {NAV.slice(3, 6).map(n => (
            <div key={n.id} onClick={() => setActive(n.id)}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 20px", cursor: "pointer", fontSize: 12.5, fontWeight: active === n.id ? 600 : 400, color: active === n.id ? "#fff" : "rgba(255,255,255,0.55)", background: active === n.id ? "rgba(10,140,126,0.2)" : "transparent", borderLeft: `3px solid ${active === n.id ? C.tealLight : "transparent"}`, transition: "all 0.15s" }}>
              <span style={{ width: 16, textAlign: "center" }}>{n.icon}</span>
              {n.label}
            </div>
          ))}

          <div style={{ padding: "10px 20px 4px", marginTop: 10, fontSize: 9, fontWeight: 600, letterSpacing: 1.8, color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>System</div>
          {NAV.slice(6).map(n => (
            <div key={n.id} onClick={() => setActive(n.id)}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 20px", cursor: "pointer", fontSize: 12.5, fontWeight: active === n.id ? 600 : 400, color: active === n.id ? "#fff" : "rgba(255,255,255,0.55)", background: active === n.id ? "rgba(10,140,126,0.2)" : "transparent", borderLeft: `3px solid ${active === n.id ? C.tealLight : "transparent"}`, transition: "all 0.15s" }}>
              <span style={{ width: 16, textAlign: "center" }}>{n.icon}</span>
              <span style={{ flex: 1 }}>{n.label}</span>
              {n.badge && <span style={{ background: C.red, color: "#fff", fontSize: 9, padding: "1px 6px", borderRadius: 10, fontWeight: 700 }}>{n.badge}</span>}
            </div>
          ))}
        </nav>

        {/* User footer */}
        <div style={{ padding: "14px 20px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: C.teal, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>SK</div>
            <div>
              <div style={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>Selvakumar</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>Admin</div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ marginLeft: 220, flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Topbar */}
        <header style={{ height: 60, background: C.surface, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", padding: "0 24px", gap: 16, position: "sticky", top: 0, zIndex: 50 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>{topbar[active]?.title}</div>
            <div style={{ fontSize: 11, color: C.textMuted }}>{topbar[active]?.sub}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <select value={selectedCar} onChange={e => setSelectedCar(e.target.value)}
              style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 10px", fontSize: 12, color: C.textPri, fontFamily: "inherit", cursor: "pointer", outline: "none" }}>
              <option>All Cars</option>
              {FLEET.map(c => <option key={c.plate}>{c.plate}</option>)}
            </select>
            <select value={selectedRange} onChange={e => setSelectedRange(e.target.value)}
              style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 10px", fontSize: 12, color: C.textPri, fontFamily: "inherit", cursor: "pointer", outline: "none" }}>
              <option>June 2026</option>
              <option>May 2026</option>
              <option>Q2 2026</option>
              <option>2026 YTD</option>
            </select>
            <Btn primary onClick={() => setShowNewBooking(true)}>＋ New Booking</Btn>

            {/* Bell Icon with Dropdown */}
            <div style={{ position: "relative" }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: C.bg, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative", fontSize: 15 }}
                onClick={() => setShowNotifications(!showNotifications)}>
                🔔
                <div style={{ position: "absolute", top: 5, right: 5, width: 8, height: 8, borderRadius: "50%", background: C.red, border: `2px solid ${C.surface}` }} />
              </div>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div style={{ position: "absolute", top: "100%", right: 0, marginTop: 8, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", minWidth: 320, zIndex: 999 }}>
                  <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}`, fontWeight: 600, fontSize: 13 }}>
                    Notifications ({ALERTS.length})
                  </div>
                  <div style={{ maxHeight: 400, overflowY: "auto" }}>
                    {ALERTS.map(a => (
                      <div key={a.id} style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}`, cursor: "pointer", transition: "background 0.15s", background: "transparent" }}
                        onMouseEnter={e => e.currentTarget.style.background = C.bg}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                          <div style={{ fontSize: 18 }}>{a.type === "coe" ? "⏰" : "📅"}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, fontSize: 12, color: a.urgent ? C.red : C.textPri, marginBottom: 4 }}>
                              {a.car}
                            </div>
                            <div style={{ fontSize: 12, color: C.textSec, marginBottom: 4 }}>
                              {a.msg}
                            </div>
                            {a.urgent && <Badge color={C.red} bg={C.redFaint}>Urgent</Badge>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ padding: "12px 16px", textAlign: "center", borderTop: `1px solid ${C.border}` }}>
                    <Btn secondary small onClick={() => { setActive("alerts"); setShowNotifications(false); }}>View All Alerts</Btn>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <div style={{ padding: "20px 24px", flex: 1, overflowY: "auto" }}>
          {TAB_CONTENT[active]}
        </div>
      </main>

      {/* NEW BOOKING MODAL */}
      <Modal
        open={showNewBooking}
        title="Create New Booking"
        onClose={() => setShowNewBooking(false)}
        onSubmit={handleNewBookingSubmit}
        submitText="Create Booking"
      >
        <Select
          label="Vehicle (Plate)"
          value={newBookingData.plate}
          onChange={(e) => setNewBookingData({ ...newBookingData, plate: e.target.value })}
          options={FLEET.map(f => ({ value: f.plate, label: `${f.plate} - ${f.make} ${f.model}` }))}
        />
        <Input
          label="Customer Name"
          value={newBookingData.customer}
          onChange={(e) => setNewBookingData({ ...newBookingData, customer: e.target.value })}
          placeholder="e.g., Ahmad bin Razif"
        />
        <Input
          label="IC Number"
          value={newBookingData.ic}
          onChange={(e) => setNewBookingData({ ...newBookingData, ic: e.target.value })}
          placeholder="e.g., S8901234A"
        />
        <Input
          label="Contact Number"
          value={newBookingData.contact}
          onChange={(e) => setNewBookingData({ ...newBookingData, contact: e.target.value })}
          placeholder="e.g., 91234567"
        />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Input
            label="Start Date"
            type="date"
            value={newBookingData.start}
            onChange={(e) => setNewBookingData({ ...newBookingData, start: e.target.value })}
          />
          <Input
            label="End Date"
            type="date"
            value={newBookingData.end}
            onChange={(e) => setNewBookingData({ ...newBookingData, end: e.target.value })}
          />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Input
            label="Pickup Location"
            value={newBookingData.pickup}
            onChange={(e) => setNewBookingData({ ...newBookingData, pickup: e.target.value })}
            placeholder="e.g., Jurong East"
          />
          <Input
            label="Drop Location"
            value={newBookingData.drop}
            onChange={(e) => setNewBookingData({ ...newBookingData, drop: e.target.value })}
            placeholder="e.g., Jurong East"
          />
        </div>
        <Input
          label="Daily Rate ($)"
          type="number"
          value={newBookingData.rate}
          onChange={(e) => setNewBookingData({ ...newBookingData, rate: e.target.value })}
          placeholder="e.g., 90"
        />
      </Modal>

      {/* NEW FLEET VEHICLE MODAL */}
      <Modal
        open={showNewFleet}
        title="Add New Vehicle"
        onClose={() => setShowNewFleet(false)}
        onSubmit={handleNewFleetSubmit}
        submitText="Add Vehicle"
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Input
            label="License Plate"
            value={newFleetData.plate}
            onChange={(e) => setNewFleetData({ ...newFleetData, plate: e.target.value })}
            placeholder="e.g., SBA 1234 X"
          />
          <Select
            label="Status"
            value={newFleetData.status}
            onChange={(e) => setNewFleetData({ ...newFleetData, status: e.target.value })}
            options={[
              { value: "Available", label: "Available" },
              { value: "On Rental", label: "On Rental" },
              { value: "Maintenance", label: "Maintenance" }
            ]}
          />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Input
            label="Make"
            value={newFleetData.make}
            onChange={(e) => setNewFleetData({ ...newFleetData, make: e.target.value })}
            placeholder="e.g., Toyota"
          />
          <Input
            label="Model"
            value={newFleetData.model}
            onChange={(e) => setNewFleetData({ ...newFleetData, model: e.target.value })}
            placeholder="e.g., Corolla"
          />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Input
            label="Year"
            type="number"
            value={newFleetData.year}
            onChange={(e) => setNewFleetData({ ...newFleetData, year: e.target.value })}
            placeholder="e.g., 2022"
          />
          <Input
            label="Color"
            value={newFleetData.color}
            onChange={(e) => setNewFleetData({ ...newFleetData, color: e.target.value })}
            placeholder="e.g., Silver"
          />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Input
            label="Purchase Price ($)"
            type="number"
            value={newFleetData.purchase}
            onChange={(e) => setNewFleetData({ ...newFleetData, purchase: e.target.value })}
            placeholder="e.g., 26000"
          />
          <Input
            label="Insurance ($)"
            type="number"
            value={newFleetData.insurance}
            onChange={(e) => setNewFleetData({ ...newFleetData, insurance: e.target.value })}
            placeholder="e.g., 1200"
          />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Input
            label="Registration ($)"
            type="number"
            value={newFleetData.reg}
            onChange={(e) => setNewFleetData({ ...newFleetData, reg: e.target.value })}
            placeholder="e.g., 1300"
          />
          <Input
            label="Maintenance ($/month)"
            type="number"
            value={newFleetData.maint}
            onChange={(e) => setNewFleetData({ ...newFleetData, maint: e.target.value })}
            placeholder="e.g., 7.5"
          />
        </div>
        <Input
          label="COE Expiry Date"
          type="date"
          value={newFleetData.coe}
          onChange={(e) => setNewFleetData({ ...newFleetData, coe: e.target.value })}
        />
      </Modal>

      {/* NEW USER MODAL */}
      <Modal
        open={showNewUser}
        title="Add New User"
        onClose={() => setShowNewUser(false)}
        onSubmit={handleNewUserSubmit}
        submitText="Add User"
      >
        <Input
          label="Full Name"
          value={newUserData.name}
          onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
          placeholder="e.g., Nur Aisyah"
        />
        <Input
          label="Email"
          type="email"
          value={newUserData.email}
          onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
          placeholder="e.g., aisyah@sgwheels.com"
        />
        <Select
          label="Role"
          value={newUserData.role}
          onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
          options={[
            { value: "Admin", label: "Admin" },
            { value: "Staff", label: "Staff" }
          ]}
        />
      </Modal>
    </div>
  );
}