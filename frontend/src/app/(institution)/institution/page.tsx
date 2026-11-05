import { WorkspaceHub } from "@/components/dashboard/workspace-hub";
import { InstitutionApplicationStatus } from "@/components/dashboard/institution-application-status";
export default function InstitutionHomePage() { return <><InstitutionApplicationStatus /><WorkspaceHub section="overview" institution /></>; }
