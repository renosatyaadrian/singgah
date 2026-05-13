import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account?.id_token) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken: account.id_token }),
            credentials: "include",
          });
          if (res.ok) {
            const user = await res.json();
            token.appUser = user;
          }
        } catch {
          // silently fail — token will be missing appUser
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token.appUser) {
        session.user = token.appUser as typeof session.user;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
