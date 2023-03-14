import { HandlerContext } from "$fresh/server.ts";
import { supabase } from "../../supabase.ts";

interface Ping {
  platform: string;
  version: string;
  timezone: string;
  enabled_mods: string[];
}

const uuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  platforms = [
    "aix",
    "darwin",
    "freebsd",
    "linux",
    "openbsd",
    "sunos",
    "win32",
    "firefox",
    "chromium",
  ];
const isId = (str: unknown) => {
    if (typeof str !== "string") return false;
    return uuid.test(str);
  },
  isPlatform = (str: unknown): str is Ping["platform"] => {
    if (typeof str !== "string") return false;
    return platforms.includes(str);
  },
  isPing = (body: unknown): body is Ping => {
    if (!body || typeof body !== "object") return false;
    const _body = body as Record<string, unknown>,
      isProp = (key: string) => key in _body && typeof _body[key] === "string";
    return isPlatform(_body.platform) && isProp("version") &&
      isProp("timezone") && Array.isArray(_body.enabled_mods) &&
      _body.enabled_mods.every(isId);
  };

export const handler = async (
  req: Request,
  _ctx: HandlerContext,
): Promise<Response> => {
  const headers = new Headers({ "Access-Control-Allow-Origin": "*" });
  if (req.method !== "POST") {
    return new Response(null, { status: 405, headers });
  }

  try {
    const body = await req.json();
    if (!isPing(body)) throw new Error("invalid ping body");

    const { error } = await supabase
      .from("telemetry_pings")
      .insert([body]);
    if (error) throw error;

    // success: respond with timestamp
    return new Response(new Date().toISOString(), { status: 200, headers });
  } catch {
    return new Response(null, { status: 400, headers });
  }
};
