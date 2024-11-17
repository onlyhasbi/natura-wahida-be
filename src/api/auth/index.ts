import * as argon from "argon2";
import { Hono } from "hono";
import { validator } from "hono/validator";
import { handleThrow } from "../../middlewares/throwException";
import {
  deleteToken,
  getRefreshToken,
  postToken,
  putToken,
} from "../../services/mysql/token";
import { getEmail, getUsername, postUser } from "../../services/mysql/user";
import { decodeToken, getToken } from "../../tokenize";
import { RefreshToken } from "../../types/tokens";
import { SignIn, SignUp } from "../../types/users";
import { validateSigninPayload } from "../../validator/auth";
import { validatePayload } from "../users";

const validateSignInPayload = validator("json", async (_, c) => {
  const payload = (await c.req.json()) as SignIn;
  const { error, data } = validateSigninPayload(payload);

  if (error) {
    handleThrow<typeof error.formErrors.fieldErrors>({
      type: "badRequest",
      error: error.formErrors.fieldErrors,
    });
    return;
  }
  return data;
});

export const auth = new Hono()
  .post("/signup", validatePayload("post"), async (c) => {
    const { password, ...rest } = (await c.req.json()) as SignUp;

    const isUsernameExist = (await getUsername(rest.username)).length;
    if (isUsernameExist) {
      handleThrow({ type: "conflictUsername" });
      return;
    }

    const isEmailExist = (await getEmail(rest.email)).length;
    if (isEmailExist) {
      handleThrow({ type: "conflictEmail" });
      return;
    }

    const password_hash = await argon.hash(password);
    const id = await postUser({ ...rest, password_hash });
    return c.json({
      data: { id },
      message: "User registered successfully",
    });
  })
  .post("/signin", validateSignInPayload, async (c) => {
    const payload = (await c.req.json()) as SignIn;
    const [user] = await getUsername(payload.username);

    if (!user) {
      handleThrow({ type: "invalidAuth" });
      return;
    }

    const isPasswordMatch = await argon.verify(
      user.password_hash,
      payload.password
    );

    if (!isPasswordMatch) {
      handleThrow({ type: "invalidAuth" });
      return;
    }

    const token = await getToken(user.id);
    await postToken(token);

    return c.json({
      data: token,
      message: "Login successful. Welcome back!",
    });
  })
  .post("/signout", async (c) => {
    const { refresh_token: refreshToken } =
      (await c.req.json()) as RefreshToken;

    if (!refreshToken) {
      handleThrow({
        type: "unauthorized",
        customMessage: "No refresh token provided",
      });
    }

    if (refreshToken) await deleteToken(refreshToken);
    return c.json({
      message: refreshToken ? "Sign out successfully!" : "No token provided",
    });
  })
  .post("/refresh_token", async (c) => {
    const { refresh_token: refreshToken } = (await c.req.json()) as RefreshToken;

    if (!refreshToken) {
      handleThrow({
        type: "unauthorized",
        customMessage: "No refresh token provided",
      });
    }

    const isRefreshTokenExist = (await getRefreshToken(refreshToken)).length;
    if (!isRefreshTokenExist) {
      handleThrow({
        type: "unauthorized",
        customMessage: "Invalid refresh token",
      });
    }

    const {
      payload: { id },
    } = await decodeToken(refreshToken);
    const token = await getToken(Number(id));

    await putToken(token, refreshToken);

    return c.json({
      ...(refreshToken ? { data: token } : {}),
      message: refreshToken
        ? "Token refreshed successfully"
        : "No token provided or Token expired",
    });
  });
