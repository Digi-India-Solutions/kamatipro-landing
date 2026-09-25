import fs from "fs";
import path from "path";

export interface LeadRecord {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  message?: string;
  groups?: string;
  source: string;
  createdAt: string;
  emailSent: boolean;
  emailError?: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const LEADS_FILE = path.join(DATA_DIR, "leads.json");

export function saveLead(lead: Omit<LeadRecord, "id" | "createdAt">): LeadRecord {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    let leads: LeadRecord[] = [];
    if (fs.existsSync(LEADS_FILE)) {
      try {
        const content = fs.readFileSync(LEADS_FILE, "utf-8");
        leads = JSON.parse(content);
      } catch {
        leads = [];
      }
    }

    const newLead: LeadRecord = {
      ...lead,
      id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    };

    leads.unshift(newLead); // latest first
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), "utf-8");
    return newLead;
  } catch (err) {
    console.error("Error saving lead to file:", err);
    return {
      ...lead,
      id: `lead_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
  }
}

export function getLeads(): LeadRecord[] {
  try {
    if (!fs.existsSync(LEADS_FILE)) return [];
    const content = fs.readFileSync(LEADS_FILE, "utf-8");
    return JSON.parse(content);
  } catch {
    return [];
  }
}
