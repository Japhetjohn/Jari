import { ArrowDown, ArrowRight, ClipboardCheck, Egg, HeartPulse, Landmark, ShieldCheck, Sprout } from "lucide-react";
import { ScrollReveal } from "@/components/landing/scroll-reveal";

const records = [
  { icon: Egg, label: "Flocks & houses" },
  { icon: HeartPulse, label: "Vaccination & health" },
  { icon: ClipboardCheck, label: "Production" },
  { icon: Landmark, label: "Sales & costs" },
];

const profileAreas = [
  { icon: Sprout, title: "Farm operations", detail: "Flocks, feed and production" },
  { icon: HeartPulse, title: "Bird health", detail: "Vaccination and health records" },
  { icon: Landmark, title: "Farm finances", detail: "Sales and operating costs" },
];

const support = [
  { icon: Sprout, title: "Local advice" },
  { icon: Landmark, title: "Finance options" },
  { icon: ShieldCheck, title: "Insurance" },
];

export function FarmJourney() {
  return (
    <section aria-labelledby="farm-journey-heading" className="mx-auto max-w-7xl">
      <ScrollReveal className="mb-8 max-w-2xl sm:mb-10">
        <p className="text-[11px] font-semibold uppercase tracking-[.16em] text-[#5c795d]">How JARI helps</p>
        <h2 id="farm-journey-heading" className="mt-2 font-serif text-3xl leading-tight tracking-[-.025em] text-[#263329] sm:text-4xl">Your records can open the right doors.</h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-[#687166] sm:text-base">JARI turns everyday farm information into a clearer picture of your operation and its support options.</p>
      </ScrollReveal>

      <div className="grid items-center gap-5 lg:grid-cols-[1fr_42px_1.2fr_42px_.82fr] lg:gap-3">
        <ScrollReveal className="min-w-0" delay={0}>
          <article className="min-w-0 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-[.15em] text-[#718071]">Your farm</p>
            <h3 className="mt-2 font-serif text-xl font-medium text-[#29352a]">Start with what you know</h3>
            <p className="mt-1 text-xs leading-5 text-[#737c71]">Keep the records you already use.</p>
            <ul className="mt-5 space-y-3">
              {records.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-3 text-sm font-medium text-[#465348]">
                  <Icon aria-hidden="true" size={16} strokeWidth={1.7} className="shrink-0 text-[#6a8264]" />
                  {label}
                </li>
              ))}
            </ul>
          </article>
        </ScrollReveal>

        <div aria-hidden="true" className="flex h-5 items-center justify-center text-[#789175] lg:hidden"><ArrowDown size={17} /></div>
        <div aria-hidden="true" className="hidden items-center justify-center text-[#789175] lg:flex"><ArrowRight size={18} /></div>

        <ScrollReveal className="min-w-0" delay={110}>
          <article className="min-w-0 rounded-[1.5rem] bg-[#e9ede4] p-4 sm:p-5">
            <div className="rounded-2xl bg-[#fbfcf8] px-4 py-4 shadow-[0_18px_40px_-34px_rgba(30,53,35,.55)] sm:px-5 sm:py-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[.16em] text-[#6c8068]">JARI farm profile</p>
                  <h3 className="mt-1 font-serif text-xl font-medium tracking-tight text-[#28382b]">One connected picture</h3>
                </div>
                <span className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e9eee4] text-[#4e6d50]"><ClipboardCheck size={16} strokeWidth={1.7} /></span>
              </div>
              <p className="mt-2 text-[11px] leading-4 text-[#737c71]">Your farm information, brought together.</p>
              <div className="mt-4 space-y-3">
                {profileAreas.map(({ icon: Icon, title, detail }) => (
                  <div key={title} className="flex items-start gap-2.5">
                    <Icon aria-hidden="true" size={14} strokeWidth={1.7} className="mt-0.5 shrink-0 text-[#5e795a]" />
                    <div><p className="text-[11px] font-semibold leading-4 text-[#344237]">{title}</p><p className="mt-0.5 text-[10px] leading-4 text-[#737c71]">{detail}</p></div>
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-3 px-1 text-[10px] leading-4 text-[#687465]">A profile built from the information you provide.</p>
          </article>
        </ScrollReveal>

        <div aria-hidden="true" className="flex h-5 items-center justify-center text-[#789175] lg:hidden"><ArrowDown size={17} /></div>
        <div aria-hidden="true" className="hidden items-center justify-center text-[#789175] lg:flex"><ArrowRight size={18} /></div>

        <ScrollReveal className="min-w-0" delay={220}>
          <article className="min-w-0 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-[.15em] text-[#718071]">What next?</p>
            <h3 className="mt-2 font-serif text-xl font-medium text-[#29352a]">Support that fits</h3>
            <p className="mt-1 text-xs leading-5 text-[#737c71]">A better starting point for the next conversation.</p>
            <ul className="mt-4 space-y-1">
              {support.map(({ icon: Icon, title }) => (
                <li key={title} className="flex items-center gap-3 py-2 text-sm font-medium text-[#465348]">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e9eee4] text-[#4b6a4e]"><Icon size={15} strokeWidth={1.7} /></span>
                  {title}
                </li>
              ))}
            </ul>
            <p className="mt-2 text-[10px] leading-4 text-[#737c71]">Options depend on your farm and provider requirements.</p>
          </article>
        </ScrollReveal>
      </div>
    </section>
  );
}
