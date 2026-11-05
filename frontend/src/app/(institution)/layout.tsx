import { RoleShell } from "@/components/layout/role-shell";

const allowedRoles: Array<"institutional_user"> = ["institutional_user"];

const navigation = [
  { label: "Overview", collapsible: false, items: [{ href: "/institution", label: "Overview" }] },
  { label: "Farm portfolio", items: [{ href: "/institution/farms", label: "Authorized farms" }, { href: "/institution/assessments", label: "Assessments" }] },
  { label: "Reports & documents", items: [{ href: "/institution/reports", label: "Reports" }, { href: "/institution/documents", label: "Documents" }] },
  { label: "Collaboration", items: [{ href: "/institution/referrals", label: "Referrals" }, { href: "/institution/requests", label: "Requests" }] },
  { label: "Account", items: [{ href: "/institution/settings", label: "Settings" }] },
];

export default function InstitutionLayout({ children }: { children: React.ReactNode }) {
  return <RoleShell workspace="Institution workspace" eyebrow="Authorized access" navigation={navigation} allowedRoles={allowedRoles}>{children}</RoleShell>;
}
