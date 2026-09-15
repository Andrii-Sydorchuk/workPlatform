import { wait } from "./wait";
import { DELAY } from "../config/delay";
import { getRandomIntInRange } from "./getRandomIntInRange";

export async function mockFetch(
  url: string = "/api/vacancies",
  options?: RequestInit
): Promise<Response> {
  // Response delay: 300–800 ms (random)
  const randomDelay = getRandomIntInRange({min: DELAY.MIN, max: DELAY.MAX});

  await wait(randomDelay);

  // Random query error—approximately 1 in 5
  const randomThrow = Math.random() < 0.2;

  if (randomThrow) {
    throw new TypeError("Failed to fetch: Network or server error");
  }

  const method = options?.method?.toUpperCase() || "GET";

  if (method === "POST" && url === "/api/applications") {
    return new Response(
      JSON.stringify({ success: true, message: "Application submitted successfully" }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  }

  if (method === "GET") {
    if (url === "/api/vacancies") {
      const vacanciesModule = await import("../data/vacancies.json");
      return new Response(JSON.stringify(vacanciesModule.default), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (url === "/api/partners") {
      const partnersModule = await import("../data/partners.json");
      return new Response(JSON.stringify(partnersModule.default), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (url?.startsWith("/api/partners/")) {
      const slug = url.replace("/api/partners/", "");
      const partnersModule = await import("../data/partners.json");
      const partner = partnersModule.default.find((p) => p.slug === slug);

      if (partner) {
        return new Response(JSON.stringify(partner), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ error: "Partner not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  return new Response(JSON.stringify({ error: "Endpoint not found" }), {
    status: 404,
    headers: { "Content-Type": "application/json" },
  });
}

export async function mockFetchWithRetry(
  url: string = "/api/vacancies",
  options?: RequestInit,
  retries: number = 2
): Promise<Response> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await mockFetch(url, options);
    } catch (error) {
      if (attempt === retries) throw error;
      await wait(DELAY.RETRY);
    }
  }
  throw new Error("Failed after retries");
}