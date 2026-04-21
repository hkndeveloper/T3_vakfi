import auth from "next-auth/middleware";

export default function proxy(...args: Parameters<typeof auth>) {
  return auth(...args);
}

export const config = {
  matcher: ["/admin/:path*", "/baskan/:path*", "/api/private/:path*"],
};
