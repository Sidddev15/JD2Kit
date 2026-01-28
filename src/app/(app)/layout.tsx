import type {ReactNode} from 'react';
import Link from 'next/link';
import {cn} from '@/lib/utils';
import {Button} from '@/components/ui/button';

export default function AppLayout({ children }: {children: ReactNode}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/app" className="font-semibold tracking-tight">
            JD2KIT
          </Link>

          <nav className="flex items-center gap-2">
            <Link href="/app/new">
              <Button size="sm">New Job Run</Button>
            </Link>
            <Link href="/app/history">
              <Button size="sm" variant="outline">
                History
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className={cn("mx-auto max-w-6xl px-4 py-6")}>{children}</main>
    </div>
  )
}