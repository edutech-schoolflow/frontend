import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";

  // On localhost / 127.0.0.1 — pass all requests through untouched.
  // The path-based routing (/school/*, /parent/*, /platform-admin/*) works
  // directly without subdomain rewriting in local development.
  const isLocal =
    host.startsWith("localhost") || host.startsWith("127.0.0.1");

  if (isLocal) {
    return NextResponse.next();
  }

  // --- Production subdomain routing ---
  const parts = host.split(".");
  const subdomain = parts.length >= 3 ? parts[0] : null;
  const pathname = request.nextUrl.pathname;
  const url = request.nextUrl.clone();

  if (subdomain === "admin") {
    url.pathname = `/platform-admin${pathname}`;
    return NextResponse.rewrite(url);
  }

  if (!subdomain || subdomain === "app" || subdomain === "www") {
    url.pathname = `/parent${pathname}`;
    return NextResponse.rewrite(url);
  }

  // School subdomain (e.g. greenfield.schoolflow.com)
  const response = NextResponse.rewrite(
    new URL(`/school${pathname}`, request.url)
  );
  response.headers.set("x-school-subdomain", subdomain);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icons|images).*)"],
};
