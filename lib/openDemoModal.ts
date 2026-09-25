export function openDemoModal(title?: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("open_demo_modal", {
        detail: { title },
      })
    );
  }
}
