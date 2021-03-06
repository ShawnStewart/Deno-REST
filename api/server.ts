import { green, red, white } from "https://deno.land/std/fmt/colors.ts";

import { Application } from "../deps.ts";
import { EnvironmentVariableMissing, InternalServerError } from "./errors.ts";
import getRoutes from "./routes/index.ts";

const COOKIE_SECRET = Deno.env.get("COOKIE_SECRET");

if (!COOKIE_SECRET) {
  throw new EnvironmentVariableMissing("COOKIE_SECRET");
}

const app = new Application();
app.keys = [COOKIE_SECRET];

// Logger
app.use(async (ctx, next) => {
  await next();
  const responseTime = ctx.response.headers.get("X-Response-Time");
  const dateTime = new Date()
    .toISOString()
    .replace(/T/, " ")
    .replace(/\..+/, "");

  const color = !ctx.response.status
    ? white
    : ctx.response.status < 300
    ? green
    : red;

  console.log(color(
    `[${dateTime}]: ${ctx.request.method} ${ctx.request.url} - ${responseTime}`,
  ));
});

// Timing
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.response.headers.set("X-Response-Time", `${ms}ms`);
});

// Error handling
app.use(async (ctx, next) => {
  try {
    await next();

    if (!ctx.response.body) {
      throw new InternalServerError(
        "Sorry about that! Your request did not fail, but we did not set a response",
      );
    }
  } catch (e) {
    console.error(e);

    const error = !e.status ? new InternalServerError() : e;

    ctx.response.status = error.status;
    ctx.response.body = error;
  }
});

getRoutes(app);

export default app;
