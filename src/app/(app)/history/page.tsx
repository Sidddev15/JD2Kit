import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const jobRuns = await prisma.jobRun.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      roleTitle: true,
      companyName: true,
      profileType: true,
      status: true,
      createdAt: true,
      tags: true,
    },
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">History</h1>
        <p className="text-sm text-muted-foreground">
          Latest 50 job runs (DB-backed).
        </p>
      </div>

      <div className="grid gap-3">
        {jobRuns.map((jr) => (
          <Link key={jr.id} href={`/app/job/${jr.id}`}>
            <Card className="hover:bg-muted/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">
                  {jr.roleTitle}
                  {jr.companyName ? ` · ${jr.companyName}` : ""}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap items-center gap-2 text-sm">
                <Badge variant="secondary">{jr.profileType}</Badge>
                <Badge variant="outline">{jr.status}</Badge>
                <span className="text-muted-foreground">
                  {new Date(jr.createdAt).toLocaleString()}
                </span>
                {jr.tags?.slice(0, 5)?.map((t) => (
                  <Badge key={t} variant="secondary" className="opacity-80">
                    {t}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
