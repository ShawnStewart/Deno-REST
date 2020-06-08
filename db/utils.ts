import db from "./db.ts";

export const ssQuery = async (query: string) => {
  await db.connect();
  console.log("connected to db");
  const result = await db.query(query);
  console.log("query executed", result);
  await db.end();

  return result;
};
