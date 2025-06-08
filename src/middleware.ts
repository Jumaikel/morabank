import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const TOKEN_COOKIE = "auth-token";

const PUBLIC_PATHS = [
  "/login",
  "/api/auth",
  "/api/sinpe-movil-transfer",
  "/api/sinpe-transfer",
  "/api/sse",
  "/favicon.ico",
  "/_next",
  "/static",
];

// Helper para saber si la ruta es pública
function isPublic(path: string) {
  if (path.startsWith("/api/auth")) return true;
  if (path.startsWith("/api/sinpe-movil-transfer")) return true;
  if (path.startsWith("/api/sinpe-transfer")) return true;
  if (path.startsWith("/api/sse")) return true;
  return PUBLIC_PATHS.some((pub) => path === pub || path.startsWith(pub + "/"));
}

// Usaremos "*" para permitir cualquier origen
const ALLOWED_ORIGIN = "*";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const method = req.method;

  // —— 1) Manejo de CORS para /api/* —— 
  if (pathname.startsWith("/api/")) {
    // Preflight CORS (OPTIONS)
    if (method === "OPTIONS") {
      return new NextResponse(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
          "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type,Authorization",
        },
      });
    }
    // En peticiones normales, dejaremos que el flujo continúe y añadiremos el header más abajo.
  }

  // —— 2) Rutas públicas —— 
  if (isPublic(pathname)) {
    const res = NextResponse.next();
    if (pathname.startsWith("/api/")) {
      res.headers.set("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
    }
    return res;
  }

  // —— 3) Rutas protegidas: /internet-banking y /api (menos /api/auth) —— 
  const mustProtect =
    pathname.startsWith("/internet-banking") ||
    (pathname.startsWith("/api") && !pathname.startsWith("/api/auth"));

  if (mustProtect) {
    const token = req.cookies.get(TOKEN_COOKIE)?.value || null;
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
      await jwtVerify(token, secret);
      const res = NextResponse.next();
      // Si es llamada a /api/* protegida, también agregamos CORS
      if (pathname.startsWith("/api/")) {
        res.headers.set("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
      }
      return res;
    } catch {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  // —— 4) Resto de rutas no dentro de /internet-banking ni /api —— 
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/internet-banking/:path*",
    "/internet-banking",
    "/api/:path*", // Aplica middleware a todo /api/*
  ],
};
