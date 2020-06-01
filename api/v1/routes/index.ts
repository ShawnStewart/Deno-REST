import { Application } from "../../../deps.ts";

import userRoutes from "./user.ts";

import { InvalidEndpointError } from "../../errors.ts";

const getRoutes = (app: Application) => {
  app.use(userRoutes.routes());
  app.use(userRoutes.allowedMethods());

  // 404
  app.use((ctx, next) => {
    throw new InvalidEndpointError(ctx.request.method, ctx.request.url);
  });
};

export default getRoutes;
