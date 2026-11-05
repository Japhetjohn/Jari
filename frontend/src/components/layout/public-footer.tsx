import Link from "next/link";
import { JariLogo } from "@/components/brand/jari-logo";

type PublicFooterProps = {
  includeHeroPhotoCredit?: boolean;
};

export function PublicFooter({ includeHeroPhotoCredit = false }: PublicFooterProps) {
  return (
    <footer className="bg-[#e9ede5] px-5 pb-6 pt-10 sm:px-8 sm:pb-7 sm:pt-14">
      <div className="mx-auto grid max-w-7xl gap-9 sm:grid-cols-2 lg:grid-cols-[1.25fr_.7fr_.85fr_1.1fr] lg:gap-12">
        <div>
          <Link href="/" aria-label="JARI home"><JariLogo size={24} /></Link>
          <p className="mt-4 max-w-xs text-sm leading-6 text-[#657064]">Agricultural risk intelligence and financial access for poultry farms.</p>
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[.12em] text-[#3b4a3d]">Explore</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-[#657064]">
            <li><Link className="transition-colors hover:text-[#244b35]" href="/#how-it-works">How it works</Link></li>
            <li><Link className="transition-colors hover:text-[#244b35]" href="/#services">Our services</Link></li>
            <li><Link className="transition-colors hover:text-[#244b35]" href="/about">About JARI</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[.12em] text-[#3b4a3d]">For farmers</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-[#657064]">
            <li><Link className="transition-colors hover:text-[#244b35]" href="/register">Create a farm profile</Link></li>
            <li><Link className="transition-colors hover:text-[#244b35]" href="/login">Sign in</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[.12em] text-[#3b4a3d]">Contact</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-[#657064]">
            <li><a className="transition-colors hover:text-[#244b35]" href="mailto:info@jari.com">info@jari.com</a></li>
            <li><a className="transition-colors hover:text-[#244b35]" href="tel:+2348133153568">0813 315 3568</a></li>
            <li className="pt-1 leading-5">Jos South, Plateau State, Nigeria</li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-10 flex max-w-7xl justify-center pt-5 text-center text-[11px] leading-5 text-[#7a8378]">
        <div>
          <p>© {new Date().getFullYear()} JARI. All rights reserved.</p>
          {includeHeroPhotoCredit && <p className="mx-auto mt-2 max-w-3xl text-[9px] leading-4 text-[#879084]">
            Poultry photographs: <a className="underline decoration-[#b3bcae] underline-offset-2 hover:text-[#244b35]" href="https://commons.wikimedia.org/wiki/File:An_indoor_space_for_raising_chickens.jpg" target="_blank" rel="noreferrer">Abdulybature</a> (Kano) and <a className="underline decoration-[#b3bcae] underline-offset-2 hover:text-[#244b35]" href="https://commons.wikimedia.org/wiki/File:Poultry_Farm_in_remote_uyo.jpg" target="_blank" rel="noreferrer">Utibe Noah Silas</a> (Uyo), via Wikimedia Commons, <a className="underline decoration-[#b3bcae] underline-offset-2 hover:text-[#244b35]" href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a>.
          </p>}
        </div>
      </div>
    </footer>
  );
}
