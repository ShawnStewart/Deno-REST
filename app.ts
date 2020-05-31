import "https://deno.land/x/dotenv@v0.4.0/load.ts";

import server from "./api/server.ts";

const port = Number(Deno.env.get("PORT")) || 3000;

try {
  console.log(`=== Starting server on port ${port} ===`);
  server.listen({ port });
} catch (e) {
  console.error("Error starting server...\n", e);
}
