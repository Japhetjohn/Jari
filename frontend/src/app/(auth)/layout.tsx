"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { getSavedSession } from "@/lib/auth";
import { AuthShell } from "./auth-shell";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const session = getSavedSession();
    if (!session) return;

    const redirectMap = {
      farmer: "/dashboard",
      admin: "/admin",
      verification_agent: "/admin",
      institutional_user: "/institution",
    } as const;

    router.replace(redirectMap[session.role]);
  }, [pathname, router]);

  return <AuthShell>{children}</AuthShell>;
}
