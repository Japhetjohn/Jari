"use client";
import { FormEvent, useState } from "react";
import { recordExpensePayment, recordSalePayment } from "@/services";
import type { FinancialPaymentRecord } from "@/services";

export function FinancialPaymentAction({ id, kind, balance, payments = [], onSaved }: { id: string; kind: "sale" | "expense"; balance: number; payments?: FinancialPaymentRecord[]; onSaved: () => void }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      const amount = Number(form.get("amount"));
      const date = String(form.get("date"));
      const note = String(form.get("note") || "").trim() || undefined;
      if (kind === "sale") recordSalePayment(id, amount, date, note);
      else recordExpensePayment(id, amount, date, note);
      setError(""); setOpen(false); onSaved();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not save this payment."); }
  };
  return <div className="flex flex-wrap items-center gap-2">{payments.length > 0 && <details className="relative"><summary className="cursor-pointer rounded-full bg-white px-3 py-2 text-xs font-semibold text-[#536453]">{payments.length} payment{payments.length === 1 ? "" : "s"}</summary><div className="absolute right-0 z-20 mt-2 w-64 space-y-2 rounded-xl bg-white p-3 shadow-lg">{payments.slice().reverse().map((payment) => <div key={payment.id} className="flex justify-between gap-3 text-xs"><span><span className="block font-medium">{payment.date}</span>{payment.note && <span className="block text-slate-500">{payment.note}</span>}</span><span className="shrink-0 font-semibold">₦{payment.amount.toLocaleString()}</span></div>)}</div></details>}{balance > 0 && <button type="button" onClick={() => { setError(""); setOpen(true); }} className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-emerald-800">Record payment</button>}{open && <div className="fixed inset-0 z-[100] flex items-end justify-center bg-[#17231a]/45 p-3 sm:items-center sm:p-6" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}><section role="dialog" aria-modal="true" aria-labelledby="payment-title" className="w-full max-w-md rounded-[1.4rem] bg-[#fbfcf8] p-5 sm:p-7"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#82907c]">{kind === "sale" ? "Money received" : "Bill payment"}</p><h3 id="payment-title" className="mt-1 font-serif text-2xl font-medium text-[#29352a]">Record a payment</h3><p className="mt-2 text-sm text-[#687664]">Remaining balance: ₦{balance.toLocaleString()}</p><form onSubmit={submit} className="mt-5 space-y-3"><label className="label-text block">Amount<input required name="amount" type="number" min="1" max={balance} step="1" className="input-shell" /></label><label className="label-text block">Date<input required name="date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} className="input-shell" /></label><label className="label-text block">Note (optional)<input name="note" maxLength={140} className="input-shell" /></label>{error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-xs text-red-800">{error}</p>}<div className="flex justify-end gap-2 pt-2"><button type="button" onClick={() => setOpen(false)} className="min-h-10 rounded-full px-4 text-xs font-semibold text-[#657061]">Cancel</button><button className="min-h-10 rounded-full bg-[#244b35] px-5 text-xs font-semibold text-white">Save payment</button></div></form></section></div>}</div>;
}
