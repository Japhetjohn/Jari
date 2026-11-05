import Link from "next/link";
import Image from "next/image";
import { Activity, ArrowDown, ArrowRight, Check, ClipboardList, HeartPulse, Landmark, Leaf, Mail, MapPin, Phone, ShieldCheck, Sprout } from "lucide-react";
import { ScrollReveal } from "@/components/landing/scroll-reveal";
import { PublicFooter } from "@/components/layout/public-footer";
import { PublicHeader } from "@/components/layout/public-header";

const serviceCards = [
  { number: "01", title: "Know the whole farm", detail: "Bring flock, vaccination, production and financial records into one clear farm profile.", tone: "bg-[#f0f1e9]", icon: ClipboardList },
  { number: "02", title: "See what needs attention", detail: "Understand the operational and financial factors shaping your farm’s risk picture.", tone: "bg-[#d9e5cc]", icon: Activity },
  { number: "03", title: "Find support that fits", detail: "Use your profile to start relevant conversations about finance and insurance options.", tone: "bg-[#254a35] text-white", icon: ShieldCheck },
  { number: "04", title: "Make informed decisions", detail: "Get localized agricultural guidance to support better farm management.", tone: "bg-[#ece6d9]", icon: Sprout },
];

const questions = [
  { question: "What is JARI?", answer: "JARI helps poultry farmers organize farm information, understand risk and connect with relevant advisory, finance and insurance pathways." },
  { question: "What information goes into a farm profile?", answer: "Farm and flock details, vaccination and health records, production information and farm finances. You can build your profile with the information you have and add to it over time." },
  { question: "Does a JARI profile guarantee a loan or insurance?", answer: "No. A profile helps make farm information clearer for assessment. Finance and insurance decisions are made by the relevant providers and depend on their requirements." },
  { question: "Where is JARI starting?", answer: "JARI is starting with poultry farmers in Jos South, Plateau State, Nigeria." },
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fbfbf8] text-[#20291f]">
      <PublicHeader />

      <section className="jari-landing-hero px-5 pb-14 pt-10 sm:px-8 sm:pb-20 sm:pt-14">
        <div className="mx-auto max-w-7xl">
          <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
            <p className="hero-content inline-flex items-center gap-2 rounded-full bg-[#edf1e8] px-3.5 py-2 text-[10px] font-bold uppercase tracking-[.15em] text-[#4b6749] sm:text-xs">
              <MapPin size={13} /> Welcome to JARI
            </p>
            <h1 className="hero-content mt-6 max-w-4xl font-serif text-[2.75rem] font-medium leading-[.99] tracking-[-.055em] sm:mt-7 sm:text-6xl lg:text-[5.4rem]">
              Make your farm easier to <span className="relative inline-block text-[#50724c]">understand<span aria-hidden="true" className="hero-underline" /></span>.
            </h1>
            <p className="hero-content mt-5 max-w-2xl text-sm leading-6 text-[#657064] sm:mt-6 sm:text-base sm:leading-7">
              JARI turns everyday poultry farm records into a clearer picture of risk and a better starting point for the support your farm needs.
            </p>
            <div className="hero-content mt-6 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
              <Link href="/register" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#244b35] px-6 py-3 text-sm font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5 hover:bg-[#193d2b] sm:w-auto">Create your farm profile <ArrowRight size={16} /></Link>
              <Link href="#how-it-works" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-[#3f5943] transition-colors hover:bg-[#eff2eb]">See how it works <ArrowDown size={14} /></Link>
            </div>
          </div>

          <div className="hero-scene relative mx-auto mt-9 h-[330px] max-w-5xl sm:mt-12 sm:h-[410px] lg:h-[470px]">
            <div className="hero-photo hero-photo-main absolute inset-x-[12%] top-0 h-[270px] overflow-hidden rounded-[1.65rem] sm:inset-x-[18%] sm:h-[350px] sm:rounded-[2rem] lg:inset-x-[21%] lg:h-[390px]">
              <Image src="/images/nigerian-poultry-house.jpg" alt="Chickens and feeders inside a poultry house in Kano, Nigeria" fill priority sizes="(max-width: 640px) 76vw, (max-width: 1024px) 64vw, 58vw" className="hero-farm-photo object-cover object-[center_65%]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#14241a]/45 via-transparent to-transparent" />
            </div>
            <div className="hero-float-card absolute left-0 top-[35px] z-10 w-[44%] max-w-[210px] rounded-[1.15rem] bg-white p-3 shadow-[0_18px_48px_-28px_rgba(23,44,27,.42)] sm:left-[4%] sm:top-[50px] sm:w-[200px] sm:p-4">
              <div className="flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#eaf0e4] text-[#52744e]"><HeartPulse size={14} /></span><span className="text-[9px] font-bold uppercase tracking-[.11em] text-[#63735e] sm:text-[10px]">Farm records</span></div>
              <p className="mt-3 font-serif text-sm font-medium text-[#28382b] sm:text-base">Small details, together.</p>
              <div className="mt-2.5 space-y-1.5 text-[9px] text-[#768071] sm:text-[10px]"><div className="flex justify-between"><span>Flock &amp; housing</span><Check size={11} className="text-[#698361]" /></div><div className="flex justify-between"><span>Health &amp; vaccination</span><Check size={11} className="text-[#698361]" /></div><div className="flex justify-between"><span>Production &amp; costs</span><Check size={11} className="text-[#698361]" /></div></div>
            </div>
            <div className="hero-float-note absolute bottom-8 right-0 z-10 w-[40%] max-w-[200px] rounded-[1.15rem] bg-[#d8e7cc] p-3 shadow-[0_18px_42px_-30px_rgba(23,44,27,.35)] sm:bottom-12 sm:right-[3%] sm:w-[190px] sm:p-4">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/75 text-[#4a6d47]"><Leaf size={15} /></span>
              <p className="mt-2 font-serif text-sm font-medium leading-snug text-[#2d4530] sm:text-base">A farm profile that can open a new conversation.</p>
              <p className="mt-1.5 text-[9px] leading-4 text-[#61745c] sm:text-[10px]">Advisory · Finance · Insurance</p>
            </div>
            <span aria-hidden="true" className="hero-orbit absolute left-[17%] top-[22%] h-3 w-3 rounded-full bg-[#bc9146] sm:left-[21%]" />
            <span aria-hidden="true" className="hero-orbit hero-orbit-late absolute right-[16%] top-[10%] h-2 w-2 rounded-full bg-[#6d8a5e] sm:right-[20%]" />
          </div>

          <div className="mx-auto -mt-1 grid max-w-4xl grid-cols-2 gap-y-4 rounded-[1.25rem] bg-[#f1f2ec] px-4 py-4 sm:grid-cols-4 sm:gap-2 sm:px-7 sm:py-5">
            {["Farm details", "Bird health", "Production", "Farm finances"].map((item, index) => <div key={item} className="flex items-center justify-center gap-2 text-[10px] font-semibold text-[#596756] sm:text-xs"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[9px] font-bold text-[#6a8264]">0{index + 1}</span>{item}</div>)}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-24 bg-[#f1f2f0] px-5 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-lg">
            <ScrollReveal><div>
              <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#5c795d]">The JARI approach</p>
              <h2 className="mt-3 font-serif text-3xl leading-[1.06] tracking-[-.035em] sm:text-5xl">A farm is more than its flock.</h2>
              <p className="mt-3 max-w-md text-sm leading-6 text-[#697268]">When the everyday details are in one place, the whole operation becomes easier to see.</p>
            </div></ScrollReveal>
          </div>
          <div className="relative mt-9 grid items-center gap-5 sm:mt-12 lg:grid-cols-[1fr_1.1fr_1fr] lg:gap-10">
            <div className="space-y-4 sm:space-y-6">
              <ScrollReveal delay={0}><article className="flex gap-3 py-2 sm:gap-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#52744e]"><ClipboardList size={18} /></span><div><h3 className="font-serif text-lg font-medium">Everyday records</h3><p className="mt-1 text-xs leading-5 text-[#71786f]">Flock, housing, vaccination, production and costs.</p></div></article></ScrollReveal>
              <ScrollReveal delay={90}><article className="flex gap-3 py-2 sm:gap-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#52744e]"><Activity size={18} /></span><div><h3 className="font-serif text-lg font-medium">A clearer risk picture</h3><p className="mt-1 text-xs leading-5 text-[#71786f]">Understand factors that may affect farm operations and finances.</p></div></article></ScrollReveal>
            </div>
            <ScrollReveal className="order-first lg:order-none"><div className="profile-illustration mx-auto w-full max-w-[390px] rotate-[-3deg] rounded-[1.5rem] bg-[#244b35] p-4 text-white shadow-[0_30px_60px_-42px_rgba(29,58,36,.6)] sm:p-6">
              <div className="flex items-start justify-between"><div><p className="text-[9px] font-bold uppercase tracking-[.17em] text-[#c4d4b8]">JARI farm profile</p><p className="mt-1 font-serif text-xl sm:text-2xl">Your farm, connected.</p></div><span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10"><Sprout size={17} /></span></div>
              <div className="mt-5 grid grid-cols-2 gap-2.5 sm:mt-7 sm:gap-3">{[{ icon: ClipboardList, label: "Farm records" }, { icon: HeartPulse, label: "Bird health" }, { icon: Activity, label: "Production" }, { icon: Landmark, label: "Farm finances" }].map(({ icon: Icon, label }) => <div key={label} className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-3 text-[10px] font-medium sm:text-xs"><Icon size={15} className="text-[#d6e5c8]" />{label}</div>)}</div>
              <div className="mt-4 flex items-center justify-between rounded-xl bg-[#d7e5ca] px-3 py-3 text-[#2e4931] sm:px-4"><div><p className="text-[8px] font-bold uppercase tracking-[.13em] text-[#5f755a]">Together, they form</p><p className="mt-0.5 font-serif text-base sm:text-lg">A farm risk profile</p></div><ArrowRight size={18} /></div>
            </div></ScrollReveal>
            <div className="space-y-4 sm:space-y-6">
              <ScrollReveal delay={150}><article className="flex gap-3 py-2 sm:gap-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#52744e]"><ShieldCheck size={18} /></span><div><h3 className="font-serif text-lg font-medium">Relevant pathways</h3><p className="mt-1 text-xs leading-5 text-[#71786f]">A better starting point for finance or insurance conversations.</p></div></article></ScrollReveal>
              <ScrollReveal delay={240}><article className="flex gap-3 py-2 sm:gap-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#52744e]"><Sprout size={18} /></span><div><h3 className="font-serif text-lg font-medium">Local guidance</h3><p className="mt-1 text-xs leading-5 text-[#71786f]">Agricultural advisory grounded in local farm conditions.</p></div></article></ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="scroll-mt-24 px-5 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal className="mx-auto max-w-xl text-center"><div>
            <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#5c795d]">What JARI brings together</p>
            <h2 className="mt-3 font-serif text-3xl leading-tight tracking-[-.035em] sm:text-5xl">A stronger picture of your farm.</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#697268]">Practical information and support, designed around poultry farming.</p>
          </div></ScrollReveal>
          <div className="mt-8 grid gap-3 sm:mt-11 sm:grid-cols-2 sm:gap-4">
            {serviceCards.map(({ number, title, detail, tone, icon: Icon }, index) => <ScrollReveal key={number} delay={index * 85}><article className={`group relative flex min-h-[180px] flex-col justify-between overflow-hidden rounded-[1.4rem] p-5 transition-transform duration-500 hover:-translate-y-1 sm:min-h-[205px] sm:p-7 ${tone}`}>
              <div className="flex items-start justify-between"><span className={`text-[12px] font-bold tracking-[.16em] ${tone.includes("text-white") ? "text-white/65" : "text-[#788174]"}`}>{number}</span><span className={`flex h-9 w-9 items-center justify-center rounded-full ${tone.includes("text-white") ? "bg-white/10 text-[#dce8cf]" : "bg-white/75 text-[#55704f]"}`}><Icon size={17} /></span></div>
              <div className="relative z-10 mt-8 max-w-sm"><h3 className="font-serif text-xl font-medium sm:text-2xl">{title}</h3><p className={`mt-2 max-w-sm text-xs leading-5 sm:text-sm sm:leading-6 ${tone.includes("text-white") ? "text-white/75" : "text-[#697268]"}`}>{detail}</p></div>
              <span aria-hidden="true" className={`feature-orbit absolute -bottom-12 -right-8 h-32 w-32 rounded-full ${tone.includes("text-white") ? "bg-white/[.06]" : "bg-[#7b936b]/[.09]"}`} />
            </article></ScrollReveal>)}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#203f2d] px-5 py-14 text-white sm:px-8 sm:py-20">
        <div aria-hidden="true" className="integration-glow absolute -bottom-48 -left-32 h-[27rem] w-[27rem] rounded-full bg-[#779267]/20 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[.9fr_1.1fr] lg:gap-16">
          <ScrollReveal><div className="max-w-lg">
            <p className="text-[10px] font-bold uppercase tracking-[.17em] text-[#c3d5b6]">From records to support</p>
            <h2 className="mt-3 font-serif text-3xl leading-[1.04] tracking-[-.035em] sm:text-5xl">Make the next conversation count.</h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-[#e0e8dc]/80">A clear farm profile can help farmers and support providers start with the same picture whether the conversation is about advice, insurance or finance.</p>
            <Link href="/about" className="mt-6 inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-[#eff3e9] px-5 py-2.5 text-xs font-semibold text-[#294430] transition-colors hover:bg-white">Explore JARI <ArrowRight size={14} /></Link>
          </div></ScrollReveal>
          <ScrollReveal delay={120}><div className="relative mx-auto grid w-full max-w-[520px] grid-cols-2 gap-3 sm:gap-4">
            <div className="col-span-2 flex items-center gap-4 rounded-[1.3rem] bg-white/[.09] p-4 sm:p-5"><span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#d9e6cd] text-[#315138]"><ClipboardList size={20} /></span><div><p className="text-[9px] font-bold uppercase tracking-[.13em] text-[#c6d6bb]">Start with</p><p className="mt-1 font-serif text-lg sm:text-xl">Your farm’s information</p></div></div>
            {[{ title: "Local advisory", icon: Sprout }, { title: "Insurance options", icon: ShieldCheck }, { title: "Finance pathways", icon: Landmark }].map(({ title, icon: Icon }, index) => <div key={title} className={`${index === 2 ? "col-span-2 sm:col-span-1" : ""} flex min-h-[112px] flex-col justify-between rounded-[1.2rem] p-4 sm:min-h-[140px] sm:p-5 ${index === 1 ? "bg-[#c7dbb5] text-[#294430]" : "bg-white/[.09] text-white"}`}><Icon size={18} className={index === 1 ? "text-[#466442]" : "text-[#d5e2c9]"} /><p className="font-serif text-base sm:text-lg">{title}</p></div>)}
            <div aria-hidden="true" className="absolute left-1/2 top-[38%] hidden h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full bg-[#a8c197] text-[#294430] shadow-lg sm:flex"><ArrowDown size={16} /></div>
          </div></ScrollReveal>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
          <ScrollReveal className="max-w-md"><div>
            <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#5c795d]">Starting locally</p>
            <h2 className="mt-3 font-serif text-3xl leading-[1.05] tracking-[-.035em] sm:text-5xl">Built around real poultry farms.</h2>
            <p className="mt-4 text-sm leading-6 text-[#697268]">JARI is beginning with poultry farmers in Jos South, Plateau State. The work starts by listening, recording what matters and building a profile one step at a time.</p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#edf1e8] px-3.5 py-2 text-xs font-semibold text-[#4c694a]"><MapPin size={14} /> Jos South · Plateau State · Nigeria</div>
          </div></ScrollReveal>
          <div className="grid gap-3 sm:grid-cols-[1.15fr_.85fr] sm:gap-4">
            <ScrollReveal delay={80}>
              <figure className="relative min-h-[240px] overflow-hidden rounded-[1.4rem] bg-[#e4e8df] sm:min-h-[340px]">
                <Image src="/images/nigerian-poultry-uyo.jpg" alt="Broiler chickens at a poultry farm in Uyo, Nigeria" fill sizes="(max-width: 640px) 90vw, 45vw" className="object-cover object-center transition-transform duration-700 hover:scale-[1.035]" />
              </figure>
            </ScrollReveal>
            <ScrollReveal delay={160}><div className="flex min-h-[220px] flex-col justify-between overflow-hidden rounded-[1.4rem] bg-[#e8eddf] p-5 sm:min-h-[340px] sm:p-6"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#52744e]"><MapPin size={17} /></span><div><p className="text-[9px] font-bold uppercase tracking-[.14em] text-[#71806a]">Our starting point</p><p className="mt-2 font-serif text-2xl leading-tight text-[#28382b] sm:text-3xl">Jos South, Plateau State.</p><p className="mt-2 text-xs leading-5 text-[#697268]">Local context matters when understanding a farm and the risks it faces.</p></div><span className="mt-5 flex items-center gap-2 text-[10px] font-semibold text-[#50684c]">Built for the realities of local poultry farming</span></div></ScrollReveal>
          </div>
        </div>
      </section>

      <section id="faq" className="scroll-mt-24 bg-[#f1f2f0] px-5 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <ScrollReveal className="text-center"><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#5c795d]">A few helpful answers</p><h2 className="mt-3 font-serif text-3xl tracking-[-.035em] sm:text-4xl">Questions about JARI</h2></div></ScrollReveal>
          <div className="mt-7 space-y-2.5 sm:mt-9">
            {questions.map(({ question, answer }, index) => <ScrollReveal key={question} delay={index * 65}><details className="faq-item group rounded-[1rem] bg-white px-4 py-4 open:bg-[#e8eddf] sm:px-5 sm:py-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-[#303a31] marker:hidden [&::-webkit-details-marker]:hidden">{question}<span aria-hidden="true" className="faq-plus flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f0f2ec] text-[#52704d] group-open:rotate-45"><span className="text-lg font-normal leading-none">+</span></span></summary><p className="max-w-2xl pt-3 pr-8 text-xs leading-5 text-[#697268] sm:text-sm sm:leading-6">{answer}</p></details></ScrollReveal>)}
          </div>
        </div>
      </section>

      <section id="contact" className="scroll-mt-24 px-5 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 rounded-[1.4rem] bg-[#e9ede5] px-5 py-6 sm:flex-row sm:items-center sm:gap-10 sm:px-8 sm:py-8">
          <div className="max-w-lg"><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#5c795d]">Talk with JARI</p><h2 className="mt-2 font-serif text-2xl leading-tight tracking-[-.025em] sm:text-3xl">A good farm decision can start with a conversation.</h2></div>
          <div className="flex flex-col gap-2 sm:min-w-[270px]">
            <a href="mailto:info@jari.com" className="group flex items-center gap-3 rounded-xl bg-white/70 px-3.5 py-3 transition-colors hover:bg-white"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#edf1e8] text-[#52744e]"><Mail size={15} /></span><span><span className="block text-[9px] font-bold uppercase tracking-[.12em] text-[#788174]">Email</span><span className="block text-xs font-semibold text-[#344536] group-hover:text-[#52744e]">info@jari.com</span></span></a>
            <a href="tel:+2348133153568" className="group flex items-center gap-3 rounded-xl bg-white/70 px-3.5 py-3 transition-colors hover:bg-white"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#edf1e8] text-[#52744e]"><Phone size={15} /></span><span><span className="block text-[9px] font-bold uppercase tracking-[.12em] text-[#788174]">Call</span><span className="block text-xs font-semibold text-[#344536] group-hover:text-[#52744e]">0813 315 3568</span></span></a>
          </div>
        </div>
      </section>

      <section className="px-5 pb-12 sm:px-8 sm:pb-16">
        <ScrollReveal><div className="closing-banner relative mx-auto max-w-7xl overflow-hidden rounded-[1.6rem] bg-[#244b35] px-6 py-9 text-center text-white sm:rounded-[2rem] sm:px-12 sm:py-14">
          <div aria-hidden="true" className="closing-shape closing-shape-left absolute -left-10 top-1/2 h-32 w-32 -translate-y-1/2 rotate-12 rounded-[1.3rem] bg-[#96b47f]/40 sm:-left-5 sm:h-44 sm:w-44" />
          <div aria-hidden="true" className="closing-shape closing-shape-right absolute -right-12 bottom-[-3.5rem] h-36 w-36 -rotate-12 rounded-[1.3rem] bg-[#d8e6ca]/75 sm:-right-2 sm:h-48 sm:w-48" />
          <div className="relative mx-auto max-w-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#d1dfc6]">Your farm, more clearly seen</p>
            <h2 className="mt-3 font-serif text-3xl leading-[1.04] tracking-[-.035em] sm:text-5xl">Better farm information can change what comes next.</h2>
            <p className="mx-auto mt-4 max-w-xl text-xs leading-5 text-white/75 sm:text-sm sm:leading-6">Start a JARI farm profile with the details you already have. Build a clearer picture over time.</p>
            <Link href="/register" className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#f5f6f0] px-6 py-3 text-xs font-bold text-[#294430] transition-transform duration-300 hover:-translate-y-0.5 hover:bg-white">Get started <ArrowRight size={15} /></Link>
          </div>
        </div></ScrollReveal>
      </section>

      <ScrollReveal><PublicFooter includeHeroPhotoCredit /></ScrollReveal>
    </main>
  );
}
