import Link from "next/link";
import { ArrowLeft, Mail, Phone } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <div className="w-full">
      <div className="mb-7">
        <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#547253]">Account support</p>
        <h1 className="mt-3 font-serif text-3xl font-medium tracking-[-.03em] text-[#20291f] sm:text-4xl">Need help signing in?</h1>
        <p className="mt-2 text-sm leading-6 text-[#697268]">Password recovery is not available in this demo. Contact the JARI team and we’ll help you regain access.</p>
      </div>

      <div className="space-y-2 rounded-[1.2rem] bg-[#f2f4ee] p-3">
        <a href="mailto:info@jari.com?subject=JARI%20account%20access" className="flex min-h-12 items-center gap-3 rounded-xl bg-white px-3.5 py-3 transition-colors hover:bg-[#fbfcf8]"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#edf2e8] text-[#547253]"><Mail size={15} /></span><span><span className="block text-[9px] font-bold uppercase tracking-[.12em] text-[#899184]">Email</span><span className="block text-xs font-semibold text-[#344536]">info@jari.com</span></span></a>
        <a href="tel:+2348133153568" className="flex min-h-12 items-center gap-3 rounded-xl bg-white px-3.5 py-3 transition-colors hover:bg-[#fbfcf8]"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#edf2e8] text-[#547253]"><Phone size={15} /></span><span><span className="block text-[9px] font-bold uppercase tracking-[.12em] text-[#899184]">Call</span><span className="block text-xs font-semibold text-[#344536]">0813 315 3568</span></span></a>
      </div>

      <Link href="/login" className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#244b35] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#193d2b]"><ArrowLeft size={15} /> Back to sign in</Link>
    </div>
  );
}
