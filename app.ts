import { white } from "https://deno.land/std/fmt/colors.ts";
import "https://deno.land/x/dotenv@v0.4.2/load.ts";

import server from "./api/server.ts";

const port = Number(Deno.env.get("APP_PORT")) || 3000;

try {
  console.log(white(`=== Starting server on port ${port} ===`));
  server.listen({ port });
} catch (e) {
  console.error("Error starting server...\n", e);
}
