import { cyan } from "https://deno.land/std/fmt/colors.ts";

import { InternalDatabaseError } from "../api/errors.ts";
import db from "./db.ts";

export const ssQuery = async (query: string, ...args: any[]) => {
  try {
    await db.connect();

    const result = await db.query(query, ...args);

    await db.end();

    const formatted = result.rows.map((row) => {
      return row.reduce((accum: Object, current: any, idx: number) => {
        return { ...accum, [result.rowDescription.columns[idx].name]: current };
      }, {});
    });
    console.info(cyan("ssQuery formatted result:"), formatted);
    return formatted;
  } catch (e) {
    throw new InternalDatabaseError(e);
  }
};
