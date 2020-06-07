import { RequestBodyMissing } from "./errors.ts";
import { Context } from "../deps.ts";

export const bodyRequired = (ctx: Context) => {
  if (!ctx.request.hasBody) {
    throw new RequestBodyMissing();
  }
};
