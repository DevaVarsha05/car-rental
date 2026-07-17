import { useState } from "react";
import { C } from "./theme";
import { Btn, Badge, Modal, Input, Select } from "./components";
import { useFleetData } from "./useFleetData";
import AddCarWizard from "./AddCarWizard";

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
  const [selectedRange, setSelectedRange] = useState("2026-06");
  const [showNewBooking, setShowNewBooking] = useState(false);
  const [showNewFleet, setShowNewFleet] = useState(false);
  const [showNewUser, setShowNewUser] = useState(false);

  // Initialize fleet data management hook
  const fleetData = useFleetData();

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
    { id: "alerts", label: "Alerts", icon: "🔔", badge: fleetData.alerts.length },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  const TAB_CONTENT = {
    dashboard: (
      <Dashboard
        fleet={fleetData.fleet}
        bookings={fleetData.bookings}
        earnings={fleetData.earnings}
        expenses={fleetData.expenses}
        alerts={fleetData.alerts}
        month={selectedRange}
        calculateMetrics={fleetData.calculateMetrics}
        calculateMonthlyMetrics={fleetData.calculateMonthlyMetrics}
        calculateCarMetrics={fleetData.calculateCarMetrics}
        calculateMonthlyTarget={fleetData.calculateMonthlyTarget}
        calculateCarMonthlyTarget={fleetData.calculateCarMonthlyTarget}
        calculateMonthlyBudget={fleetData.calculateMonthlyBudget}
        getExpensesByCategory={fleetData.getExpensesByCategory}
      />
    ),
    fleet: (
      <Fleet
        fleet={fleetData.fleet}
        onAddFleet={fleetData.addFleet}  // ✅ CRITICAL FIX: Pass the actual handler that will be called by AddCarWizard
        onUpdateCar={fleetData.updateFleet}
        onDeleteCar={fleetData.deleteFleet}
        calculateCarMetrics={fleetData.calculateCarMetrics}
      />
    ),
    bookings: (
      <Booking
        bookings={fleetData.bookings}
        fleet={fleetData.fleet}
        onNewBooking={() => setShowNewBooking(true)}
        onAddBooking={fleetData.addBooking}
        onUpdateBooking={fleetData.updateBooking}
        onDeleteBooking={fleetData.deleteBooking}
      />
    ),
    earnings: (
      <Earning
        earnings={fleetData.earnings}
        fleet={fleetData.fleet}
        bookings={fleetData.bookings}
        onAddEarning={fleetData.addEarning}
        onUpdateEarning={fleetData.updateEarning}
        onDeleteEarning={fleetData.deleteEarning}
        onLockEarning={fleetData.lockEarning}
      />
    ),
    expenses: (
      <Expenses
        expenses={fleetData.expenses}
        fleet={fleetData.fleet}
        onAddExpense={fleetData.addExpense}
        onUpdateExpense={fleetData.updateExpense}
        onDeleteExpense={fleetData.deleteExpense}
      />
    ),
    pl: (
      <PlReport
        fleet={fleetData.fleet}
        bookings={fleetData.bookings}
        earnings={fleetData.earnings}
        expenses={fleetData.expenses}
        calculateMetrics={fleetData.calculateMetrics}
        calculateMonthlyMetrics={fleetData.calculateMonthlyMetrics}
        calculateCarMetrics={fleetData.calculateCarMetrics}
      />
    ),
    alerts: (
      <Alert
        alerts={fleetData.alerts}
        fleet={fleetData.fleet}
      />
    ),
    settings: <Settings onAddUser={() => setShowNewUser(true)} />,
  };

  const topbar = {
    dashboard: { title: "Fleet Dashboard", sub: `${fleetData.fleet.length} cars · ${fleetData.bookings.filter(b => b.status === "Active").length} active` },
    fleet: { title: "Fleet Management", sub: `${fleetData.fleet.length} cars registered` },
    bookings: { title: "Bookings", sub: `${fleetData.bookings.length} total bookings` },
    earnings: { title: "Actual Earnings", sub: "Locked rental income records" },
    expenses: { title: "Expense Management", sub: "Log and track running costs" },
    pl: { title: "P&L Reports", sub: "Profitability by car and fleet" },
    alerts: { title: "Alerts", sub: `${fleetData.alerts.length} active alerts` },
    settings: { title: "Settings", sub: "Company profile and users" },
  };

  const handleNewBookingSubmit = (e) => {
    e.preventDefault();
    if (!newBookingData.plate || !newBookingData.customer || !newBookingData.start || !newBookingData.end || !newBookingData.rate) {
      alert("Please fill in all required fields");
      return;
    }
    fleetData.addBooking({
      ...newBookingData,
      status: "Active",
    });
    alert(`Booking created for ${newBookingData.customer} on ${newBookingData.plate}`);
    setNewBookingData({ plate: "", customer: "", ic: "", contact: "", start: "", end: "", pickup: "", drop: "", rate: "" });
    setShowNewBooking(false);
  };

  const handleNewUserSubmit = (e) => {
    e.preventDefault();
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
        <nav style={{ flex: 1, overflowY: "auto", paddingBottom: 10, marginTop: 6 }}>
          <div style={{ padding: "10px 20px 4px", fontSize: 9, fontWeight: 600, letterSpacing: 1.8, color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>Operations</div>
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
              {fleetData.fleet.map(c => <option key={c.plate}>{c.plate}</option>)}
            </select>
            <select value={selectedRange} onChange={e => setSelectedRange(e.target.value)}
              style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 10px", fontSize: 12, color: C.textPri, fontFamily: "inherit", cursor: "pointer", outline: "none" }}>
              <option value="all">All Months (YTD)</option>
              <option value="2026-01">January 2026</option>
              <option value="2026-02">February 2026</option>
              <option value="2026-03">March 2026</option>
              <option value="2026-04">April 2026</option>
              <option value="2026-05">May 2026</option>
              <option value="2026-06">June 2026</option>
              <option value="2026-07">July 2026</option>
              <option value="2026-08">August 2026</option>
              <option value="2026-09">September 2026</option>
              <option value="2026-10">October 2026</option>
              <option value="2026-11">November 2026</option>
              <option value="2026-12">December 2026</option>
            </select>
          </div>
        </header>

        {/* Content */}
        <div style={{ flex: 1, overflow: "auto", padding: "24px" }}>
          {TAB_CONTENT[active]}
        </div>
      </main>

      {/* NEW BOOKING MODAL */}
      <Modal
        open={showNewBooking}
        title="New Booking"
        onClose={() => setShowNewBooking(false)}
        onSubmit={handleNewBookingSubmit}
        submitText="Create Booking"
      >
        <Select
          label="Car (Plate)"
          value={newBookingData.plate}
          onChange={(e) => {
            const plate = e.target.value;
            const car = fleetData.fleet.find(c => c.plate === plate);
            if (car && !car.targetRate) {
              // No saved target rate for this car — don't block the booking.
              // Just clear the rate so staff can type it in manually below.
              setNewBookingData({ ...newBookingData, plate, rate: "" });
              return;
            }
            setNewBookingData({ ...newBookingData, plate, rate: car ? car.targetRate : "" });
          }}
          options={fleetData.fleet.map(c => ({ value: c.plate, label: c.plate }))}
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
          readOnly
          disabled
          placeholder="Select a car to auto-fill"
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