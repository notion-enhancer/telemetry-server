import { Head } from "$fresh/runtime.ts";
import Counter from "../islands/Counter.tsx";

export default function Home() {
  return (
    <>
      <Head>
        <title>notion-enhancer</title>
        <style>
          {`a {
            text-decoration-color: rgba(0, 0, 0, 0.4) !important;
          }
          a:hover {
            text-shadow: 0 0 1px currentColor;
            text-decoration-color: rgba(0, 0, 0, 0.2) !important;
          }`}
        </style>
      </Head>
      <div class="p-4 flex flex-col h-screen w-screen">
        <div class="mt-[33%] mx-auto max-w-screen-sm">
          <h1 class="flex">
            <img
              src="/logo.svg"
              class="w-16 h-16"
            />
            <span class="ml-6 my-auto font-mono font-bold text-3xl">
              notion-enhancer
            </span>
          </h1>
          <p class="my-6">
            This website serves as a host for notion-enhancer related services,
            e.g. telemetry. Proper documentation and a public interface will be
            released at a later date. To learn more about the notion-enhancer,
            visit{" "}
            <a
              href="https://notion-enhancer.github.io/"
              class="text-underline transition-all"
            >
              the website
            </a>{" "}
            or join the{" "}
            <a
              href="https://discord.gg/sFWPXtA"
              class="text-underline transition-all"
            >
              Discord server
            </a>.
          </p>
          <ul class="ml-4 list-disc">
            <li>
              <a href="/api/ping" class="bg-gray-100 rounded-md px-1 py-0.5">
                <code>/api/ping</code>
              </a>: the endpoint used to collect telemetry data from
              notion-enhancer users.
            </li>
            <li>
              <a href="/api/stats" class="bg-gray-100 rounded-md px-1 py-0.5">
                <code>/api/stats</code>
              </a>: a public JSON aggregate of the notion-enhancer's weekly
              usage stats.
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
