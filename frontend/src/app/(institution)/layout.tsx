import { RoleShell } from "@/components/layout/role-shell";

const allowedRoles: Array<"institutional_user"> = ["institutional_user"];

const navigation = [
  { label: "Overview", collapsible: false, items: [{ href: "/institution", label: "Overview" }] },
  { label: "Portfolio", items: [{ href: "/institution/risk-profiles", label: "Farmer profiles" }, { href: "/institution/applications", label: "Applications" }] },
  { label: "Collaboration", items: [{ href: "/institution/requests", label: "Contact farmers" }] },
  { label: "Account", items: [{ href: "/institution/settings", label: "Settings" }] },
];

export default function InstitutionLayout({ children }: { children: React.ReactNode }) {
  return <RoleShell workspace="Institution workspace" eyebrow="Authorized access" navigation={navigation} allowedRoles={allowedRoles}>{children}</RoleShell>;
}
