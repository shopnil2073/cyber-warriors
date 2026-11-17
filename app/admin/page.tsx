import AccessDenied from "../components/admin/AccessDenied";
import { requireAdminSession } from "../lib/server/session";
import AdminConsole from "./AdminConsole";

export const dynamic = "force-dynamic";

// Server e cookie session + adminEmails.ts diye check. localStorage ar trust kora hoy na.
export default async function AdminPage() {
  try {
    const session = await requireAdminSession();
    if (!session) return <AccessDenied />;
    return <AdminConsole email={session.email} />;
  } catch (err) {
    return <AccessDenied reason={err instanceof Error ? err.message : "Server config error"} />;
  }
}
