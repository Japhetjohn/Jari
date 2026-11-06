"use client";
import { useEffect, useRef, useState } from "react";
import { Download, Eye, FileText, Trash2, Upload, X } from "lucide-react";
import { addFarmDocument, getFarmDocuments, removeFarmDocument, type FarmDocumentRecord } from "@/services";

const supported = new Set([".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx", ".xls", ".xlsx"]);
const extension = (name: string) => name.slice(name.lastIndexOf(".")).toLowerCase();
export default function DocumentsPage() {
  const [documents, setDocuments] = useState<FarmDocumentRecord[]>([]);
  const [selected, setSelected] = useState<FarmDocumentRecord | null>(null);
  const [error, setError] = useState(""); const [notice, setNotice] = useState(""); const [busy, setBusy] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => { const sync = () => setDocuments(getFarmDocuments()); sync(); window.addEventListener("jari:mock-data-changed", sync); return () => window.removeEventListener("jari:mock-data-changed", sync); }, []);
  const upload = async (file?: File) => {
    if (!file) return;
    setError(""); setNotice("");
    if (!supported.has(extension(file.name))) { setError("Choose a PDF, image or Office document."); return; }
    if (file.size > 2_500_000) { setError("Files must be up to 2.5 MB each."); return; }
    if (file.size === 0) { setError("This file is empty. Choose a file with content."); return; }
    setBusy(true);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("Could not read this file.")); reader.onerror = () => reject(new Error("Could not read this file.")); reader.readAsDataURL(file); });
      addFarmDocument({ name: file.name, type: file.type || "application/octet-stream", size: file.size, dataUrl });
      setNotice("Document saved in this browser.");
    } catch (reason) {
      const issue = reason as DOMException;
      setError(issue?.name === "QuotaExceededError" || /quota|storage full/i.test(issue?.message || "") ? "Browser storage is full. Download a backup or remove unused documents, then try again." : issue instanceof Error ? issue.message : "Could not save this document. Try again.");
    } finally { setBusy(false); if (input.current) input.current.value = ""; }
  };
  const remove = (file: FarmDocumentRecord) => {
    if (!window.confirm(`Remove ${file.name} from this browser?`)) return;
    try { removeFarmDocument(file.id); if (selected?.id === file.id) setSelected(null); setNotice("Document removed."); setError(""); }
    catch (reason) { setError(reason instanceof Error && /quota/i.test(reason.name + reason.message) ? "Browser storage is full. The document could not be removed; download a backup and try again." : "The document could not be removed. Try again."); }
  };
  const size = (bytes: number) => bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(0)} KB`;
  const canPreview = (file: FarmDocumentRecord) => file.type === "application/pdf" || file.type.startsWith("image/");
  return <div className="mx-auto max-w-4xl space-y-6"><header><p className="text-sm font-semibold uppercase tracking-[.18em] text-emerald-700">Farm records</p><h2 className="mt-2 text-3xl font-bold text-slate-900">Farm documents</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Keep copies of records you may need when speaking with an adviser. Files stay in this browser demo; they are not uploaded to JARI servers.</p></header>
    {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-800">{error}</p>}{notice && <p role="status" className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">{notice}</p>}
    <section className="rounded-2xl bg-white p-6"><input ref={input} className="sr-only" type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx" onChange={(event) => void upload(event.target.files?.[0])} /><button type="button" disabled={busy} onClick={() => input.current?.click()} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-emerald-800 px-5 text-sm font-semibold text-white disabled:opacity-60"><Upload size={16} />{busy ? "Saving file…" : "Choose a document"}</button><p className="mt-3 text-xs text-slate-500">PDF, JPG, PNG or Office file · maximum 1.5 MB per file. Large files may use more browser storage than their file size.</p></section>
    <section className="space-y-3">{documents.map((file) => <article key={file.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-4"><div className="flex min-w-0 items-center gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#edf2e8] text-emerald-800"><FileText size={18} /></span><div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-900">{file.name}</p><p className="mt-1 text-xs text-slate-500">{size(file.size)} · Added {new Date(file.addedAt).toLocaleDateString()}</p></div></div><div className="flex items-center gap-1"><button type="button" onClick={() => setSelected(file)} className="inline-flex min-h-10 items-center gap-1 rounded-full px-3 text-xs font-semibold text-[#36523b]"><Eye size={14} />View</button><a href={file.dataUrl} download={file.name} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[#edf2e8] px-3 text-xs font-semibold text-[#36523b]"><Download size={14} />Download</a><button type="button" onClick={() => remove(file)} aria-label={`Remove ${file.name}`} className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-red-50 hover:text-red-700"><Trash2 size={15} /></button></div></article>)}{!documents.length && <div className="rounded-2xl bg-white p-8 text-center"><FileText className="mx-auto text-slate-300" size={25} /><p className="mt-3 text-sm font-medium text-slate-800">No documents saved</p><p className="mt-1 text-xs text-slate-500">Add vaccination cards, receipts or other farm documents.</p></div>}</section>
    {selected && <div className="fixed inset-0 z-[90] flex items-end justify-center bg-[#17231a]/50 p-3 sm:items-center sm:p-6" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}><section role="dialog" aria-modal="true" aria-labelledby="document-preview-title" className="flex max-h-[92dvh] w-full max-w-4xl flex-col overflow-hidden rounded-[1.5rem] bg-[#fbfcf8] p-4 sm:p-6"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#82907c]">Document preview</p><h3 id="document-preview-title" className="mt-1 truncate font-serif text-xl font-medium text-[#29352a]">{selected.name}</h3></div><button type="button" onClick={() => setSelected(null)} aria-label="Close preview" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#edf2e8] text-[#55734f]"><X size={17} /></button></div><div className="mt-4 min-h-40 flex-1 overflow-auto rounded-xl bg-white p-2">{selected.type.startsWith("image/") ? <img src={selected.dataUrl} alt={selected.name} className="mx-auto max-h-[65dvh] max-w-full object-contain" /> : selected.type === "application/pdf" ? <iframe title={`Preview ${selected.name}`} src={selected.dataUrl} className="h-[65dvh] w-full rounded-lg" /> : <div className="grid min-h-40 place-items-center p-6 text-center"><p className="text-sm leading-6 text-slate-600">This file type cannot be previewed in the browser. Download it to open it with a suitable app.</p></div>}</div><div className="mt-3 flex justify-end"><a href={selected.dataUrl} download={selected.name} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[#244b35] px-4 text-xs font-semibold text-white"><Download size={14} />Download file</a></div></section></div>}
  </div>;
}
