import { Status, STATUS_TEXT } from "$std/http/mod.ts";

const ensureHeaders = (
  init: ResponseInit = {},
  headers: Record<string, string> = {},
) => {
  if (!(init.headers instanceof Headers)) {
    init.headers = new Headers(init.headers);
  }
  for (const header in headers) {
    init.headers.set(header, headers[header]);
  }
};

const crossOriginResponse = (body: BodyInit, init: ResponseInit = {}) => {
    init.status ??= 200;
    init.statusText ??= STATUS_TEXT[init.status as Status];
    ensureHeaders(init, { "Access-Control-Allow-Origin": "*" });
    return new Response(body, init);
  },
  statusResponse = (status: Status, init: ResponseInit = {}) => {
    const body = `${status} ${STATUS_TEXT[status]}`;
    init.status ??= status;
    return crossOriginResponse(body, init);
  },
  jsonResponse = (data: unknown, init: ResponseInit = {}) => {
    ensureHeaders(init, { "Content-Type": "text/json" });
    return crossOriginResponse(JSON.stringify(data), init);
  },
  textResponse = (text: string, init: ResponseInit = {}) => {
    ensureHeaders(init, { "Content-Type": "text/plain" });
    return crossOriginResponse(text, init);
  };

export { jsonResponse, statusResponse, textResponse };
