import { test, expect } from "@playwright/test";
import { loginFailure } from "../artifacts/api-server/src/lib/login-failure";

test("invalid Supabase API keys are not reported as password failures", () => {
  const result = loginFailure({ message: "Invalid API key", status: 401 });
  expect(result.status).toBe(503);
  expect(result.error).toContain("not configured correctly");
  expect(result.error).not.toContain("Invalid email or password");
});

test("incorrect passwords retain the non-identifying login response", () => {
  expect(loginFailure({ message: "Invalid login credentials", code: "invalid_credentials", status: 400 }))
    .toEqual({ status: 401, error: "Invalid email or password." });
});
