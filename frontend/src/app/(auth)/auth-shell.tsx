"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Check, Mail, MapPin, ShieldCheck, Sprout } from "lucide-react";
import { JariLogo } from "@/components/brand/jari-logo";

export function AuthShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showAccountTabs = pathname === "/login" || pathname === "/register";

  return (
    <main className="auth-page flex min-h-screen flex-col items-center bg-[#f5f6f0] px-3 py-3 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <div className="my-auto grid w-full min-h-[calc(100svh-1.5rem)] max-w-6xl overflow-hidden rounded-[1.75rem] bg-white shadow-[0_28px_80px_-48px_rgba(27,53,34,.32)] sm:min-h-[calc(100svh-3rem)] lg:min-h-[min(760px,calc(100svh-4rem))] lg:grid-cols-[1fr_.92fr]">
        <section className="auth-story relative hidden min-h-[680px] flex-col justify-between overflow-hidden p-9 text-white lg:flex xl:p-12">
          <Image src="/images/nigerian-poultry-house.jpg" alt="Poultry flock inside a farm in Nigeria" fill sizes="(max-width: 1280px) 48vw, 560px" className="absolute inset-0 object-cover object-[center_62%]" />
          <div className="auth-story-shade absolute inset-0" />
          <Link href="/" aria-label="JARI home" className="relative z-10 w-fit"><JariLogo size={30} theme="dark" subtitle="Poultry farm intelligence" /></Link>

          <div className="relative z-10 max-w-lg">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-[10px] font-bold uppercase tracking-[.15em] text-[#e4ecd9]"><MapPin size={13} /> Jos South · Plateau State</p>
            <h2 className="mt-5 max-w-md font-serif text-4xl font-medium leading-[1.04] tracking-[-.03em] xl:text-5xl">A clearer picture of your farm starts here.</h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-white/80">Keep flock, health, production and financial information together as your poultry operation grows.</p>
            <div className="mt-7 grid gap-2.5 sm:grid-cols-2">
              {[{ icon: Sprout, label: "Farm records" }, { icon: ShieldCheck, label: "Risk understanding" }].map(({ icon: Icon, label }) => <div key={label} className="flex items-center gap-2.5 rounded-xl bg-white/10 px-3.5 py-3 text-xs font-semibold text-white/90"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-[#d6e5c8]"><Icon size={14} /></span>{label}<Check size={13} className="ml-auto text-[#cce0bd]" /></div>)}
            </div>
          </div>

          <p className="relative z-10 text-[10px] font-medium uppercase tracking-[.13em] text-white/65">Better farm information. Better-informed next steps.</p>
        </section>

        <section className="flex min-w-0 flex-col justify-center px-5 py-7 sm:px-9 sm:py-10 lg:px-10 xl:px-14">
          <div className="auth-mobile-visual relative mb-6 flex min-h-[148px] flex-col justify-between overflow-hidden rounded-[1.2rem] p-4 lg:hidden">
            <Image src="/images/nigerian-poultry-house.jpg" alt="" fill sizes="100vw" className="absolute inset-0 object-cover object-[center_60%]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#173a28]/90 via-[#173a28]/65 to-[#173a28]/20" />
            <div className="relative z-10 flex items-center justify-between gap-3"><Link href="/" aria-label="JARI home"><JariLogo size={23} theme="dark" subtitle="Farm intelligence" /></Link><Link href="/" className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white/15 px-3 py-2 text-[10px] font-semibold text-white transition hover:bg-white/25"><ArrowLeft size={12} /> Website</Link></div>
            <p className="relative z-10 mt-4 max-w-[230px] font-serif text-lg leading-tight text-white">A clearer picture of your farm starts here.</p>
          </div>

          {showAccountTabs && <nav aria-label="Account access" className="mb-6 grid grid-cols-2 gap-1 rounded-full bg-[#f0f2ec] p-1">
            <Link href="/login" aria-current={pathname === "/login" ? "page" : undefined} className={`rounded-full px-3 py-2.5 text-center text-xs font-semibold transition-colors ${pathname === "/login" ? "bg-white text-[#294430] shadow-[0_3px_12px_-8px_rgba(29,58,36,.5)]" : "text-[#697268] hover:text-[#294430]"}`}>Sign in</Link>
            <Link href="/register" aria-current={pathname === "/register" ? "page" : undefined} className={`rounded-full px-3 py-2.5 text-center text-xs font-semibold transition-colors ${pathname === "/register" ? "bg-white text-[#294430] shadow-[0_3px_12px_-8px_rgba(29,58,36,.5)]" : "text-[#697268] hover:text-[#294430]"}`}>Create account</Link>
          </nav>}

          <div className="mx-auto w-full max-w-md">{children}</div>
          <div className="mx-auto mt-7 w-full max-w-md text-center text-[10px] leading-5 text-[#7b8378]">
            <p>JARI farm records are used to build a clearer picture of your operation.</p>
            <div className="mt-2 flex items-center justify-center gap-3"><Link href="/" className="font-semibold text-[#496b50] hover:text-[#244a35]">Learn about JARI</Link><span aria-hidden="true" className="h-1 w-1 rounded-full bg-[#a7b19f]" /><a href="mailto:info@jari.com" className="inline-flex items-center gap-1 font-semibold text-[#496b50] hover:text-[#244a35]"><Mail size={11} /> Get help</a></div>
          </div>
        </section>
      </div>
    </main>
  );
}
