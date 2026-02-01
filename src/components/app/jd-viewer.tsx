import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function JDViewer({ jdText }: { jdText: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Job Description</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-h-[360px] overflow-auto rounded-md border bg-muted/30 p-3">
          <pre className="whitespace-pre-wrap text-sm leading-relaxed">{jdText}</pre>
        </div>
      </CardContent>
    </Card>
  );
}
