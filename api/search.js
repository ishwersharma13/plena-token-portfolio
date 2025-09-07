// src/api/search.ts

export default async function searchHandler(request, response) {
  // Setup CORS headers
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight check
  if (request.method === "OPTIONS") {
    response.status(200).end();
    return;
  }

  try {
    const { query: searchTerm } = request.query;

    const endpoint = `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(
      searchTerm
    )}`;

    const apiRes = await fetch(endpoint);
    const result = await apiRes.json();

    response.status(200).json(result);
  } catch (err) {
    console.error("Token Search API failed:", err);
    response.status(500).json({ message: "Unable to perform search" });
  }
}
