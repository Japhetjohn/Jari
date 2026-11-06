export type ToastKind = "success" | "error" | "info";

export function notifyToast(kind: ToastKind, message: string) {
  if (typeof window === "undefined" || !message.trim()) return;
  window.dispatchEvent(new CustomEvent("jari:toast", { detail: { kind, message: message.trim() } }));
}
