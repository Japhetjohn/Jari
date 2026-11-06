"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { loginWithBackend } from "@/lib/auth";
import { notifyToast } from "@/lib/toast";

const demoAccounts = [
  { label: "Farmer", phone: "08030000000", password: "password123" },
  { label: "Admin", phone: "08040000000", password: "admin123" },
  { label: "Institution", phone: "08060000000", password: "institution123" },
];

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ phone: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    if (error) setError("");
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const session = await loginWithBackend(form.phone, form.password);
      const target =
        session.role === "admin" || session.role === "verification_agent"
          ? "/admin"
          : session.role === "institutional_user"
            ? "/institution"
            : "/dashboard";
      router.push(target);
    } catch (loginError) {
      const message = loginError instanceof Error ? loginError.message : "Login failed.";
      setError(message); notifyToast("error", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="mb-7">
        <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#547253]">Welcome back</p>
        <h1 className="mt-3 font-serif text-3xl font-medium tracking-[-.03em] text-[#20291f] sm:text-4xl">Sign in to JARI</h1>
        <p className="mt-2 text-sm leading-6 text-[#697268]">Continue with your phone number and password.</p>
      </div>

      <div className="mb-5 rounded-xl bg-[#eef3eb] p-3.5 text-xs leading-5 text-[#456346]">
        <p className="font-semibold">Choose a demo workspace</p>
        <p className="mt-1">Pre-filled demo credentials for quick access.</p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {demoAccounts.map((account) => (
            <button
              key={account.label}
              type="button"
              onClick={() => {
                setForm({ phone: account.phone, password: account.password });
                setError("");
              }}
              className="min-h-10 rounded-lg bg-white px-2 text-left text-[11px] font-semibold text-[#36523b] transition-colors hover:bg-[#f8faf6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#76916a]"
            >
              {account.label}
            </button>
          ))}
        </div>
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label htmlFor="phone" className="label-text">Phone number</label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            className="input-shell"
            placeholder="0803 000 0000"
            value={form.phone}
            onChange={(event) => handleChange("phone", event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="password" className="label-text">Password</label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              className="input-shell pr-11"
              placeholder="Enter your password"
              value={form.password}
              onChange={(event) => handleChange("password", event.target.value)}
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((current) => !current)}
              className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-[#758071] transition-colors hover:text-[#244b35]"
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pt-1 text-xs">
          <Link href="/forgot-password" className="font-semibold text-[#496b50] transition-colors hover:text-[#244a35]">Forgot password?</Link>
        </div>

        {error && <div role="alert" className="rounded-xl bg-[#fbefeb] px-3.5 py-3 text-sm text-[#9a493c]">{error}</div>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 min-h-12 w-full rounded-xl bg-[#244b35] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#193d2b] disabled:cursor-not-allowed disabled:bg-[#81947f]"
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#657064]">New to JARI? <Link href="/register" className="font-semibold text-[#496b50] hover:text-[#244a35]">Create an account</Link></p>
    </>
  );
}
