"use client";

import { saveAs } from "file-saver";
import { Button } from "@/components/ui/button";

export function DownloadJsonButton(props: { filename: string; data: unknown }) {
  return (
    <Button
      size="sm"
      variant="outline"
      onClick={() => {
        const blob = new Blob([JSON.stringify(props.data, null, 2)], {
          type: "application/json;charset=utf-8",
        });
        saveAs(blob, props.filename);
      }}
    >
      Download JSON
    </Button>
  );
}

export function DownloadTextButton(props: {
  filename: string; 
  content: string;
  label?: string;
}) {
  return (
    <Button size="sm" variant="outline" onClick={() => {
      const blob = new Blob([props.content], {
        type: "text/plain;charset=utf-8"
      });
      saveAs(blob, props.filename)
    }}>{props.label ?? "Download"}</Button>
  )
};
