import { RequestBodyError } from "./errors.ts";
import { Context } from "../deps.ts";

export const bodyRequired = async (ctx: Context, next: Function) => {
  /**
   * Checks that the request has a body and that it is parsable
   */
  try {
    const body = await ctx.request.body();

    if (!ctx.request.hasBody || !Object.keys(body.value).length) {
      throw new RequestBodyError(
        "The request was expected to have a body, but did not have one",
      );
    }
  } catch (e) {
    throw e instanceof RequestBodyError ? e : new RequestBodyError();
  }

  await next();
};
