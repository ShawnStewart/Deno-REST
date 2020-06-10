import { ssQuery } from "../../../db/utils.ts";
import {
  bcrypt,
  makeJwt,
  setExpiration,
  Jose,
  Payload,
  Router,
} from "../../../deps.ts";
import {
  ArgumentsError,
  AuthenticationError,
  EnvironmentVariableMissing,
} from "../../errors.ts";
import { bodyRequired } from "../../utils.ts";

const router = new Router();

router.get("/api/v1/users", async (ctx) => {
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

router.post("/api/v1/users/register", bodyRequired, async (ctx) => {
  const body = await ctx.request.body();
  const { username, password, ...rest } = body.value;
  const errors: { [key: string]: string } = {};
  let hashedPassword;

  // Username validation
  if (!username) {
    errors.username = "Username is required";
  } else if (`${username}`.length > 20) {
    errors.username = "Username can not be more than 20 characters";
  } else if (!/^[a-zA-Z0-9]+$/g.test(username)) {
    errors.username = "Username must only contain letters or numbers";
  }

  // Password validation
  if (!password) {
    errors.password = "Password is required";
  } else if (`${password}`.length < 6) {
    errors.password = "Password must be at lease x characters";
  }

  for (const key in rest) {
    errors[key] = `Unknown argument: ${key}`;
  }

  if (Object.keys(errors).length) {
    throw new ArgumentsError(errors);
  }

  try {
    hashedPassword = await bcrypt.hash(password);
    const user = await ssQuery(
      "SELECT id, username FROM Users WHERE username=$1",
      username,
    );

    if (user) {
      throw new ArgumentsError({ username: "Username taken" });
    }

    await ssQuery(
      "INSERT INTO Users(username, password) VALUES($1, $2)",
      username,
      hashedPassword,
    );
  } catch (e) {
    throw e;
  }

  const created = { username, password: hashedPassword };
  ctx.response.status = 201;
  ctx.response.body = { message: `Created new user`, created };
});

router.post("/api/v1/users/login", bodyRequired, async (ctx) => {
  const body = await ctx.request.body();
  const { username, password, ...rest } = body.value;
  const errors: { [key: string]: string } = {};

  // Username validation
  if (!username) {
    errors.username = "Enter your username";
  }

  // Password validation
  if (!password) {
    errors.password = "Enter your password";
  }

  for (const key in rest) {
    errors[key] = `Unknown argument: ${key}`;
  }

  if (Object.keys(errors).length) {
    throw new ArgumentsError(errors);
  }

  try {
    const user = await ssQuery(
      "SELECT id, username, password FROM Users WHERE username=$1",
      username,
    );

    if (!user || !await bcrypt.compare(password, user.password)) {
      throw new AuthenticationError();
    }

    // Generate JWT
    const header: Jose = {
      alg: "HS256",
      type: "JWT",
    };
    const payload: Payload = {
      iss: "Deno-REST Authentication",
      exp: setExpiration(new Date().getTime() + 7 * 60 * 60 * 1000),
    };
    const key = Deno.env.get("JWT_SECRET");

    if (!key) {
      throw new EnvironmentVariableMissing("JWT_SECRET");
    }

    ctx.response.status = 200;
    ctx.response.body = {
      message: "Login successful",
      token: makeJwt({ header, payload, key }),
    };
  } catch (e) {
    throw e;
  }
});

export default router;
