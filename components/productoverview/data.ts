export type MemberRow = {
  member: string;
  mobile: string;
  groups: number;
  payable: string;
  paid: string;
  outstanding: string;
  status: "Active";
};

export const MEMBERS: MemberRow[] = [
  { member: "Ramesh Gupta", mobile: "98XXXXXX21", groups: 3, payable: "1,20,000.00", paid: "1,17,625.00", outstanding: "0.00", status: "Active" },
  { member: "Sunil Verma", mobile: "98XXXXXX44", groups: 2, payable: "3,00,000.00", paid: "2,76,250.00", outstanding: "23,750.00", status: "Active" },
  { member: "Anita Sharma", mobile: "99XXXXXX08", groups: 1, payable: "75,000.00", paid: "70,250.00", outstanding: "4,750.00", status: "Active" },
  { member: "Mohit Jain", mobile: "97XXXXXX63", groups: 2, payable: "2,10,000.00", paid: "1,95,600.00", outstanding: "14,400.00", status: "Active" },
  { member: "Kavita Singh", mobile: "98XXXXXX17", groups: 1, payable: "1,00,000.00", paid: "95,200.00", outstanding: "4,800.00", status: "Active" },
  { member: "Deepak Arora", mobile: "96XXXXXX35", groups: 2, payable: "80,000.00", paid: "72,875.00", outstanding: "7,125.00", status: "Active" },
];

export type GroupRow = {
  code: string;
  name: string;
  installment: string;
  members: number;
  chit: string;
  start: string;
  progress: string;
  next: string;
  status: "Active" | "Draft";
};

export const GROUPS: GroupRow[] = [
  { code: "GRP-2026-09", name: "SKS-001/50K/20", installment: "2,500.00", members: 20, chit: "50,000.00", start: "28-08-2026", progress: "8/20", next: "10-10-2026", status: "Active" },
  { code: "GRP-2026-10", name: "SKS-002/3L/14", installment: "15,000.00", members: 20, chit: "3,00,000.00", start: "14-09-2026", progress: "4/20", next: "10-10-2026", status: "Active" },
  { code: "GRP-2026-11", name: "SKS-003/5L/10", installment: "25,000.00", members: 20, chit: "5,00,000.00", start: "10-07-2026", progress: "6/20", next: "10-10-2026", status: "Active" },
  { code: "GRP-2026-12", name: "SKS-004/50K/10", installment: "2,500.00", members: 20, chit: "50,000.00", start: "10-05-2026", progress: "9/20", next: "10-10-2026", status: "Active" },
  { code: "GRP-2026-13", name: "SKS-005/50K/15", installment: "5,000.00", members: 10, chit: "50,000.00", start: "15-08-2026", progress: "3/10", next: "10-10-2026", status: "Active" },
  { code: "GRP-2026-14", name: "SKS-006/1L/15", installment: "5,000.00", members: 20, chit: "1,00,000.00", start: "15-08-2026", progress: "5/20", next: "10-10-2026", status: "Active" },
  { code: "GRP-2026-15", name: "SKS-007/50K/20", installment: "2,500.00", members: 20, chit: "50,000.00", start: "20-02-2026", progress: "12/20", next: "10-10-2026", status: "Active" },
  { code: "GRP-2026-16", name: "SKS-008/1L/20", installment: "5,000.00", members: 20, chit: "1,00,000.00", start: "20-05-2026", progress: "7/20", next: "10-10-2026", status: "Active" },
  { code: "GRP-2026-17", name: "SKS-009/50K/15", installment: "2,500.00", members: 20, chit: "50,000.00", start: "15-08-2026", progress: "Not started", next: "10-10-2026", status: "Draft" },
  { code: "GRP-2026-18", name: "SKS-010/50K/25", installment: "2,500.00", members: 20, chit: "50,000.00", start: "25-03-2026", progress: "10/20", next: "10-10-2026", status: "Active" },
];

export type AgeingBucket = {
  label: string;
  pct: number;
  amount: string;
  tone: "amber" | "grey";
};

export const AGEING: AgeingBucket[] = [
  { label: "Not yet due", pct: 0, amount: "₹0.00", tone: "grey" },
  { label: "1–30 days overdue", pct: 72, amount: "₹1,04,400.00", tone: "amber" },
  { label: "31–60 days overdue", pct: 18, amount: "₹26,100.00", tone: "amber" },
  { label: "61–90 days overdue", pct: 6, amount: "₹8,700.00", tone: "grey" },
  { label: "Over 90 days", pct: 4, amount: "₹5,800.00", tone: "grey" },
];

export const STATS = [
  { label: "Active Groups", value: "12", tone: "indigo" },
  { label: "Total Members", value: "240", tone: "teal" },
  { label: "Collections This Month", value: "₹18,40,000.00", tone: "green" },
  { label: "Pending / Overdue", value: "₹1,45,000.00", tone: "amber" },
];

export type AuctionCard = {
  name: string;
  code: string;
  cycle: string;
  status: "Scheduled";
  month: string;
  date: string;
  note: string;
  pool: string;
  action: string;
};

export const AUCTIONS: AuctionCard[] = [
  { name: "SKS-012/50K/30", code: "GRP-2026-20", cycle: "Cycle 6", status: "Scheduled", month: "Oct 2026", date: "Auction 10-10-2026", note: "19 members eligible to bid", pool: "50,000.00", action: "Open console" },
  { name: "SKS-011/1L/25", code: "GRP-2026-19", cycle: "Reserved cycle", status: "Scheduled", month: "Oct 2026", date: "Auction 10-10-2026", note: "Organizer ka cycle", pool: "1,00,000.00", action: "Complete cycle" },
  { name: "SKS-008/1L/20", code: "GRP-2026-16", cycle: "Cycle 8", status: "Scheduled", month: "Oct 2026", date: "Auction 10-10-2026", note: "20 members eligible to bid", pool: "1,00,000.00", action: "Open console" },
  { name: "SKS-007/50K/20", code: "GRP-2026-15", cycle: "Cycle 13", status: "Scheduled", month: "Oct 2026", date: "Auction 10-10-2026", note: "8 members eligible to bid", pool: "50,000.00", action: "Open console" },
];

export type CollectionRow = {
  member: string;
  group: string;
  installment: string;
  lateFee: string;
  due: string;
  status: "Paid" | "Pending" | "Overdue";
};

export const COLLECTIONS: CollectionRow[] = [
  { member: "Ramesh Gupta", group: "SKS-001/50K/20", installment: "2,500.00", lateFee: "0.00", due: "05-10-2026", status: "Paid" },
  { member: "Sunita Devi", group: "SKS-002/3L/14", installment: "15,000.00", lateFee: "0.00", due: "05-10-2026", status: "Paid" },
  { member: "Rakesh Kumar", group: "SKS-003/5L/10", installment: "25,000.00", lateFee: "250.00", due: "05-10-2026", status: "Overdue" },
  { member: "Meena Sharma", group: "SKS-004/50K/10", installment: "2,500.00", lateFee: "0.00", due: "05-10-2026", status: "Pending" },
  { member: "Anil Verma", group: "SKS-005/50K/15", installment: "5,000.00", lateFee: "0.00", due: "05-10-2026", status: "Paid" },
  { member: "Pooja Rani", group: "SKS-006/1L/15", installment: "5,000.00", lateFee: "100.00", due: "05-10-2026", status: "Overdue" },
  { member: "Suresh Chand", group: "SKS-007/50K/20", installment: "2,500.00", lateFee: "0.00", due: "05-10-2026", status: "Paid" },
  { member: "Kavita Devi", group: "SKS-008/1L/20", installment: "5,000.00", lateFee: "0.00", due: "05-10-2026", status: "Pending" },
];