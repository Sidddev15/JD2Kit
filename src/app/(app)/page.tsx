import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AppHome() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Create a Job Run</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Paste a JD → generate job.json → prompts → interview pack.
          </p>
          <Link href="new">
            <Button className="w-full md:w-auto">New Job Run</Button>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            View saved job runs, prompts, and interview packs.
          </p>
          <Link href="history">
            <Button variant="outline" className="w-full md:w-auto">
              Open History
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
