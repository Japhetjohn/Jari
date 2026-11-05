"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { registerWithSimulation } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ fullName: "", phone: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    if (error) setError("");
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!agreed) {
      setError("Please accept the privacy and data-use terms before creating your account.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      registerWithSimulation(form.fullName, form.phone, form.password);
      router.push("/dashboard");
    } catch (registerError) {
      setError(registerError instanceof Error ? registerError.message : "Unable to create account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="mb-6">
        <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#547253]">Get started</p>
        <h1 className="mt-3 font-serif text-3xl font-medium tracking-[-.03em] text-[#20291f] sm:text-4xl">Create your JARI account</h1>
        <p className="mt-2 text-sm leading-6 text-[#697268]">Start with your details. Add farm information as you go.</p>
      </div>

      <form className="space-y-3.5" onSubmit={onSubmit}>
        <div><label htmlFor="fullName" className="label-text">Full name</label><input id="fullName" autoComplete="name" className="input-shell" placeholder="Your full name" value={form.fullName} onChange={(event) => handleChange("fullName", event.target.value)} /></div>
        <div><label htmlFor="register-phone" className="label-text">Phone number</label><input id="register-phone" type="tel" autoComplete="tel" className="input-shell" placeholder="0803 000 0000" value={form.phone} onChange={(event) => handleChange("phone", event.target.value)} /></div>
        <div>
          <label htmlFor="register-password" className="label-text">Password</label>
          <div className="relative"><input id="register-password" type={showPassword ? "text" : "password"} autoComplete="new-password" className="input-shell pr-11" placeholder="Create a password" value={form.password} onChange={(event) => handleChange("password", event.target.value)} /><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((current) => !current)} className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-[#758071] transition-colors hover:text-[#244b35]">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>
        </div>
        <div>
          <label htmlFor="confirmPassword" className="label-text">Confirm password</label>
          <div className="relative"><input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} autoComplete="new-password" className="input-shell pr-11" placeholder="Enter your password again" value={form.confirmPassword} onChange={(event) => handleChange("confirmPassword", event.target.value)} /><button type="button" aria-label={showConfirmPassword ? "Hide password" : "Show password"} onClick={() => setShowConfirmPassword((current) => !current)} className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-[#758071] transition-colors hover:text-[#244b35]">{showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>
        </div>

        <label className="flex items-start gap-2.5 pt-1 text-xs leading-5 text-[#5d685d]"><input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-emerald-700 focus:ring-emerald-500" /><span>I agree to the privacy policy and data-use terms for JARI.</span></label>

        {error && <div role="alert" className="rounded-xl bg-[#fbefeb] px-3.5 py-3 text-sm text-[#9a493c]">{error}</div>}

        <button type="submit" disabled={isSubmitting} className="mt-1 min-h-12 w-full rounded-xl bg-[#244b35] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#193d2b] disabled:cursor-not-allowed disabled:bg-[#81947f]">{isSubmitting ? "Creating account..." : "Create account"}</button>
      </form>

      <p className="mt-5 text-center text-sm text-[#657064]">Already have an account? <Link href="/login" className="font-semibold text-[#496b50] hover:text-[#244a35]">Sign in</Link></p>
    </>
  );
}
