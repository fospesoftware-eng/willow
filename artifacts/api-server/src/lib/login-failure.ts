type AuthFailure = { message: string; code?: string; status?: number };

export function loginFailure(error: AuthFailure) {
  // Gateway key rejection is a server configuration problem, not a bad password.
  if (error.code === "invalid_api_key" || /invalid api key/i.test(error.message)) {
    return {
      status: 503,
      error: "Admin sign-in is unavailable because the authentication service is not configured correctly. Please contact the site administrator.",
    };
  }
  return { status: 401, error: "Invalid email or password." };
}
