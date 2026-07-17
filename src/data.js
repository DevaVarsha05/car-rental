// ── MONTHS (for month-filter dropdowns) ─────────────────────────────────────
export const MONTHS = [
  { value: "2026-04", label: "April 2026" },
  { value: "2026-05", label: "May 2026" },
  { value: "2026-06", label: "June 2026" },
];

// ── SAMPLE DATA ──────────────────────────────────────────────────────────────
export const FLEET = [
  { plate:"SBA 1234 X", make:"Toyota", model:"Corolla", year:2022, color:"Silver", purchase:26000, insurance:1200, reg:1300, otherCharges:0, purchaseDate:"2022-01-15", maint:7.5, coe:"2026-07-15", status:"On Rental", minRate:null, maxRate:null, targetRate:null, runningDaysTarget:null, profitPctTarget:null },
  { plate:"SBC 5678 Y", make:"Honda",  model:"Civic",   year:2021, color:"White",  purchase:22000, insurance:1100, reg:1100, otherCharges:0, purchaseDate:"2021-03-10", maint:7.5, coe:"2028-03-20", status:"On Rental", minRate:null, maxRate:null, targetRate:null, runningDaysTarget:null, profitPctTarget:null },
  { plate:"SBD 9012 Z", make:"Mazda",  model:"3",       year:2023, color:"Blue",   purchase:29000, insurance:1400, reg:1600, otherCharges:0, purchaseDate:"2023-02-05", maint:7.5, coe:"2028-11-10", status:"On Rental", minRate:null, maxRate:null, targetRate:null, runningDaysTarget:null, profitPctTarget:null },
  { plate:"SBE 3456 A", make:"Nissan", model:"Sylphy",  year:2022, color:"Black",  purchase:24500, insurance:1200, reg:1100, otherCharges:0, purchaseDate:"2022-06-20", maint:7.5, coe:"2027-06-30", status:"Available", minRate:null, maxRate:null, targetRate:null, runningDaysTarget:null, profitPctTarget:null },
  { plate:"SBF 7890 B", make:"Toyota", model:"Vios",    year:2020, color:"Red",    purchase:19500, insurance:1000, reg:1000, otherCharges:0, purchaseDate:"2020-09-01", maint:9.0, coe:"2025-09-15", status:"Maintenance", minRate:null, maxRate:null, targetRate:null, runningDaysTarget:null, profitPctTarget:null },
  { plate:"SBG 1122 C", make:"Honda",  model:"Jazz",    year:2021, color:"Grey",   purchase:20500, insurance:1050, reg:950,  otherCharges:0, purchaseDate:"2021-08-22", maint:7.5, coe:"2026-08-22", status:"Available", minRate:null, maxRate:null, targetRate:null, runningDaysTarget:null, profitPctTarget:null },
  { plate:"SBH 3344 D", make:"Hyundai",model:"Elantra", year:2023, color:"White",  purchase:25000, insurance:1150, reg:1200, otherCharges:0, purchaseDate:"2023-01-05", maint:7.5, coe:"2029-01-05", status:"On Rental", minRate:null, maxRate:null, targetRate:null, runningDaysTarget:null, profitPctTarget:null },
  { plate:"SBI 5566 E", make:"Kia",    model:"Cerato",  year:2022, color:"Silver", purchase:23000, insurance:1100, reg:1050, otherCharges:0, purchaseDate:"2022-10-18", maint:7.5, coe:"2027-10-18", status:"Available", minRate:null, maxRate:null, targetRate:null, runningDaysTarget:null, profitPctTarget:null },
];

export const BOOKINGS = [
  // April 2026
  { id:"BK-101", plate:"SBA 1234 X", customer:"Farah Diyanah",   ic:"S9601234K", contact:"96011234", start:"2026-04-03", end:"2026-04-10", pickup:"Punggol",      drop:"Punggol",      rate:90,  status:"Completed" },
  { id:"BK-102", plate:"SBC 5678 Y", customer:"Goh Chin Huat",   ic:"S8701234L", contact:"87011234", start:"2026-04-08", end:"2026-04-14", pickup:"Yishun",       drop:"Yishun",       rate:75,  status:"Completed" },
  { id:"BK-103", plate:"SBH 3344 D", customer:"Nurul Ain",       ic:"S9501234M", contact:"95011234", start:"2026-04-15", end:"2026-04-20", pickup:"Sengkang",     drop:"Sengkang",     rate:80,  status:"Completed" },
  // May 2026
  { id:"BK-201", plate:"SBD 9012 Z", customer:"Chua Beng Huat",  ic:"S8801234N", contact:"88011234", start:"2026-05-02", end:"2026-05-09", pickup:"Bedok",        drop:"Bedok",        rate:100, status:"Completed" },
  { id:"BK-202", plate:"SBA 1234 X", customer:"Suresh Pillai",   ic:"S9101234O", contact:"91011234", start:"2026-05-11", end:"2026-05-17", pickup:"Jurong East",  drop:"Jurong East",  rate:90,  status:"Completed" },
  { id:"BK-203", plate:"SBG 1122 C", customer:"Elaine Toh",      ic:"S9401234P", contact:"94011234", start:"2026-05-20", end:"2026-05-26", pickup:"Ang Mo Kio",   drop:"Ang Mo Kio",   rate:70,  status:"Completed" },
  // June 2026
  { id:"BK-001", plate:"SBA 1234 X", customer:"Ahmad bin Razif",  ic:"S8901234A", contact:"91234567", start:"2026-06-24", end:"2026-06-29", pickup:"Jurong East",   drop:"Jurong East",   rate:90,  status:"Active" },
  { id:"BK-002", plate:"SBC 5678 Y", customer:"Priya Nair",       ic:"S9012345B", contact:"98765432", start:"2026-06-25", end:"2026-06-30", pickup:"Woodlands",    drop:"Woodlands",    rate:75,  status:"Active" },
  { id:"BK-003", plate:"SBD 9012 Z", customer:"Wang Li Xin",      ic:"S8512345C", contact:"87654321", start:"2026-06-22", end:"2026-06-27", pickup:"Tampines",     drop:"Tampines",     rate:100, status:"Ending Today" },
  { id:"BK-004", plate:"SBE 3456 A", customer:"Raj Kumar",        ic:"S9234567D", contact:"92345678", start:"2026-06-28", end:"2026-07-05", pickup:"Bishan",       drop:"Bishan",       rate:100, status:"Upcoming" },
  { id:"BK-005", plate:"SBH 3344 D", customer:"Tan Mei Ling",     ic:"S9345678E", contact:"93456789", start:"2026-06-29", end:"2026-07-03", pickup:"Clementi",     drop:"Clementi",     rate:80,  status:"Upcoming" },
  { id:"BK-006", plate:"SBA 1234 X", customer:"Mohamed Farid",    ic:"S8756789F", contact:"81234567", start:"2026-06-10", end:"2026-06-18", pickup:"Jurong East",  drop:"Jurong East",  rate:90,  status:"Completed" },
  { id:"BK-007", plate:"SBC 5678 Y", customer:"Lim Siew Hoon",    ic:"S7612345G", contact:"97654321", start:"2026-06-05", end:"2026-06-12", pickup:"Woodlands",    drop:"Woodlands",    rate:75,  status:"Completed" },
  { id:"BK-008", plate:"SBG 1122 C", customer:"Kavitha Menon",    ic:"S9456789H", contact:"94567890", start:"2026-06-01", end:"2026-06-08", pickup:"Ang Mo Kio",   drop:"Ang Mo Kio",   rate:70,  status:"Completed" },
];

export const EARNINGS = [
  // April 2026
  { id:"ER-101", bookingId:"BK-101", plate:"SBA 1234 X", customer:"Farah Diyanah",  start:"2026-04-03", end:"2026-04-10", days:7,  rate:90,  total:630,  locked:true },
  { id:"ER-102", bookingId:"BK-102", plate:"SBC 5678 Y", customer:"Goh Chin Huat",  start:"2026-04-08", end:"2026-04-14", days:6,  rate:75,  total:450,  locked:true },
  { id:"ER-103", bookingId:"BK-103", plate:"SBH 3344 D", customer:"Nurul Ain",      start:"2026-04-15", end:"2026-04-20", days:5,  rate:80,  total:400,  locked:true },
  // May 2026
  { id:"ER-201", bookingId:"BK-201", plate:"SBD 9012 Z", customer:"Chua Beng Huat", start:"2026-05-02", end:"2026-05-09", days:7,  rate:100, total:700,  locked:true },
  { id:"ER-202", bookingId:"BK-202", plate:"SBA 1234 X", customer:"Suresh Pillai",  start:"2026-05-11", end:"2026-05-17", days:6,  rate:90,  total:540,  locked:true },
  { id:"ER-203", bookingId:"BK-203", plate:"SBG 1122 C", customer:"Elaine Toh",     start:"2026-05-20", end:"2026-05-26", days:6,  rate:70,  total:420,  locked:true },
  // June 2026
  { id:"ER-001", bookingId:"BK-006", plate:"SBA 1234 X", customer:"Mohamed Farid",  start:"2026-06-10", end:"2026-06-18", days:8,  rate:90,  total:720,  locked:true },
  { id:"ER-002", bookingId:"BK-007", plate:"SBC 5678 Y", customer:"Lim Siew Hoon",  start:"2026-06-05", end:"2026-06-12", days:7,  rate:75,  total:525,  locked:true },
  { id:"ER-003", bookingId:"BK-008", plate:"SBG 1122 C", customer:"Kavitha Menon",  start:"2026-06-01", end:"2026-06-08", days:7,  rate:70,  total:490,  locked:true },
  { id:"ER-004", bookingId:"BK-001", plate:"SBA 1234 X", customer:"Ahmad bin Razif",start:"2026-06-24", end:"2026-06-29", days:5,  rate:90,  total:450,  locked:false },
  { id:"ER-005", bookingId:"BK-002", plate:"SBC 5678 Y", customer:"Priya Nair",     start:"2026-06-25", end:"2026-06-30", days:5,  rate:75,  total:375,  locked:false },
  { id:"ER-006", bookingId:"BK-003", plate:"SBD 9012 Z", customer:"Wang Li Xin",    start:"2026-06-22", end:"2026-06-27", days:5,  rate:100, total:500,  locked:false },
];

export const EXPENSES = [
  // April 2026
  { id:"EX-101", plate:"SBH 3344 D", date:"2026-04-04", category:"Tyre Replacement", desc:"2 rear tyres replaced",      amount:260, receipt:true },
  { id:"EX-102", plate:"SBA 1234 X", date:"2026-04-16", category:"Cleaning & Detailing", desc:"Interior shampoo & wax", amount:110, receipt:false },
  // May 2026
  { id:"EX-201", plate:"SBD 9012 Z", date:"2026-05-06", category:"Routine Service",  desc:"40,000 km service",          amount:340, receipt:true },
  { id:"EX-202", plate:"SBG 1122 C", date:"2026-05-19", category:"Electrical Repair",desc:"Headlight replacement",      amount:180, receipt:true },
  // June 2026
  { id:"EX-001", plate:"SBA 1234 X", date:"2026-06-05", category:"Routine Service",  desc:"60,000 km service",          amount:380, receipt:true },
  { id:"EX-002", plate:"SBF 7890 B", date:"2026-06-10", category:"Body Repair",      desc:"Rear bumper dent repair",    amount:620, receipt:true },
  { id:"EX-003", plate:"SBC 5678 Y", date:"2026-06-12", category:"Tyre Replacement", desc:"2 front tyres replaced",     amount:280, receipt:false },
  { id:"EX-004", plate:"SBD 9012 Z", date:"2026-06-14", category:"Air-Con Service",  desc:"Gas top-up & cleaning",     amount:150, receipt:true },
  { id:"EX-005", plate:"SBG 1122 C", date:"2026-06-18", category:"Insurance Renewal",desc:"Annual premium renewal",     amount:1050, receipt:true },
  { id:"EX-006", plate:"SBE 3456 A", date:"2026-06-20", category:"Cleaning & Detailing", desc:"Full interior detailing", amount:120, receipt:false },
  { id:"EX-007", plate:"SBH 3344 D", date:"2026-06-22", category:"Electrical Repair",desc:"Battery replacement",        amount:220, receipt:true },
  { id:"EX-008", plate:"SBI 5566 E", date:"2026-06-24", category:"Road Tax / Registration", desc:"Annual road tax",     amount:420, receipt:true },
];

export const ALERTS = [
  { id:1, type:"coe",     plate:"SBA 1234 X", car:"Toyota Corolla",  msg:"COE expires 15 Jul 2026",  days:18,  urgent:true },
  { id:2, type:"coe",     plate:"SBG 1122 C", car:"Honda Jazz",      msg:"COE expires 22 Aug 2026",  days:56,  urgent:false },
  { id:3, type:"return",  plate:"SBD 9012 Z", car:"Mazda 3",         msg:"Wang Li Xin — Return by 6 PM", days:0, urgent:true },
  { id:4, type:"booking", plate:"SBE 3456 A", car:"Nissan Sylphy",   msg:"Raj Kumar booking starts tomorrow", days:1, urgent:false },
  { id:5, type:"booking", plate:"SBF 7890 B", car:"Toyota Vios",     msg:"Under maintenance since Jun 10", days:17, urgent:false },
];