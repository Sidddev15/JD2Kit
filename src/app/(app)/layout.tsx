import { TopNav } from "@/components/app/top-nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh">
      <TopNav />
      {children}
    </div>
  );
}
