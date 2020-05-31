import { Application } from "../deps.ts";

import getRoutes from "./v1/routes/index.ts";
import { InternalServerError } from "./errors.ts";

const app = new Application();

// Logger
app.use(async (ctx, next) => {
  await next();
  const responseTime = ctx.response.headers.get("X-Response-Time");
  console.log(`${ctx.request.method} ${ctx.request.url} - ${responseTime}`);
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
    if (!err) {
      err = new InternalServerError();
    }

    ctx.response.status = err.status;
    ctx.response.body = err;
  }
});

getRoutes(app);

export default app;
