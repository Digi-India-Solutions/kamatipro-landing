export function formatINR(amount: number): string {
  if (!isFinite(amount)) return "₹0";
  return "₹" + Math.round(amount).toLocaleString("en-IN");
}