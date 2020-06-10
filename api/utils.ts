import { cyan } from "https://deno.land/std/fmt/colors.ts";

import db from "../db/db.ts";
import { Context } from "../deps.ts";
import { InternalDatabaseError, RequestBodyError } from "./errors.ts";

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

export const ssQuery = async (query: string, ...args: any[]) => {
  try {
    await db.connect();
    const queryResult = await db.query(query, ...args);
    await db.end();

    const columnList = queryResult.rowDescription.columns;
    const formatted = queryResult.rows.map((row) => {
      return row.reduce((accum: Object, current: any, idx: number) => {
        return { ...accum, [columnList[idx].name]: current };
      }, {});
    });
    const result = formatted.length === 1 ? formatted[0] : formatted;

    console.info(cyan("ssQuery formatted result:"), result);

    return result;
  } catch (e) {
    throw new InternalDatabaseError(e);
  }
};
