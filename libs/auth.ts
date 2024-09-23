import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],

  callbacks: {
    authorized({ auth, request }) {
      console.log("auth callback", auth);
      return !!auth?.user;
    },
    async signIn({ user, account, profile }) {
      console.log("user", user);
      try {
        return true;
      } catch {
        return false;
      }
    },
    // async session({ session, user }) {
    //   return session;
    // },
  },
  pages: {
    signIn: "/",
  },
});
