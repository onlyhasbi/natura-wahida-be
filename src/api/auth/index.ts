import Elysia, { status, t } from "elysia";
import * as jose from "jose";
import { message } from "../../common/constant";
import { expiryDuration, getCurrentTime } from "../../common/utils";
import {
  jwtAccessConfig as jwtAccess,
  jwtRefreshConfig as jwtRefresh,
} from "../../plugins/jwtConfig";
import { SignupRequestValidationSchema } from "../users/schema";
import { SigninRequestValidationSchema } from "./schema";
import {
  addAuth,
  addUser,
  deleteAuth,
  findAuthBy,
  findUserBy,
  isTokenExists,
  updateAuth,
} from "./services";

const defaultTag = {
  detail: {
    tags: ["Auth"],
  },
};

export const auth = new Elysia({ name: "auth" })
  .use(jwtAccess)
  .use(jwtRefresh)
  .post(
    "/signin",
    async ({ jwtAccess, jwtRefresh, body }) => {
      const { email, password } = body;
      const found_user = await findUserBy("email", email);
      const password_match =
        found_user?.password &&
        (await Bun.password.verify(password, found_user.password));

      if (!found_user || !password_match) {
        return status(400, { message: "invalid email or password" });
      }

      const user_payload = {
        sub: String(found_user!.id),
        name: found_user.name,
      };

      const now = Math.floor(Date.now() / 1000);

      const access_token = await jwtAccess.sign({
        ...user_payload,
        name: "access_token",
        exp: expiryDuration(Bun.env.ACCESS_TOKEN_EXPIRY!),
        jti: Bun.randomUUIDv7(),
      });

      const refresh_token = await jwtRefresh.sign({
        ...user_payload,
        name: "refresh_token",
        exp: expiryDuration(Bun.env.REFRESH_TOKEN_EXPIRY!),
        jti: Bun.randomUUIDv7(),
      });

      await addAuth({ user_id: found_user.id, access_token, refresh_token });
      return status(200, { access_token, refresh_token });
    },
    {
      body: SigninRequestValidationSchema,
      response: {
        200: t.Object({
          access_token: t.String(),
          refresh_token: t.String(),
        }),
        400: t.Object({ message: t.String() }),
      },
      ...defaultTag,
    }
  )
  .post(
    "/signup",
    async ({ status, body }) => {
      const { password, ...rest } = body;
      const hashed_password = await Bun.password.hash(password);
      const payload = { password: hashed_password, ...rest };
      const result = addUser(payload);
      return status(200, {
        name: result.name,
      });
    },
    {
      body: SignupRequestValidationSchema,
      response: {
        200: t.Object({
          name: t.String(),
        }),
      },
      ...defaultTag,
    }
  )
  .delete(
    "/signout",
    async ({ headers: { authorization }, status }) => {
      const token = authorization ? authorization.split(" ")?.[1] : undefined;
      if (!authorization || !token) {
        return status(400, message("NoToken"));
      }

      const is_authenticated = await findAuthBy(
        "access_token",
        token
      ).execute();
      if (!is_authenticated) {
        return status(400, message("InvalidToken"));
      }

      deleteAuth(token).execute();
      return status(200, message("Signout"));
    },
    {
      response: {
        200: t.Object({
          message: t.String(),
        }),
        400: t.Object({
          message: t.String(),
        }),
      },
      ...defaultTag,
    }
  )
  .post(
    "/refreshToken",
    async ({ body, status, jwtAccess, jwtRefresh }) => {
      const is_exist = await isTokenExists(body);
      const decode_token = is_exist && jose.decodeJwt(body.access_token);

      const user_payload = {
        sub: String(decode_token.sub),
        name: String(decode_token.name),
      };

      const access_token = await jwtAccess.sign({
        ...user_payload,
        name: "access_token",
        exp: expiryDuration(Bun.env.ACCESS_TOKEN_EXPIRY!),
        jti: Bun.randomUUIDv7(),
      });

      const refresh_token = await jwtRefresh.sign({
        ...user_payload,
        name: "refresh_token",
        exp: expiryDuration(Bun.env.REFRESH_TOKEN_EXPIRY!),
        jti: Bun.randomUUIDv7(),
      });

      const result = await updateAuth({
        user_id: Number(decode_token.sub),
        access_token,
        refresh_token,
      });

      return status(200, {
        access_token: result.access_token,
        refresh_token: result.refresh_token,
      });
    },
    {
      body: t.Object({
        access_token: t.String({ minLength: 1 }),
        refresh_token: t.String({ minLength: 1 }),
      }),
      ...defaultTag,
    }
  );
