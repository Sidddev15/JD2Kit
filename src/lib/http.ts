import { NextResponse } from "next/server";

export function getRequestId(req: Request) {
  return req.headers.get("x-request-id") ?? crypto.randomUUID();
}

export function ok<T>(data: T, requestId: string, init?: ResponseInit) {
  return NextResponse.json({ ok: true, requestId, data }, {status: 200, ...init})
}

export function bad(message: string, requestId: string, status = 400) {
  return NextResponse.json({ ok: false, requestId, error: {message} }, {status})
}