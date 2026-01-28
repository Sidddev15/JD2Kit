/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { json as jsonLang } from "@codemirror/lang-json";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/app/copy-button";
import { JobJsonSchema } from "@/lib/job-json.schema";

export function JobJsonEditor(props: {
  initial: unknown;
  onSave: (nextJson: any) => Promise<void>;
}) {
  const [text, setText] = useState(() => JSON.stringify(props.initial, null, 2));
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const parsed = useMemo(() => {
    try {
      const obj = JSON.parse(text);
      JobJsonSchema.parse(obj);
      return { ok: true as const, obj };
    } catch (e: any) {
      return { ok: false as const, err: e };
    }
  }, [text]);

  useEffect(() => {
    if (parsed.ok) setError(null);
    else setError(parsed.err?.message ?? "Invalid JSON");
  }, [parsed]);

  async function save() {
    if (!parsed.ok) return;
    setSaving(true);
    try {
      await props.onSave(parsed.obj);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" onClick={save} disabled={!parsed.ok || saving}>
          {saving ? "Saving…" : "Save job.json"}
        </Button>
        <CopyButton text={text} />
        {error ? (
          <span className="text-xs text-destructive">{error}</span>
        ) : (
          <span className="text-xs text-muted-foreground">Valid ✅</span>
        )}
      </div>

      <div className="rounded-md border">
        <CodeMirror
          value={text}
          height="360px"
          extensions={[jsonLang()]}
          onChange={(v) => setText(v)}
        />
      </div>
    </div>
  );
}
