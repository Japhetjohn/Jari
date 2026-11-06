import { RoleShell } from "@/components/layout/role-shell";

const allowedRoles: Array<"admin" | "verification_agent"> = ["admin", "verification_agent"];

const navigation = [
  { label: "Overview", collapsible: false, items: [{ href: "/admin", label: "Overview" }] },
  { label: "Farm operations", items: [{ href: "/admin/farmers", label: "Farmers" }, { href: "/admin/farms", label: "Farms" }, { href: "/admin/verification", label: "Verification" }, { href: "/admin/assessments", label: "Farm risk profiles" }] },
  { label: "Programs & partners", items: [{ href: "/admin/opportunities", label: "Opportunities" }, { href: "/admin/institutions", label: "Institutions" }] },
  { label: "Administration", items: [{ href: "/admin/reports", label: "Reports" }, { href: "/admin/settings", label: "Settings" }] },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <RoleShell workspace="Admin workspace" eyebrow="Platform operations" navigation={navigation} allowedRoles={allowedRoles}>{children}</RoleShell>;
}
