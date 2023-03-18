import { HandlerContext } from "$fresh/server.ts";
import { Status } from "std/http/mod.ts";
import { supabase } from "../../supabase.ts";
import { jsonResponse, statusResponse } from "./_lib.ts";

interface Ping {
  timestamp: string;
  platform: string;
  version: string;
  timezone: string;
  enabled_mods: string[];
}

const formatDate = (date: Date) => {
    const yyyy = date.getUTCFullYear(),
      mm = String(date.getUTCMonth() + 1).padStart(2, "0"),
      dd = String(date.getDate() + 1).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  },
  getWeek = (date: Date | string) => {
    const start = new Date(date),
      end = new Date(date);
    start.setDate(start.getDate() - start.getDay() + 1);
    end.setDate(end.getDate() + 6 - start.getDay());
    return `${formatDate(start)}_${formatDate(end)}`;
  };

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
      weekly_users?: number;
      by_platform?: { [k: string]: number };
      by_version?: { [k: string]: number };
      by_timezone?: { [k: string]: number };
      by_mods?: { [k: string]: number };
    }> = {};
    for (const ping of data) {
      const week = getWeek(ping.timestamp);
      stats[week] ??= {};
      stats[week].weekly_users ??= 0;
      stats[week].weekly_users!++;
      stats[week].by_platform ??= {};
      stats[week].by_platform![ping.platform] ??= 0;
      stats[week].by_platform![ping.platform]!++;
      stats[week].by_version ??= {};
      stats[week].by_version![ping.version] ??= 0;
      stats[week].by_version![ping.version]!++;
      stats[week].by_timezone ??= {};
      stats[week].by_timezone![ping.timezone] ??= 0;
      stats[week].by_timezone![ping.timezone]!++;
      stats[week].by_mods ??= {};
      for (const id of ping.enabled_mods) {
        stats[week].by_mods![id] ??= 0;
        stats[week].by_mods![id]!++;
      }
    }

    return jsonResponse(stats);
  } catch (err) {
    console.error(err);
    return statusResponse(Status.InternalServerError);
  }
};
