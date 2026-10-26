import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Sharp's optional native shared libraries are loaded dynamically and can be
  // omitted by tracing (confirmed on Windows). Ship the complete native package.
  outputFileTracingIncludes: {
    "/*": ["./node_modules/sharp/**/*", "./node_modules/@img/**/*"],
  },
  poweredByHeader: false,
  images: {
    localPatterns: [{ pathname: "/images/**", search: "" }],
    remotePatterns: [],
    maximumRedirects: 0,
    maximumResponseBody: 5_000_000,
  },
  async headers() {
    const isDev = process.env.NODE_ENV === "development";
    // Retain static rendering. Inline bootstrap/style support is required by
    // this App Router build; nonce-based CSP would make all pages dynamic.
    const csp = [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self'",
      `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join("; ");
    return [{ source: "/:path*", headers: [
      { key: "Content-Security-Policy", value: csp },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      { key: "X-Robots-Tag", value: "noindex, nofollow" },
      ...(!isDev ? [{ key: "Strict-Transport-Security", value: "max-age=31536000" }] : []),
    ] }, { source: "/images/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=86400, must-revalidate" }] }];
  }
};
export default nextConfig;


