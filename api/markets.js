// src/api/markets.ts

export default async function marketsHandler(request, response) {
  // Enable CORS
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight OPTIONS
  if (request.method === "OPTIONS") {
    response.status(200).end();
    return;
  }

  try {
    const {
      ids,
      sparkline = "true",
      per_page = "100",
      page = "1",
    } = request.query;

    const endpoint = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=${per_page}&page=${page}&sparkline=${sparkline}&price_change_percentage=24h`;

    const marketRes = await fetch(endpoint);
    const marketData = await marketRes.json();

    response.status(200).json(marketData);
  } catch (err) {
    console.error("Error fetching markets data:", err);
    response.status(500).json({ message: "Unable to fetch market data" });
  }
}
