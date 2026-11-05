import { WorkspaceHub } from "@/components/dashboard/workspace-hub";
export default function InstitutionSectionPage({ params }: { params: { section: string[] } }) {
  const { section } = params;
  return <WorkspaceHub section={section[0] || "farms"} institution />;
}
