import { HandlerContext } from "$fresh/server.ts";
import { supabase } from "../../supabase.ts";

interface Ping {
  timestamp: string;
  platform: string;
  version: string;
  timezone: string;
  enabled_mods: string[];
}

const formateDate = (date: Date) => {
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
    return `${formateDate(start)}_${formateDate(end)}`;
  };

export const handler = async (
  _req: Request,
  _ctx: HandlerContext,
): Promise<Response> => {
  const headers = new Headers({ "Access-Control-Allow-Origin": "*" });

  try {
    const { data, error } = await supabase
      .from("telemetry_pings")
      .select("*");
    if (error) throw error;

    const stats: Record<string, {
      weekly_users?: number;
      by_platform?: { [k: string]: number };
      by_version?: { [k: string]: number };
      by_timezone?: { [k: string]: number };
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
    }

    headers.set("content-type", "text/json");
    return new Response(JSON.stringify(stats), { status: 200, headers });
  } catch (err) {
    console.log(err);
    return new Response(null, { status: 500, headers });
  }
};