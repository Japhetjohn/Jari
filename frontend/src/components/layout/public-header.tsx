import Link from "next/link";
import { JariLogo } from "@/components/brand/jari-logo";

type PublicHeaderProps = {
  currentPage?: "home" | "about";
};

export function PublicHeader({ currentPage = "home" }: PublicHeaderProps) {
  const homeAnchor = (anchor: string) => currentPage === "home" ? `#${anchor}` : `/#${anchor}`;

  return (
    <header className="sticky top-0 z-30 bg-[#fbfbf8]/95 backdrop-blur-sm">
      <nav aria-label="Main navigation" className="mx-auto flex min-h-[68px] max-w-7xl items-center justify-between gap-2 px-4 sm:min-h-[76px] sm:gap-3 sm:px-8">
        <Link href="/" aria-label="JARI home" className="shrink-0"><JariLogo size={25} subtitle="Poultry farm intelligence" /></Link>
        <div className="flex items-center gap-0.5 sm:gap-1 md:gap-3">
          <Link href={homeAnchor("how-it-works")} className="hidden rounded-full px-3 py-2 text-sm font-semibold text-[#465649] transition-colors hover:text-[#1d402b] md:inline-flex">How it works</Link>
          <Link href={homeAnchor("services")} className="hidden rounded-full px-3 py-2 text-sm font-semibold text-[#465649] transition-colors hover:text-[#1d402b] md:inline-flex">Services</Link>
          <Link href="/about" aria-current={currentPage === "about" ? "page" : undefined} className="rounded-full px-2 py-2 text-xs font-semibold text-[#465649] transition-colors hover:text-[#1d402b] sm:px-3 sm:text-sm">About</Link>
          <Link href={homeAnchor("contact")} className="hidden rounded-full px-2 py-2 text-xs font-semibold text-[#465649] transition-colors hover:text-[#1d402b] sm:inline-flex sm:px-3 sm:text-sm">Contact</Link>
          <Link href="/login" className="rounded-full px-2.5 py-2 text-xs font-semibold text-[#344338] transition-colors hover:bg-[#eff2eb] sm:px-4 sm:text-sm">Sign in</Link>
          <Link href="/register" className="inline-flex min-h-10 items-center justify-center rounded-full bg-[#24513a] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#193d2b] sm:min-h-11 sm:px-5 sm:text-sm">Get started</Link>
        </div>
      </nav>
    </header>
  );
}
