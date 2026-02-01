"use client";

import { useMemo, useState } from "react";
import { saveAs } from "file-saver";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyButton } from "@/components/app/copy-button";
import { Badge } from "@/components/ui/badge";

type Prompt = { type: string; content: string; createdAt?: string };

const META: Record<string, { title: string; purpose: string; how: string }> = {
  resume_rewrite: {
    title: "Resume Rewrite",
    purpose: "Rewrite resume to match this JD (ATS + role fit).",
    how: "Paste into ChatGPT/Claude/Groq. Provide your current resume text when asked.",
  },
  resume_bullets: {
    title: "Resume Bullets",
    purpose: "Generate impact-first bullets tailored to the JD.",
    how: "Paste into ChatGPT/Claude/Groq and review metrics carefully.",
  },
  cover_letter: {
    title: "Cover Letter",
    purpose: "Create a sharp, role-specific cover letter.",
    how: "Paste into ChatGPT/Claude/Groq; keep it under 220 words.",
  },
  interview_pack: {
    title: "Interview Prompt",
    purpose: "Generate a deep interview prep pack.",
    how: "Use only if you want the model to generate the pack again elsewhere.",
  },
};

function niceType(type: string) {
  return META[type]?.title ?? type.replaceAll("_", " ");
}

export function PromptCards(props: { jobRunId: string; prompts: Prompt[] }) {
  const [showRaw, setShowRaw] = useState<Record<string, boolean>>({});

  const prompts = useMemo(() => {
    // Normalize type keys (your DB might store exact names; keep as-is)
    return props.prompts.slice().sort((a, b) => a.type.localeCompare(b.type));
  }, [props.prompts]);

  function downloadAllMd() {
    const md =
      prompts
        .map((p) => `## ${niceType(p.type)}\n\n\`\`\`text\n${p.content}\n\`\`\`\n`)
        .join("\n") || "# No prompts\n";
    saveAs(new Blob([md], { type: "text/markdown;charset=utf-8" }), `jobrun-${props.jobRunId}-prompts.md`);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="text-sm font-medium">Prompts</div>
          <div className="text-xs text-muted-foreground">
            These are copy-paste prompts you run in an LLM to generate your final resume/letter.
          </div>
        </div>
        <Button size="sm" variant="outline" onClick={downloadAllMd}>
          Download all (.md)
        </Button>
      </div>

      {prompts.length === 0 ? (
        <Card>
          <CardContent className="py-6 text-sm text-muted-foreground">
            No prompts yet. Click “Generate Prompts”.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {prompts.map((p) => {
            const meta = META[p.type];
            const raw = !!showRaw[p.type];
            return (
              <Card key={p.type} className="h-full">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-base">{niceType(p.type)}</CardTitle>
                      {meta ? (
                        <div className="mt-1 space-y-1">
                          <div className="text-xs text-muted-foreground">
                            <span className="font-medium text-foreground/80">Purpose:</span> {meta.purpose}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            <span className="font-medium text-foreground/80">How to use:</span> {meta.how}
                          </div>
                        </div>
                      ) : null}
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <Badge variant="secondary">{p.type}</Badge>
                      <div className="flex gap-2">
                        <CopyButton text={p.content} />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setShowRaw((s) => ({ ...s, [p.type]: !s[p.type] }))}
                        >
                          {raw ? "Hide" : "View"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {raw ? (
                    <pre className="max-h-[320px] overflow-auto rounded-md border bg-muted/30 p-3 text-xs leading-relaxed">
                      {p.content}
                    </pre>
                  ) : (
                    <div className="rounded-md border bg-muted/20 p-3 text-sm text-muted-foreground">
                      Hidden by default (click “View”). Copy works without viewing.
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
