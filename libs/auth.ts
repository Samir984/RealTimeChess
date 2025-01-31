import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],

  callbacks: {
    authorized({ auth }) {
      console.log("auth callback", auth);
      return !!auth?.user;
    },
    async signIn({ user }) {
      console.log("signin callback", user);

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/users/register/",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.MANAGER_AUTH_TOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: user.email,
              first_name: user.name?.split(" ")[0],
              last_name: user.name?.split(" ")[1] || "",
              image: user.image,
            }),
          }
        );
        if (!response.ok) {
          console.log(response.json);
          return false;
        }
        return true;
      } catch (error) {
        console.log(error, "\n\n\n");
        return false;
      }
    },
    async jwt({ token, user }) {
      console.log("jwt callback /n/n");
      if (user) {
        const response = await fetch(
          `http://127.0.0.1:8000/api/users/?email=${user.email}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${process.env.MANAGER_AUTH_TOKEN}`,
            },
          }
        );
        if (response.ok) {
          console.log("inside ok \n\n\n\n\n\n");
          const data = await response.json();
          console.log(data);
          token.user_id = data.user_id;
        }
      }

      return token;
    },
    async session({ session, token }) {
      console.log("session callback", session, token);
      return {
        ...session,
        user: {
          ...session.user,
          user_id: token.user_id,
        },
      };
    },
  },
  pages: {
    signIn: "/",
  },
});

export const runtime = "nodejs";
