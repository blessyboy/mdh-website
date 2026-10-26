import { createHash } from "node:crypto";
import { isIP } from "node:net";
import type { ContactMessage } from "../lib/contact";

export type MailConfig = { apiKey: string; from: string; to: string; siteOrigin?: string; trustProxy?: boolean };
export type SendResult = "accepted" | "failed" | "unconfigured";
type Dependencies = {
  config: () => MailConfig;
  validate: (message: ContactMessage) => Partial<Record<keyof ContactMessage, string>>;
  send: (message: ContactMessage, config: MailConfig, id: string) => Promise<SendResult>;
  now?: () => number;
};
const MAX_BYTES = 16_384;
const WINDOW = 10 * 60_000;
const fields = ["name", "email", "phone", "subject", "message"] as const;
const allowedFields = new Set<string>([...fields, "website"]);
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const hash = (value: string) => createHash("sha256").update(value).digest("hex");

function response(status: number, body: object, extra: Record<string, string> = {}) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", ...extra } });
}
async function readJson(request: Request) {
  if (!request.body) throw new Error("invalid");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > MAX_BYTES) { await reader.cancel(); throw new Error("large"); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  return JSON.parse(Buffer.concat(chunks).toString("utf8")) as unknown;
}

/** One instance per Node process. Apply shared edge limits before autoscaling. */
export function createContactHandler(deps: Dependencies) {
  const counters = new Map<string, { count: number; until: number }>();
  const requests = new Map<string, { digest: string; until: number; result: Promise<Response> }>();
  const now = deps.now ?? Date.now;
  function allow(key: string, limit: number) {
    const existing = counters.get(key);
    if (existing && existing.until > now()) {
      if (existing.count >= limit) return false;
      existing.count++; return true;
    }
    if (counters.size >= 1000) return false;
    counters.set(key, { count: 1, until: now() + WINDOW }); return true;
  }
  return async function handle(request: Request): Promise<Response> {
    const config = deps.config();
    let origin: string;
    try {
      const internal = new URL(request.url);
      // Next's standalone Request URL may use localhost even when the browser
      // reached 127.0.0.1. Compare with the actual Host, not that internal alias.
      // A configured public origin is authoritative behind a reverse proxy.
      const host = request.headers.get("host");
      if (host && (host.length > 255 || !/^[a-z0-9.\[\]:-]+$/i.test(host))) throw new Error("host");
      const url = new URL(config.siteOrigin || (host ? `${internal.protocol}//${host}` : request.url));
      if (!["http:", "https:"].includes(url.protocol)) throw new Error("origin");
      origin = url.origin;
    }
    catch { return response(503, { error: "We cannot send your message right now. Please call or email the hotel." }); }
    if (request.headers.get("origin") !== origin || request.headers.get("sec-fetch-site") === "cross-site") return response(403, { error: "Please send your message from the hotel website." });
    if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") return response(415, { error: "Please use the contact form to send your message." });
    const length = request.headers.get("content-length");
    if (length && (!/^\d+$/.test(length) || Number(length) > MAX_BYTES)) return response(413, { error: "Your message is too large. Please shorten it and try again." });
    for (const [key, value] of counters) if (value.until <= now()) counters.delete(key);
    for (const [key, value] of requests) if (value.until <= now()) requests.delete(key);
    if (!allow("global", 30)) return response(429, { error: "Too many enquiries right now. Please wait a few minutes or call the hotel." }, { "Retry-After": "600" });
    // Never trust client-supplied proxy headers unless the deployment explicitly
    // guarantees that its edge removes/replaces those headers.
    const ip = config.trustProxy ? request.headers.get("x-forwarded-for")?.split(",")[0].trim() : undefined;
    if (ip && isIP(ip) && !allow(`ip:${hash(ip)}`, 5)) return response(429, { error: "Please wait a few minutes before sending another enquiry." }, { "Retry-After": "600" });
    let input: unknown;
    try { input = await readJson(request); }
    catch (error) { return response(error instanceof Error && error.message === "large" ? 413 : 400, { error: "We could not read your message. Please check the form and try again." }); }
    if (!input || typeof input !== "object" || Array.isArray(input)) return response(400, { error: "Please check your message and try again." });
    const record = input as Record<string, unknown>;
    if (Object.keys(record).some(key => !allowedFields.has(key)) || fields.some(key => typeof record[key] !== "string") || (record.website !== undefined && typeof record.website !== "string")) return response(400, { error: "Please check the form fields and try again." });
    if (record.website) return response(400, { error: "We could not send this message. Please call or email the hotel." });
    const message = Object.fromEntries(fields.map(key => [key, (record[key] as string).trim()])) as ContactMessage;
    const errors = deps.validate(message);
    if (Object.keys(errors).length) return response(422, { error: "Please check the highlighted fields.", fields: errors });
    const id = request.headers.get("idempotency-key") || "";
    if (!uuid.test(id)) return response(400, { error: "Please refresh the page and try again." });
    if (config.from === "onboarding@resend.dev" && !["127.0.0.1", "localhost", "[::1]"].includes(new URL(origin).hostname)) return response(503, { error: "We cannot send your message right now. Please call or email the hotel directly." });
    if (!config.apiKey || !config.from || !config.to) return response(503, { error: "We cannot send your message right now. Please call or email the hotel directly." });
    const digest = hash(JSON.stringify(message));
    const prior = requests.get(id);
    if (prior) {
      if (prior.digest !== digest) return response(409, { error: "This message has changed. Please start a new enquiry." });
      return (await prior.result).clone();
    }
    if (!allow(`email:${hash(message.email.toLowerCase())}`, 3) || requests.size >= 1000) return response(429, { error: "Please wait a few minutes before sending another enquiry." }, { "Retry-After": "600" });
    const result = (async () => {
      try {
        const sent = await deps.send(message, config, id);
        if (sent === "accepted") return response(200, { ok: true, reference: id });
        if (sent === "unconfigured") return response(503, { error: "We cannot send your message right now. Please call or email the hotel directly." });
        return response(502, { error: "We could not confirm your message was sent. Please retry, or contact the hotel directly." });
      } catch { return response(502, { error: "We could not confirm your message was sent. Please retry, or contact the hotel directly." }); }
    })();
    requests.set(id, { digest, until: now() + WINDOW, result });
    const outgoing = await result;
    if (!outgoing.ok) requests.delete(id); // Provider idempotency protects ambiguous retries.
    return outgoing.clone();
  };
}
