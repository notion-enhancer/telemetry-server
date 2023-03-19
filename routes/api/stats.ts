import { HandlerContext } from "$fresh/server.ts";
import { Status } from "$std/http/mod.ts";
import { jsonResponse, statusResponse } from "~/utils/response.ts";
import { getWeek } from "~/utils/datetime.ts";
import { supabase } from "~/utils/supabase.ts";

export const handler = async (
  _req: Request,
  _ctx: HandlerContext,
): Promise<Response> => {
  try {
    const { data, error } = await supabase
      .from("telemetry_pings")
      .select("*");
    if (error) throw error;

    // bring latest to top
    data.reverse();
    const stats: Record<string, {
      weekly_users: number;
      by_platform: { [k: string]: number };
      by_version: { [k: string]: number };
      by_timezone: { [k: string]: number };
      by_mods: { [k: string]: number };
    }> = {};
    for (const ping of data) {
      const week = getWeek(ping.timestamp);
      stats[week] ??= {
        weekly_users: 0,
        by_platform: {},
        by_version: {},
        by_timezone: {},
        by_mods: {},
      };
      stats[week].weekly_users++;
      stats[week].by_platform[ping.platform] ??= 0;
      stats[week].by_platform[ping.platform]++;
      stats[week].by_version[ping.version] ??= 0;
      stats[week].by_version[ping.version]++;
      stats[week].by_timezone[ping.timezone] ??= 0;
      stats[week].by_timezone[ping.timezone]++;
      for (const id of ping.enabled_mods) {
        stats[week].by_mods[id] ??= 0;
        stats[week].by_mods[id]++;
      }
    }

    return jsonResponse(stats);
  } catch (err) {
    console.error(err);
    return statusResponse(Status.InternalServerError);
  }
};
