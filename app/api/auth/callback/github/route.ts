import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { STATE_COOKIE } from "@/lib/oauth-state";
import { createPendingSession } from "@/lib/session";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  const cookieStore = await cookies();
  const expectedState = cookieStore.get(STATE_COOKIE)?.value;
  cookieStore.delete(STATE_COOKIE);

  if (!code || !state || !expectedState || state !== expectedState) {
    return NextResponse.redirect(new URL("/admin/login?error=invalid_state", request.url));
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  const ownerId = process.env.GITHUB_OWNER_ID;

  if (!clientId || !clientSecret || !ownerId) {
    return new Response("Missing GitHub OAuth env vars", { status: 500 });
  }

  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: new URL("/api/auth/callback/github", request.url).toString(),
    }),
  });

  if (!tokenRes.ok) {
    return NextResponse.redirect(new URL("/admin/login?error=token_exchange_failed", request.url));
  }

  const tokenData = await tokenRes.json();
  const accessToken = tokenData.access_token as string | undefined;

  if (!accessToken) {
    return NextResponse.redirect(new URL("/admin/login?error=no_access_token", request.url));
  }

  const userRes = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github+json",
    },
  });

  if (!userRes.ok) {
    return NextResponse.redirect(new URL("/admin/login?error=github_user_fetch_failed", request.url));
  }

  const githubUser = (await userRes.json()) as { id: number };

  if (String(githubUser.id) !== ownerId) {
    return NextResponse.redirect(new URL("/admin/login?error=not_owner", request.url));
  }

  await createPendingSession(githubUser.id);

  return NextResponse.redirect(new URL("/admin/verify-totp", request.url));
}
