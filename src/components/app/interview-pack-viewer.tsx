/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { InterviewPackRenderer } from "@/components/app/interview-pack-renderer";

export function InterviewPackViewer(props: {
  latestVersion: number | null;
  pack: any | null;
}) {
  return <InterviewPackRenderer version={props.latestVersion} pack={props.pack} />;
}
