/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { CopyButton } from "@/components/app/copy-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function InterviewPackViewer(props: {
  latestVersion: number | null;
  pack: any | null;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Interview Pack{" "}
          <span className="text-muted-foreground">
            {props.latestVersion ? `(v${props.latestVersion})` : ""}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {!props.pack ? (
          <p className="text-sm text-muted-foreground">No interview pack yet.</p>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                JSON (schema-validated)
              </span>
              <CopyButton text={JSON.stringify(props.pack, null, 2)} />
            </div>

            <pre className="max-h-[420px] overflow-auto rounded-md border bg-muted/40 p-3 text-xs leading-relaxed">
              {JSON.stringify(props.pack, null, 2)}
            </pre>
          </>
        )}
      </CardContent>
    </Card>
  );
}
