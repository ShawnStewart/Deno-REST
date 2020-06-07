import { bcrypt, Router } from "../../../deps.ts";
import { bodyRequired } from "../../utils.ts";

const router = new Router();

interface User {
  username: string;
  password: string;
}

const users: User[] = [];

router.get("/users", (ctx) => {
  ctx.response.status = 200;
  ctx.response.body = { users };
});

router.post("/users/register", bodyRequired, async (ctx) => {
  const body = await ctx.request.body();
  const { username, password } = body.value;

  const hash = await bcrypt.hash(password);
  const created = { username, password: hash };

  users.push(created);

  ctx.response.status = 201;
  ctx.response.body = { message: `Created new user`, created };
});

export default router;
