// src/api/chart.ts

export default async function chartHandler(request, response) {
  // Set CORS headers
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight requests
  if (request.method === "OPTIONS") {
    response.status(200).end();
    return;
  }

  try {
    const { id, days = "7", interval = "hourly" } = request.query;

    const endpoint = `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}&interval=${interval}`;
    const apiRes = await fetch(endpoint);
    const result = await apiRes.json();

    response.status(200).json(result);
  } catch (err) {
    console.error("Error fetching chart data:", err);
    response.status(500).json({ message: "Unable to fetch chart data" });
  }
}
