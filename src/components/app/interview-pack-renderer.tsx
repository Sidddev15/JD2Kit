/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/app/copy-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type AnyPack = any;

function asArray<T>(v: any): T[] {
  return Array.isArray(v) ? v : [];
}

export function InterviewPackRenderer(props: {
  version: number | null;
  pack: AnyPack | null;
}) {
  const [raw, setRaw] = useState(false);
  const [q, setQ] = useState("");

  const pack = props.pack as AnyPack | null;

  const topics = useMemo(
    () => (pack ? asArray<{ title?: string; summary?: string }>(pack.topics) : []),
    [pack],
  );
  const questions = useMemo(
    () =>
      pack
        ? asArray<{ category?: string; question?: string; expectedAnswer?: string; followUps?: string[] }>(
            pack.questions,
          )
        : [],
    [pack],
  );
  const coding = useMemo(
    () => (pack ? asArray<{ difficulty?: string; prompt?: string; hints?: string[] }>(pack.codingTasks) : []),
    [pack],
  );
  const design = useMemo(
    () => (pack ? asArray<{ focus?: string; prompt?: string }>(pack.systemDesign) : []),
    [pack],
  );

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return questions;
    return questions.filter((x) => {
      const s = `${x.category ?? ""} ${x.question ?? ""} ${x.expectedAnswer ?? ""}`.toLowerCase();
      return s.includes(needle);
    });
  }, [q, questions]);

  const byCategory = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    for (const item of filtered) {
      const key = item.category ?? "General";
      const arr = map.get(key) ?? [];
      arr.push(item);
      map.set(key, arr);
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filtered]);

  if (!pack) {
    return (
      <Card>
        <CardContent className="py-6 text-sm text-muted-foreground">
          No interview pack yet. Click &ldquo;Generate Interview Pack&ldquo;.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-base">
            Interview Pack {props.version ? <span className="text-muted-foreground">(v{props.version})</span> : null}
          </CardTitle>

          <div className="flex flex-wrap items-center gap-2">
            <CopyButton text={JSON.stringify(pack, null, 2)} />
            <Button size="sm" variant="outline" onClick={() => setRaw((v) => !v)}>
              {raw ? "Hide raw JSON" : "View raw JSON"}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {raw ? (
          <pre className="max-h-[460px] overflow-auto rounded-md border bg-muted/30 p-3 text-xs leading-relaxed">
            {JSON.stringify(pack, null, 2)}
          </pre>
        ) : (
          <Tabs defaultValue="topics" className="w-full">
            <TabsList className="flex flex-wrap">
              <TabsTrigger value="topics">Topics</TabsTrigger>
              <TabsTrigger value="questions">Questions</TabsTrigger>
              <TabsTrigger value="coding">Coding Tasks</TabsTrigger>
              <TabsTrigger value="design">System Design</TabsTrigger>
            </TabsList>

            <TabsContent value="topics" className="space-y-2">
              {topics.length === 0 ? (
                <div className="text-sm text-muted-foreground">No topics found.</div>
              ) : (
                <Accordion type="multiple" className="w-full">
                  {topics.map((t, idx) => (
                    <AccordionItem key={idx} value={`t-${idx}`}>
                      <AccordionTrigger>
                        <div className="text-left">
                          <div className="font-medium">{t.title ?? `Topic ${idx + 1}`}</div>
                          {t.summary ? <div className="text-xs text-muted-foreground">{t.summary}</div> : null}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="text-sm text-muted-foreground">
                          Use this as your study checklist. Convert each topic into notes + examples.
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </TabsContent>

            <TabsContent value="questions" className="space-y-3">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div className="text-sm text-muted-foreground">
                  {filtered.length} questions {q.trim() ? <span className="text-xs">(filtered)</span> : null}
                </div>
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search questions (React, performance, hooks, etc.)"
                  className="md:max-w-sm"
                />
              </div>

              {byCategory.length === 0 ? (
                <div className="text-sm text-muted-foreground">No matching questions.</div>
              ) : (
                <Accordion type="multiple" className="w-full">
                  {byCategory.map(([cat, items]) => (
                    <AccordionItem key={cat} value={`c-${cat}`}>
                      <AccordionTrigger>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{cat}</span>
                          <Badge variant="secondary">{items.length}</Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3">
                          {items.map((it, idx) => (
                            <div key={idx} className="rounded-md border bg-muted/20 p-3">
                              <div className="text-sm font-medium">{it.question ?? "Question"}</div>
                              {it.expectedAnswer ? (
                                <div className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
                                  <span className="font-medium text-foreground/80">Expected answer shape:</span>{" "}
                                  {it.expectedAnswer}
                                </div>
                              ) : null}
                              {Array.isArray(it.followUps) && it.followUps.length ? (
                                <div className="mt-2">
                                  <div className="text-xs font-medium text-muted-foreground">Follow-ups</div>
                                  <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">
                                    {it.followUps.slice(0, 6).map((f, i) => (
                                      <li key={i} className="text-muted-foreground">
                                        {f}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </TabsContent>

            <TabsContent value="coding" className="space-y-2">
              {coding.length === 0 ? (
                <div className="text-sm text-muted-foreground">No coding tasks found.</div>
              ) : (
                <div className="space-y-3">
                  {coding.map((t, idx) => (
                    <div key={idx} className="rounded-md border bg-muted/20 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-sm font-medium">Task {idx + 1}</div>
                        {t.difficulty ? <Badge variant="outline">{t.difficulty}</Badge> : null}
                      </div>
                      <div className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{t.prompt ?? ""}</div>
                      {Array.isArray(t.hints) && t.hints.length ? (
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                          {t.hints.slice(0, 6).map((h, i) => (
                            <li key={i} className="text-muted-foreground">
                              {h}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="design" className="space-y-2">
              {design.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  No system design prompts (or not required for this seniority).
                </div>
              ) : (
                <div className="space-y-3">
                  {design.map((d, idx) => (
                    <div key={idx} className="rounded-md border bg-muted/20 p-3">
                      <div className="text-sm font-medium">Prompt {idx + 1}</div>
                      {d.focus ? <div className="mt-1 text-xs text-muted-foreground">Focus: {d.focus}</div> : null}
                      <div className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{d.prompt ?? ""}</div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
