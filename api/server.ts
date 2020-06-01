import { Application } from "../deps.ts";

import getRoutes from "./v1/routes/index.ts";
import { InternalServerError } from "./errors.ts";

const app = new Application();

// Logger
app.use(async (ctx, next) => {
  await next();
  const responseTime = ctx.response.headers.get("X-Response-Time");
  const dateTime = new Date()
    .toISOString()
    .replace(/T/, " ")
    .replace(/\..+/, "");

  console.log(
    `[${dateTime}]: ${ctx.request.method} ${ctx.request.url} - ${responseTime}`,
  );
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
  } catch (err) {
    console.error(err);

    const error = err instanceof InternalServerError
      ? err
      : new InternalServerError(err.status, err.message);

    ctx.response.status = error.status;
    ctx.response.body = error;
  }
});

getRoutes(app);

export default app;
