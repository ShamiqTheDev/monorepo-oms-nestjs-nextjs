import { withAuth } from "next-auth/middleware";

export default withAuth({
  // callbacks: {
  //   authorized: ({ req, token }) => {
  //     const PUBLIC_FILE = /\.(.*)$/;
  //     const isPublicFiles = PUBLIC_FILE.test(req.nextUrl.pathname);
  //     console.log({ isPublicFiles });
  //     return req.nextUrl.pathname === '/dashboard' || !!token;
  //   },
  // },
  // pages: {
  //   signIn: '/login',
  // },
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|images|assets|favicon.ico|logo.png|accept-invite|login|reset-password).*)"],
};
