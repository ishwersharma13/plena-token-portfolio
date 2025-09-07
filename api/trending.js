// src/api/trending.ts

export default async function trendingHandler(request, response) {
  // Allow cross-origin requests
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight OPTIONS request
  if (request.method === "OPTIONS") {
    response.status(200).end();
    return;
  }

  try {
    const apiEndpoint = "https://api.coingecko.com/api/v3/search/trending";

    const coinRes = await fetch(apiEndpoint);
    const payload = await coinRes.json();

    response.status(200).json(payload);
  } catch (err) {
    console.error("Failed to retrieve trending tokens:", err);
    response
      .status(500)
      .json({ message: "Could not load trending token data" });
  }
}
