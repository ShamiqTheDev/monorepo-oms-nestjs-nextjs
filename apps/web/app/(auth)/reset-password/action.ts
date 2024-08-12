"use server";
import { Auth } from "@atdb/client-services";

export const requestPasswordReset = async (_, form: FormData) => {
  const email = form.get("email") as string | null;

  const res = await Auth.apiCall("auth/request-password-reset", {
    cache: "no-store",
    method: "POST",
    body: JSON.stringify({ email }),
    headers: { "Content-Type": "application/json" },
  });

  return { ok: res.ok };
};

export const updatePasswordReset = async (_, form: FormData) => {
  const token = form.get("token") as string | null;
  const password = form.get("password") as string | null;
  const passwordConfirmation = form.get("passwordConfirmation") as string | null;

  if (!token || !password || !passwordConfirmation) return { ok: false, error: "Missing required field(s)" };
  if (password !== passwordConfirmation) return { ok: false, error: "Passwords do not match" };

  const res = await Auth.apiCall("auth/reset-password", {
    cache: "no-store",
    method: "POST",
    body: JSON.stringify({ token, newPassword: password }),
    headers: { "Content-Type": "application/json" },
  });

  return { ok: res.ok };
};
