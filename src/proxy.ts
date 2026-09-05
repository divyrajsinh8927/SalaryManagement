import { withAuth } from "next-auth/middleware"

export default withAuth({
  pages: {
    signIn: "/",
  },
})

export const config = {
  matcher: ["/salaries/:path*", "/profile/:path*"],
}
