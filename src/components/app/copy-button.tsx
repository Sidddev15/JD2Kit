"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function CopyButton({text}: {text: string}) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 800);
  }

  return(
    <Button size="sm" variant="outline" onClick={onCopy}>
      {copied ? "Copied" : "Copy"}
    </Button>
  );
}