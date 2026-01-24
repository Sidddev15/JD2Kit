import {ok} from "@/lib/http";

export async function GET(req: Request) {
  const requestId = req.headers.get("x-request-id") ?? crypto.randomUUID();
  return ok(
    {
      status: "up",
      ts: new Date().toISOString(),
    },
    requestId,
    {headers: {"x-request-id": requestId}},
  );
}