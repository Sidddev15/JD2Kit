import Link from "next/link";

export function TopNav() {
  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/(app)" className="text-lg font-semibold">
          JobForge
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/(app)">Dashboard</Link>
          <Link href="/(app)/job-runs/new">New Job Run</Link>
        </nav>
      </div>
    </header>
  );
}
