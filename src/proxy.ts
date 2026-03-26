import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";

const protectedRoutes = ["/favoritos", "/configuracoes"];
const authRoutes = ["/login", "/register"];

function isSameOriginPath(path: string | null) {
  return Boolean(path && path.startsWith("/") && !path.startsWith("//"));
}

export default auth((req) => {
  const isLoggedIn = Boolean(req.auth);
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute && !isLoggedIn) {
    const loginUrl = new URL("/login", nextUrl);
    loginUrl.searchParams.set("callbackUrl", `${pathname}${nextUrl.search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && isLoggedIn) {
    const callbackUrl = nextUrl.searchParams.get("callbackUrl");
    const redirectTo = isSameOriginPath(callbackUrl) ? callbackUrl : "/favoritos";
    return NextResponse.redirect(new URL(redirectTo ?? "/favoritos", nextUrl));
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
};
