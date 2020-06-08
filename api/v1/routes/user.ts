import { ssQuery } from "../../../db/utils.ts";
import { bcrypt, Router } from "../../../deps.ts";
import { bodyRequired } from "../../utils.ts";

const router = new Router();

router.get("/users", async (ctx) => {
  try {
    const users = await ssQuery(
      "SELECT id, username FROM Users WHERE is_deleted IS false",
    );

    ctx.response.status = 200;
    ctx.response.body = { users };
  } catch (e) {
    throw e;
  }
});

router.post("/users/register", bodyRequired, async (ctx) => {
  const body = await ctx.request.body();
  const { username, password } = body.value;

  const hash = await bcrypt.hash(password);

  try {
    await ssQuery(
      "INSERT INTO Users(username, password) VALUES($1, $2)",
      username,
      hash,
    );
  } catch (e) {
    throw e;
  }

  const created = { username, password: hash };
  ctx.response.status = 201;
  ctx.response.body = { message: `Created new user`, created };
});

export default router;
