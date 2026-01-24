import { Shell } from "@/components/app/shell";

export default function NewJobRunPage() {
  return (
    <Shell>
      <h1 className="text-2xl font-semibold">Create Job Run</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Paste JD → Generate job.json → Generate prompts (Phase 4).
      </p>
    </Shell>
  );
}
