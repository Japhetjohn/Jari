import Image from "next/image";

type JariLogoProps = {
  size?: number;
  subtitle?: string;
  theme?: "light" | "dark";
};

export function JariLogo({ size = 40, subtitle, theme = "light" }: JariLogoProps) {
  const dark = theme === "dark";

  return (
    <span className="inline-flex items-center gap-3">
      <span className={`flex shrink-0 items-center justify-center rounded-full p-1.5 ${dark ? "bg-white/10" : "bg-[#eef2e9]"}`}>
        <Image
          src="/logo/jari-mark.svg"
          alt=""
          width={size}
          height={size}
          className={dark ? "brightness-0 invert" : ""}
        />
      </span>
      <span>
        <span className={`block font-serif text-xl leading-5 tracking-tight ${dark ? "text-white" : "text-[#20261f]"}`}>JARI</span>
        {subtitle && <span className={`mt-1 hidden text-[10px] font-medium uppercase tracking-[.13em] sm:block ${dark ? "text-[#c7d7c4]" : "text-[#778075]"}`}>{subtitle}</span>}
      </span>
    </span>
  );
}
