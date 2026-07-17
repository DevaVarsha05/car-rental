import { useState, useEffect } from "react";
import { FLEET as INITIAL_FLEET, BOOKINGS as INITIAL_BOOKINGS, EARNINGS as INITIAL_EARNINGS, EXPENSES as INITIAL_EXPENSES, ALERTS as INITIAL_ALERTS } from "./data";
import { totalInv, daysUntil } from "./theme";

// Desired profit margin layered on top of breakeven costs when deriving the monthly target.
// Breakeven = money needed just to recover the car and cover its maintenance; the target
// aims a bit higher so the business is actually profitable, not just breaking even.
const TARGET_MARGIN_PCT = 15;

// ── LOCAL PERSISTENCE ────────────────────────────────────────────────────────
// Without this, every refresh/reload wiped anything the user added, because state
// lived only in memory and re-initialized from the static sample data in data.js.
// We namespace keys so this app's data doesn't collide with anything else on the domain.
const STORAGE_PREFIX = "fleetopz:";

const loadPersisted = (key, fallback) => {
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`FleetOpz: failed to load "${key}" from localStorage`, err);
    return fallback;
  }
};

const savePersisted = (key, value) => {
  try {
    window.localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (err) {
    console.error(`FleetOpz: failed to save "${key}" to localStorage`, err);
  }
};

// ── STATUS DERIVATION ────────────────────────────────────────────────────────
// Booking status is derived from today's date vs start/end, instead of being a
// static field that only changes when someone clicks a button. "Cancelled" is
// the one status nothing can infer from dates, so it stays a manual flag.
const computeBookingStatus = (booking, todayStr) => {
  if (booking.cancelled) return "Cancelled";
  if (!booking.start || !booking.end) return booking.status || "Active";
  if (todayStr < booking.start) return "Upcoming";
  if (todayStr === booking.end) return "Ending Today";
  if (todayStr > booking.end) return "Completed";
  return "Active"; // start <= today < end
};

// A car's status is derived from whether it currently has a booking that puts
// it "out" (Active or Ending Today). "Maintenance" is the one status nothing
// can infer from bookings, so — like Cancelled above — it stays a manual flag.
const computeFleetStatus = (car, bookingsWithStatus) => {
  if (car.status === "Maintenance") return "Maintenance";
  const isOut = bookingsWithStatus.some(
    b => b.plate === car.plate && (b.status === "Active" || b.status === "Ending Today")
  );
  return isOut ? "On Rental" : "Available";
};

export const useFleetData = () => {
  const [fleet, setFleet] = useState(() => loadPersisted("fleet", INITIAL_FLEET));
  const [bookings, setBookings] = useState(() => loadPersisted("bookings", INITIAL_BOOKINGS));
  const [earnings, setEarnings] = useState(() => loadPersisted("earnings", INITIAL_EARNINGS));
  const [expenses, setExpenses] = useState(() => loadPersisted("expenses", INITIAL_EXPENSES));

  // Persist to localStorage whenever any collection changes, so data survives
  // refreshes, tab closes, and revisits — not just the lifetime of the component.
  useEffect(() => { savePersisted("fleet", fleet); }, [fleet]);
  useEffect(() => { savePersisted("bookings", bookings); }, [bookings]);
  useEffect(() => { savePersisted("earnings", earnings); }, [earnings]);
  useEffect(() => { savePersisted("expenses", expenses); }, [expenses]);

  const todayStr = new Date().toISOString().split("T")[0];

  // Every consumer of this hook (Dashboard, Fleet, Booking, Alerts, P&L, ...)
  // reads `bookings` / `fleet` from its return value below — so deriving the
  // live status here, once, is what makes "add a booking" ripple everywhere:
  // the booking's own status, the car's status, KPI counts, alerts, and the
  // P&L all recompute from these same derived arrays on every render.
  const bookingsWithStatus = bookings.map(b => ({ ...b, status: computeBookingStatus(b, todayStr) }));
  const fleetWithStatus = fleet.map(c => ({ ...c, status: computeFleetStatus(c, bookingsWithStatus) }));

  // Whenever a booking's derived status becomes "Completed" and it doesn't yet
  // have a matching earning record, auto-create one (unlocked, pending review).
  // This replaces the old dead handleCompleteBooking in Earning.jsx, which was
  // never wired to anything.
  useEffect(() => {
    const completedIds = bookings
      .filter(b => computeBookingStatus(b, todayStr) === "Completed")
      .map(b => b.id);
    if (completedIds.length === 0) return;

    setEarnings(prev => {
      const existingBookingIds = new Set(prev.map(e => e.bookingId));
      const missing = bookings.filter(b => completedIds.includes(b.id) && !existingBookingIds.has(b.id));
      if (missing.length === 0) return prev;

      let nextNum = Math.max(...prev.map(e => parseInt(e.id.slice(3)) || 0), 0);
      const newRecords = missing.map(b => {
        nextNum += 1;
        const days = Math.round((new Date(b.end) - new Date(b.start)) / 86400000);
        return {
          id: `ER-${String(nextNum).padStart(3, "0")}`,
          bookingId: b.id,
          plate: b.plate,
          customer: b.customer,
          start: b.start,
          end: b.end,
          days,
          rate: b.rate,
          total: b.rate * days,
          locked: false,
        };
      });
      return [...prev, ...newRecords];
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookings]);

  // ── FLEET OPERATIONS ──────────────────────────────────────────────────────
  const addFleet = (car) => {
    const newCar = {
      ...car,
      purchase: parseFloat(car.purchase),
      insurance: parseFloat(car.insurance),
      reg: parseFloat(car.reg),
      otherCharges: parseFloat(car.otherCharges || 0),
      maint: parseFloat(car.maint),
    };
    setFleet(prev => [...prev, newCar]);
  };

  const updateFleet = (plate, updates) => {
    setFleet(prev => prev.map(c => c.plate === plate ? { ...c, ...updates } : c));
  };

  const deleteFleet = (plate) => {
    setFleet(prev => prev.filter(c => c.plate !== plate));
  };

  // ── BOOKING OPERATIONS ────────────────────────────────────────────────────
  const addBooking = (booking) => {
    let newBooking;
    setBookings(prev => {
      const nextId = `BK-${String(Math.max(...prev.map(b => parseInt(b.id.slice(3))), 0) + 1).padStart(3, "0")}`;
      newBooking = {
        ...booking,
        id: nextId,
        rate: parseFloat(booking.rate),
        status: booking.status || "Active",
      };
      return [...prev, newBooking];
    });
    return newBooking;
  };

  const updateBooking = (bookingId, updates) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, ...updates } : b));
  };

  const deleteBooking = (bookingId) => {
    setBookings(prev => prev.filter(b => b.id !== bookingId));
  };

  // ── EARNINGS OPERATIONS ───────────────────────────────────────────────────
  const addEarning = (earning) => {
    setEarnings(prev => {
      const nextId = `ER-${String(Math.max(...prev.map(e => parseInt(e.id.slice(3))), 0) + 1).padStart(3, "0")}`;
      const newEarning = {
        ...earning,
        id: nextId,
        total: parseFloat(earning.total),
      };
      return [...prev, newEarning];
    });
  };

  const updateEarning = (earningId, updates) => {
    setEarnings(prev => prev.map(e => e.id === earningId ? { ...e, ...updates } : e));
  };

  const deleteEarning = (earningId) => {
    setEarnings(prev => prev.filter(e => e.id !== earningId));
  };

  // Auto-lock earnings when booking is completed
  const lockEarning = (bookingId) => {
    const earning = earnings.find(e => e.bookingId === bookingId);
    if (earning) {
      updateEarning(earning.id, { locked: true });
    }
  };

  // ── EXPENSE OPERATIONS ────────────────────────────────────────────────────
  const addExpense = (expense) => {
    setExpenses(prev => {
      const nextId = `EX-${String(Math.max(...prev.map(e => parseInt(e.id.slice(3))), 0) + 1).padStart(3, "0")}`;
      const newExpense = {
        ...expense,
        id: nextId,
        amount: parseFloat(expense.amount),
      };
      return [...prev, newExpense];
    });
  };

  const updateExpense = (expenseId, updates) => {
    setExpenses(prev => prev.map(e => e.id === expenseId ? { ...e, ...updates } : e));
  };

  const deleteExpense = (expenseId) => {
    setExpenses(prev => prev.filter(e => e.id !== expenseId));
  };

  // ── CALCULATIONS ──────────────────────────────────────────────────────────
  const calculateMetrics = () => {
    const totalFleet = fleetWithStatus.length;
    const activeFleet = fleetWithStatus.filter(c => c.status === "On Rental").length;
    const availableFleet = fleetWithStatus.filter(c => c.status === "Available").length;
    const bookedCars = new Set(bookingsWithStatus.filter(b => b.status === "Active" || b.status === "Upcoming").map(b => b.plate)).size;

    const totalBookings = bookings.length;
    const uniqueCustomers = new Set(bookings.map(b => b.customer)).size;

    const totalEarnings = earnings.reduce((sum, e) => sum + (e.total || 0), 0);
    const lockedEarnings = earnings.filter(e => e.locked).reduce((sum, e) => sum + (e.total || 0), 0);
    const pendingEarnings = earnings.filter(e => !e.locked).reduce((sum, e) => sum + (e.total || 0), 0);

    const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);

    const netProfit = totalEarnings - totalExpenses;

    return {
      totalFleet,
      activeFleet,
      availableFleet,
      bookedCars,
      totalBookings,
      uniqueCustomers,
      totalEarnings,
      lockedEarnings,
      pendingEarnings,
      totalExpenses,
      netProfit,
    };
  };

  const calculateMonthlyMetrics = (month) => {
    const monthEarnings = earnings.filter(e => e.start?.startsWith(month)).reduce((sum, e) => sum + (e.total || 0), 0);
    const monthExpenses = expenses.filter(e => e.date?.startsWith(month)).reduce((sum, e) => sum + (e.amount || 0), 0);
    const monthBookings = bookings.filter(b => b.start?.startsWith(month)).length;
    const monthCustomers = new Set(bookings.filter(b => b.start?.startsWith(month)).map(b => b.customer)).size;

    return {
      monthlyEarnings: monthEarnings,
      monthlyExpenses: monthExpenses,
      monthlyProfit: monthEarnings - monthExpenses,
      monthlyBookings: monthBookings,
      monthlyCustomers: monthCustomers,
    };
  };

  const calculateCarMetrics = (plate) => {
    const carEarnings = earnings.filter(e => e.plate === plate).reduce((sum, e) => sum + (e.total || 0), 0);
    const carExpenses = expenses.filter(e => e.plate === plate).reduce((sum, e) => sum + (e.amount || 0), 0);
    const carBookings = bookings.filter(b => b.plate === plate).length;
    const car = fleet.find(c => c.plate === plate);
    const totalInv = car ? (car.purchase + car.insurance + car.reg) : 0;
    const recoveryPct = totalInv > 0 ? Math.round((carEarnings / totalInv) * 100) : 0;

    return {
      earnings: carEarnings,
      expenses: carExpenses,
      profit: carEarnings - carExpenses,
      bookings: carBookings,
      investment: totalInv,
      recoveryPct: recoveryPct,
    };
  };

  // Per-car monthly revenue TARGET for a given month — derived from:
  //  1) how much of its purchase+insurance+reg cost was still unrecovered as of that month,
  //     spread over the months it had left before its COE expiry at that point in time
  //  2) its own maintenance-budget-per-month (annual maint % of investment, ÷ 12)
  //  3) a profit margin on top, so "target" means "profitable", not just "breakeven"
  const carMonthlyTarget = (car, month) => {
    const refDate = `${month}-28`; // a stable "as-of" day within the given month
    const inv = totalInv(car);
    const carEarningsToDate = earnings
      .filter(e => e.plate === car.plate && e.start && e.start.slice(0, 7) <= month)
      .reduce((s, e) => s + (e.total || 0), 0);
    const remainingInv = Math.max(inv - carEarningsToDate, 0);
    const daysLeft = Math.ceil((new Date(car.coe) - new Date(refDate)) / 86400000);
    const monthsLeft = Math.max(daysLeft / 30, 1); // never divide by 0 or a negative
    const monthlyDepreciation = remainingInv / monthsLeft;
    const monthlyMaint = (inv * (car.maint || 0) / 100) / 12;
    const breakeven = monthlyDepreciation + monthlyMaint;
    return breakeven * (1 + TARGET_MARGIN_PCT / 100);
  };

  // Fleet-wide monthly target for a given month (e.g. "2026-06") — sum of every car's own target.
  const calculateMonthlyTarget = (month) => {
    const total = fleet.reduce((sum, car) => sum + carMonthlyTarget(car, month), 0);
    return Math.round(total);
  };

  // A single car's monthly target, rounded — used by the Target vs Actual card.
  const calculateCarMonthlyTarget = (plate, month) => {
    const car = fleet.find(c => c.plate === plate);
    if (!car) return 0;
    return Math.round(carMonthlyTarget(car, month));
  };

  // Monthly operating BUDGET for a given month — the expected running cost baseline for the
  // whole fleet, built from each car's own annual maintenance % of its investment, ÷ 12.
  // Maintenance % doesn't change month to month, but the parameter is kept so this has the
  // same shape as calculateMonthlyTarget and can be extended later (e.g. once fleet records
  // track when a car joined, to exclude cars not yet owned in a given month).
  const calculateMonthlyBudget = (month) => {
    const total = fleet.reduce((sum, car) => sum + (totalInv(car) * (car.maint || 0) / 100) / 12, 0);
    return Math.round(total);
  };

  const getExpensesByCategory = (month) => {
    const monthExpenses = expenses.filter(e => e.date?.startsWith(month));
    const byCategory = {};

    monthExpenses.forEach(e => {
      byCategory[e.category] = (byCategory[e.category] || 0) + (e.amount || 0);
    });

    return byCategory;
  };

  const generateAlerts = () => {
    const alerts = [];
    const today = new Date().toISOString().split("T")[0];
    let alertId = 1;

    // COE expiry alerts
    fleet.forEach(car => {
      const coeDate = new Date(car.coe);
      const today_date = new Date(today);
      const daysUntil = Math.ceil((coeDate - today_date) / (1000 * 60 * 60 * 24));

      if (daysUntil <= 90) {
        alerts.push({
          id: alertId++,
          type: "coe",
          plate: car.plate,
          car: `${car.make} ${car.model}`,
          msg: `COE expires ${car.coe}`,
          days: Math.max(0, daysUntil),
          urgent: daysUntil <= 30,
        });
      }
    });

    // Booking return today alerts
    bookingsWithStatus.forEach(b => {
      const endDate = new Date(b.end).toISOString().split("T")[0];
      if (endDate === today && (b.status === "Active" || b.status === "Ending Today")) {
        alerts.push({
          id: alertId++,
          type: "return",
          plate: b.plate,
          car: fleet.find(c => c.plate === b.plate)?.make + " " + fleet.find(c => c.plate === b.plate)?.model,
          msg: `${b.customer} — Return by 6 PM`,
          days: 0,
          urgent: true,
        });
      }
    });

    // Upcoming booking alerts
    const tomorrow = new Date(new Date().getTime() + 86400000).toISOString().split("T")[0];
    bookings.forEach(b => {
      const startDate = new Date(b.start).toISOString().split("T")[0];
      if (startDate === tomorrow && (b.status === "Upcoming" || b.status === "Active")) {
        alerts.push({
          id: alertId++,
          type: "booking",
          plate: b.plate,
          car: fleet.find(c => c.plate === b.plate)?.make + " " + fleet.find(c => c.plate === b.plate)?.model,
          msg: `${b.customer} booking starts tomorrow`,
          days: 1,
          urgent: false,
        });
      }
    });

    return alerts;
  };

  // Wipes saved data and restores the original sample data — handy if local
  // storage gets into a bad state or the user just wants a clean slate.
  const resetData = () => {
    setFleet(INITIAL_FLEET);
    setBookings(INITIAL_BOOKINGS);
    setEarnings(INITIAL_EARNINGS);
    setExpenses(INITIAL_EXPENSES);
  };

  return {
    // Data
    fleet,
    bookings,
    earnings,
    expenses,
    alerts: generateAlerts(),
    resetData,

    // Fleet operations
    addFleet,
    updateFleet,
    deleteFleet,

    // Booking operations
    addBooking,
    updateBooking,
    deleteBooking,

    // Earnings operations
    addEarning,
    updateEarning,
    deleteEarning,
    lockEarning,

    // Expense operations
    addExpense,
    updateExpense,
    deleteExpense,

    // Calculations
    calculateMetrics,
    calculateMonthlyMetrics,
    calculateCarMetrics,
    calculateMonthlyTarget,
    calculateCarMonthlyTarget,
    calculateMonthlyBudget,
    getExpensesByCategory,
  };
};