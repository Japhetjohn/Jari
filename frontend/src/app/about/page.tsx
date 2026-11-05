import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ClipboardList, HeartPulse, Landmark, MapPin, ShieldCheck, Sprout } from "lucide-react";
import { PublicFooter } from "@/components/layout/public-footer";
import { PublicHeader } from "@/components/layout/public-header";
import { ScrollReveal } from "@/components/landing/scroll-reveal";

export const metadata: Metadata = {
  title: "About JARI | Poultry farm intelligence and finance",
  description: "Learn how JARI organizes poultry farm data into risk insights, local advisory and pathways to finance and insurance.",
};

const steps = [
  { number: "01", icon: ClipboardList, title: "Bring records together", description: "Farm, flock, vaccination, production and financial details form a more complete picture of a poultry operation." },
  { number: "02", icon: HeartPulse, title: "Understand farm risk", description: "Structured information helps identify operational and financial factors that may need attention." },
  { number: "03", icon: ShieldCheck, title: "Find relevant support", description: "A clear profile can help farmers explore localized advisory and start finance or insurance conversations." },
];

const teamMembers = [
  { name: "Pererat Timothy", role: "Founder", profession: "Software Engineer", image: "/images/team/pererat.jpeg" },
  { name: "Japhet John", role: "Co-founder", profession: "Blockchain Developer", image: "/images/team/japhet.jpeg" },
  { name: "Fatima .S. Abubakar", role: "Co-founder", profession: "Product Manager", image: "/images/team/fatima.jpeg" },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fbfbf8] text-[#20291f]">
      <PublicHeader currentPage="about" />

      <section className="jari-landing-hero px-5 pb-12 pt-10 sm:px-8 sm:pb-16 sm:pt-14">
        <div className="mx-auto grid max-w-7xl items-center gap-9 lg:grid-cols-[.95fr_1.05fr] lg:gap-14">
          <ScrollReveal><div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full bg-[#edf1e8] px-3.5 py-2 text-[10px] font-bold uppercase tracking-[.15em] text-[#4b6749]"><MapPin size={13} /> Jos South · Plateau State</p>
            <h1 className="mt-5 font-serif text-[2.65rem] font-medium leading-[1.02] tracking-[-.045em] sm:text-5xl lg:text-6xl">Make poultry farms easier to understand and support.</h1>
            <p className="mt-5 max-w-xl text-sm leading-6 text-[#657064] sm:text-base sm:leading-7">JARI is an agricultural risk intelligence and finance platform. We bring farm information together to make poultry operations more transparent, measurable and risk-aware.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/#how-it-works" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#244b35] px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#193d2b]">See how it works <ArrowRight size={14} /></Link>
              <Link href="#contact" className="inline-flex min-h-11 items-center justify-center rounded-full px-5 py-2.5 text-xs font-semibold text-[#49634a] transition-colors hover:bg-[#edf1e8]">Talk with JARI</Link>
            </div>
          </div></ScrollReveal>

          <ScrollReveal delay={100}><div className="about-photo-scene relative mx-auto h-[340px] w-full max-w-[570px] sm:h-[430px]">
            <div className="about-farm-photo absolute inset-x-[9%] inset-y-0 overflow-hidden rounded-[2rem] sm:inset-x-[12%]">
              <Image src="/images/nigerian-poultry-house.jpg" alt="Chickens and feeders in a poultry house in Kano, Nigeria" fill sizes="(max-width: 1024px) 86vw, 42vw" className="hero-farm-photo object-cover object-[center_66%]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#17291c]/45 via-transparent to-transparent" />
            </div>
            <div className="hero-float-card absolute bottom-5 left-0 z-10 w-[48%] max-w-[225px] rounded-[1.25rem] bg-white p-4 shadow-[0_20px_52px_-32px_rgba(23,44,27,.45)] sm:bottom-8 sm:left-1 sm:p-5">
              <p className="text-[9px] font-bold uppercase tracking-[.15em] text-[#71806a]">A connected farm picture</p>
              <div className="mt-3 space-y-2">{[{ icon: ClipboardList, label: "Farm records" }, { icon: HeartPulse, label: "Bird health" }, { icon: Landmark, label: "Production & finances" }].map(({ icon: Icon, label }) => <p key={label} className="flex items-center gap-2 text-[10px] font-medium text-[#4b584b]"><Icon size={13} className="text-[#597455]" />{label}</p>)}</div>
            </div>
            <div className="hero-float-note absolute right-0 top-8 z-10 w-[37%] max-w-[170px] rounded-[1.1rem] bg-[#d9e5cc] p-3.5 shadow-[0_18px_44px_-30px_rgba(23,44,27,.4)] sm:right-1 sm:top-10 sm:p-4">
              <Sprout size={17} className="text-[#4e704b]" /><p className="mt-2 font-serif text-sm font-medium leading-snug text-[#2d4530] sm:text-base">A clearer next step.</p>
            </div>
          </div></ScrollReveal>
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-24 bg-[#f1f2f0] px-5 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal className="max-w-2xl"><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#5c795d]">What JARI does</p><h2 className="mt-3 font-serif text-3xl leading-[1.05] tracking-[-.035em] sm:text-5xl">From farm information to informed support.</h2><p className="mt-4 max-w-xl text-sm leading-6 text-[#697268]">Farmers add information as they go. JARI organizes it into a profile that helps make each operation easier to assess and support.</p></div></ScrollReveal>
          <div className="mt-8 grid gap-3 md:mt-11 md:grid-cols-3 md:gap-4">
            {steps.map(({ number, icon: Icon, title, description }, index) => <ScrollReveal key={number} delay={index * 100}><article className="flex h-full flex-col rounded-[1.35rem] bg-white p-5 sm:p-7">
              <div className="flex items-center justify-between"><span className="text-[12px] font-bold tracking-[.16em] text-[#82907c]">{number}</span><span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#edf1e8] text-[#52744e]"><Icon size={18} /></span></div>
              <h3 className="mt-8 font-serif text-xl font-medium text-[#29352a] sm:text-2xl">{title}</h3>
              <p className="mt-2 text-xs leading-5 text-[#687166] sm:text-sm sm:leading-6">{description}</p>
            </article></ScrollReveal>)}
          </div>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-9 lg:grid-cols-[.9fr_1.1fr] lg:gap-16">
          <ScrollReveal><div className="relative min-h-[300px] overflow-hidden rounded-[1.6rem] bg-[#e4e8df] sm:min-h-[400px]">
            <Image src="/images/nigerian-poultry-uyo.jpg" alt="Broiler chickens at a poultry farm in Uyo, Nigeria" fill sizes="(max-width: 1024px) 90vw, 42vw" className="object-cover object-center" />
          </div></ScrollReveal>
          <ScrollReveal delay={100}><div className="max-w-xl">
            <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#5c795d]">Why we are here</p>
            <h2 className="mt-3 font-serif text-3xl leading-[1.05] tracking-[-.035em] sm:text-5xl">Good decisions start with a clearer view.</h2>
            <p className="mt-4 text-sm leading-6 text-[#687166] sm:text-base sm:leading-7">Poultry farms carry important information in the routines of each day. When records are structured and considered together, farmers can better understand their operations and providers can have a more informed starting point.</p>
            <div className="mt-6 rounded-[1.2rem] bg-[#e9ede5] p-4 sm:p-5"><p className="text-[9px] font-bold uppercase tracking-[.14em] text-[#71806a]">Our mission</p><p className="mt-2 font-serif text-lg leading-snug text-[#344536] sm:text-xl">Make farms more transparent, measurable, risk-aware and financially accessible through data-driven intelligence.</p></div>
          </div></ScrollReveal>
        </div>
      </section>

      <section className="bg-[#244b35] px-5 py-12 text-white sm:px-8 sm:py-16">
        <ScrollReveal><div className="mx-auto grid max-w-7xl gap-5 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-10">
          <div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#cbd9c3]">Starting locally</p><h2 className="mt-2 font-serif text-2xl leading-tight sm:text-3xl">Jos South, Plateau State, Nigeria.</h2><p className="mt-2 max-w-xl text-xs leading-5 text-white/75 sm:text-sm sm:leading-6">JARI is starting with poultry farmers in Jos South, with localized agricultural advisory shaped around local farm conditions.</p></div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 text-xs font-semibold text-white"><MapPin size={14} className="text-[#d5e2c9]" /> Jos South</span>
        </div></ScrollReveal>
      </section>

      <section id="team" className="scroll-mt-24 bg-[#f1f2f0] px-5 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal className="max-w-2xl"><div>
            <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#5c795d]">The people behind JARI</p>
            <h2 className="mt-3 font-serif text-3xl leading-[1.05] tracking-[-.035em] sm:text-5xl">A team working alongside poultry farmers.</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#697268]">Meet the people building a clearer path from farm information to practical support.</p>
          </div></ScrollReveal>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:mt-11 lg:grid-cols-3 lg:gap-5">
            {teamMembers.map((member, index) => <ScrollReveal key={member.name} delay={index * 90}><article className="team-card group relative grid min-h-[190px] grid-cols-[38%_1fr] overflow-hidden rounded-[1.4rem] border border-[#e7e9e2] bg-white shadow-[0_12px_36px_-30px_rgba(28,54,33,.4)] sm:block sm:min-h-0 sm:border-0 sm:shadow-[0_18px_44px_-34px_rgba(28,54,33,.6)]">
              <div className="team-headshot relative min-h-full overflow-hidden bg-[#dfe6d8] sm:aspect-[4/5] sm:min-h-0">
                <Image src={member.image} alt={`${member.name}, ${member.role} of JARI`} fill sizes="(max-width: 640px) 38vw, (max-width: 1024px) 44vw, 30vw" className="object-cover object-center transition-transform duration-700 ease-out sm:group-hover:scale-[1.04]" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#17291c]/10 to-transparent sm:bg-gradient-to-t sm:from-[#17291c]/90 sm:via-[#17291c]/15 sm:to-transparent" />
                <span className="absolute left-2 top-2 rounded-full border border-white/60 bg-white/90 px-2 py-1 text-[8px] font-bold uppercase tracking-[.12em] text-[#426044] sm:left-3 sm:top-3 sm:px-2.5 sm:text-[9px]">{member.role}</span>
                <span className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-[9px] font-bold tracking-wide text-[#426044] sm:bottom-auto sm:left-3 sm:right-3 sm:top-3 sm:h-8 sm:w-8">0{index + 1}</span>
              </div>
              <div className="flex flex-col justify-center px-3 py-4 sm:absolute sm:inset-x-0 sm:bottom-0 sm:block sm:bg-gradient-to-t sm:from-[#17291c]/95 sm:via-[#17291c]/70 sm:to-transparent sm:px-5 sm:pb-5 sm:pt-16">
                <p className="text-[8px] font-bold uppercase tracking-[.16em] text-[#66815e] sm:text-[#d5e2c9]">JARI team</p>
                <h3 className="mt-1.5 font-serif text-base font-medium leading-tight tracking-[-.02em] text-[#29352a] sm:mt-2 sm:text-2xl sm:text-white">{member.name}</h3>
                <p className="mt-1.5 text-[10px] font-medium leading-snug text-[#71806a] sm:mt-1 sm:text-xs sm:text-white/80">{member.profession}</p>
              </div>
            </article></ScrollReveal>)}
          </div>
        </div>
      </section>

      <section id="contact" className="scroll-mt-24 px-5 py-12 sm:px-8 sm:py-16">
        <ScrollReveal><div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 rounded-[1.4rem] bg-[#e9ede5] px-5 py-6 sm:flex-row sm:items-center sm:gap-10 sm:px-8 sm:py-8">
          <div className="max-w-xl"><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#5c795d]">Talk with JARI</p><h2 className="mt-2 font-serif text-2xl leading-tight tracking-[-.025em] sm:text-3xl">Let&apos;s start with your farm.</h2><p className="mt-2 text-xs leading-5 text-[#697268] sm:text-sm sm:leading-6">Ask us about onboarding, local advisory or working with JARI.</p></div>
          <div className="flex flex-col gap-2 sm:min-w-[240px]"><a href="mailto:info@jari.com" className="rounded-xl bg-white/70 px-4 py-3 text-xs font-semibold text-[#344536] transition-colors hover:bg-white">Email <span className="ml-2 font-medium text-[#697268]">info@jari.com</span></a><a href="tel:+2348133153568" className="rounded-xl bg-white/70 px-4 py-3 text-xs font-semibold text-[#344536] transition-colors hover:bg-white">Call <span className="ml-2 font-medium text-[#697268]">0813 315 3568</span></a></div>
        </div></ScrollReveal>
      </section>

      <ScrollReveal><PublicFooter includeHeroPhotoCredit /></ScrollReveal>
    </main>
  );
}
