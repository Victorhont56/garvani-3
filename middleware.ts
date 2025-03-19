import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes:['/','/view-listing/:path*', '/sign-up', '/sign-in']});

export const config = {
  matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

