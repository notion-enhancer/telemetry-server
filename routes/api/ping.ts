import { HandlerContext } from "$fresh/server.ts";
import { Status } from "std/http/mod.ts";
import { supabase } from "../../supabase.ts";
import { statusResponse, textResponse } from "./_lib.ts";

interface Ping {
  platform: string;
  version: string;
  timezone: string;
  enabled_mods: string[];
}

export const handler = async (
  req: Request,
  _ctx: HandlerContext,
): Promise<Response> => {
  try {
    // ensure pings are from notion.so
    // to impede manual spam: may need
    // greater security if api is abused
    const origin = req.headers.get("Origin"),
      { hostname = "" } = origin ? new URL(origin) : {};
    if (hostname !== "www.notion.so") {
      return statusResponse(Status.Forbidden);
    }

    if (req.method !== "POST") {
      return statusResponse(Status.MethodNotAllowed);
    }

    try {
      const body = await req.json(),
        { error } = await supabase
          .from("telemetry_pings")
          .insert([body]);
      if (error) throw error;
    } catch {
      return statusResponse(Status.BadRequest);
    }

    // success: respond with timestamp
    return textResponse(new Date().toISOString());
  } catch (err) {
    console.error(err);
    return statusResponse(Status.InternalServerError);
  }
};
