import { RoleShell } from "@/components/layout/role-shell";

const allowedRoles: Array<"farmer"> = ["farmer"];

const navigation = [
  { label: "Overview", collapsible: false, items: [{ href: "/dashboard", label: "Overview" }] },
  { label: "Your farm", items: [{ href: "/farm", label: "My farm" }, { href: "/kyc", label: "Farm verification" }, { href: "/poultry-houses", label: "Farm houses" }] },
  { label: "Birds and care", items: [{ href: "/birds", label: "My birds" }, { href: "/feed", label: "Feed" }, { href: "/production", label: "Eggs and production" }, { href: "/health", label: "Bird health" }] },
  { label: "Money and sales", items: [{ href: "/sales", label: "Sales money" }, { href: "/expenses", label: "Farm spending" }, { href: "/assets", label: "Farm equipment" }] },
  { label: "Farm progress", items: [{ href: "/assessments", label: "Farm risk profile" }, { href: "/analytics", label: "Farm records" }, { href: "/reports", label: "Reports" }, { href: "/opportunities", label: "Ways to get support" }, { href: "/notifications", label: "Messages" }] },
  { label: "Account", items: [{ href: "/settings", label: "Settings" }] },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <RoleShell workspace="Farmer workspace" eyebrow="Your farm" navigation={navigation} allowedRoles={allowedRoles}>{children}</RoleShell>;
}
