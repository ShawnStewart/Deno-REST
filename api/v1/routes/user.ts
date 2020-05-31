import { bcrypt, Router } from "../../../deps.ts";

const router = new Router();

router.get("/users", (ctx) => {
  ctx.response.body = "users!";
});

router.post("/users/hash", async (ctx) => {
  const body = await ctx.request.body();

  ctx.response.body = { message: `going to hash ${body.value.password}` };
});

export default router;
