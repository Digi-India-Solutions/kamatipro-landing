const CLOSED_KEY = "kp_popup_closed";
const LEAD_KEY = "kp_lead_sent";
const SESSION_KEY = "kp_popup_session";
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

function safeLocalGet(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeLocalSet(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {}
}

function safeSessionGet(key: string): string | null {
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSessionSet(key: string, value: string): void {
  try {
    window.sessionStorage.setItem(key, value);
  } catch {}
}

export function hasLeadSent(): boolean {
  return safeLocalGet(LEAD_KEY) !== null;
}

export function markLeadSent(): void {
  safeLocalSet(LEAD_KEY, String(Date.now()));
}

export function isClosedRecently(): boolean {
  const raw = safeLocalGet(CLOSED_KEY);
  if (!raw) return false;
  const ts = Number(raw);
  if (!isFinite(ts) || ts <= 0) return false;
  return Date.now() - ts < SEVEN_DAYS;
}

export function markPopupClosed(): void {
  safeLocalSet(CLOSED_KEY, String(Date.now()));
}

export function shownThisSession(): boolean {
  return safeSessionGet(SESSION_KEY) === "1";
}

export function markShownThisSession(): void {
  safeSessionSet(SESSION_KEY, "1");
}

export function canShowPopup(): boolean {
  if (typeof window === "undefined") return false;
  if (hasLeadSent()) return false;
  if (isClosedRecently()) return false;
  if (shownThisSession()) return false;
  return true;
}