import { pgClient } from "../deps.ts";

const client = new pgClient({
  hostname: Deno.env.get("DB_HOSTNAME"),
  port: Number(Deno.env.get("DB_PORT")),
  user: Deno.env.get("DB_USER"),
  database: Deno.env.get("DB_DATABASE"),
});

export default client;
