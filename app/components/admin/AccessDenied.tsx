import type { Route } from "next";
import Link from "next/link";

export default function AccessDenied({ reason }: { reason?: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4 text-white">
      <div className="w-full max-w-md space-y-4 rounded-2xl border border-red-500/30 bg-zinc-900 p-8 text-center shadow-2xl">
        <h1 className="text-2xl font-bold text-red-400">Access Denied</h1>
        <p className="text-xs text-zinc-400">
          {reason ?? "Admin session paowa jayni. Admin email diye website e Sign In koro, tarpor abar ei page e asho."}
        </p>
        <div className="grid grid-cols-2 gap-2">
          <Link href={"/sign-in" as Route} className="rounded-xl bg-[#D4AF37] py-3 text-xs font-black uppercase text-black">Sign in</Link>
          <Link href={"/" as Route} className="rounded-xl bg-zinc-800 py-3 text-xs font-bold uppercase hover:bg-zinc-700">Home</Link>
        </div>
      </div>
    </div>
  );
}
