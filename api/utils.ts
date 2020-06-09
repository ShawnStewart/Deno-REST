import { RequestBodyMissing } from "./errors.ts";
import { Context } from "../deps.ts";

export const bodyRequired = async (ctx: Context, next: Function) => {
  if (!ctx.request.hasBody) {
    throw new RequestBodyMissing();
  }

  try {
    // Check that body is parsable JSON
    await ctx.request.body();
    await next();
  } catch (e) {
    throw e;
  }
};
