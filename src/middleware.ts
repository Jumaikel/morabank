import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const TOKEN_COOKIE = "auth-token";

const PUBLIC_PATHS = [
  "/login",
  "/api/auth",       // Solo este endpoint API es público
  "/api/auth/",      // Soporta /api/auth/
  "/favicon.ico",
  "/_next",
  "/static",
];

// Helper para saber si la ruta es pública
function isPublic(path: string) {
  // Permite todas las subrutas de /api/auth, por ejemplo: /api/auth/login, /api/auth/verify-mfa
  if (path.startsWith("/api/auth")) return true;
  return PUBLIC_PATHS.some((pub) => path === pub);
}

// Middleware principal
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Permitir acceso libre a rutas públicas
  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  // Protege todas las rutas de /internet-banking y /api (menos /api/auth)
  if (
    pathname.startsWith("/internet-banking") ||
    (pathname.startsWith("/api") && !pathname.startsWith("/api/auth"))
  ) {
    const token = req.cookies.get(TOKEN_COOKIE)?.value || null;

    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch (err) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/internet-banking/:path*",
    "/internet-banking",
    "/api/:path*", // Protege /api, pero permite /api/auth
  ],
};
