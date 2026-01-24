import { prisma } from "@/lib/prisma";
import { ok, bad } from "@/lib/http";

export async function GET(req: Request) {
  const requestId = req.headers.get("x-request-id") ?? crypto.randomUUID();

  try {
    await prisma.$queryRaw`SELECT 1`;
    return ok(
      { status: "up", db: "connected", ts: new Date().toISOString() },
      requestId,
    );
  } catch (err) {
    return bad("Database not reachable", requestId, 500);
  }
}
