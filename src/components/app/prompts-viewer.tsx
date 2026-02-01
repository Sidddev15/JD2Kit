"use client";

import { saveAs } from "file-saver";
import { CopyButton } from "@/components/app/copy-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PromptsViewer(props: {
  prompts: Array<{ type: string; content: string; createdAt?: string }>;
  jobRunId: string;
}) {
  function downloadMarkdown() {
    const md =
      props.prompts
        .map(
          (p) =>
            `## ${p.type}\n\n` +
            "```text\n" +
            p.content +
            "\n```\n",
        )
        .join("\n") || "# No prompts\n";

    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    saveAs(blob, `jobrun-${props.jobRunId}-prompts.md`);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle className="text-base">Prompts</CardTitle>
        <Button size="sm" variant="outline" onClick={downloadMarkdown}>
          Download .md
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {props.prompts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No prompts generated.</p>
        ) : (
          props.prompts.map((p) => (
            <div key={p.type} className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-medium">{p.type}</div>
                <CopyButton text={p.content} />
              </div>
              <pre className="max-h-[260px] overflow-auto rounded-md border bg-muted/40 p-3 text-xs leading-relaxed">
                {p.content}
              </pre>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
