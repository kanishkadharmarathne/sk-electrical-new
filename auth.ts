import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { UserRepository } from "./lib/typeorm/repositories/userRepository";
import "reflect-metadata";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
    params: {
      prompt: "select_account", // Forces account selection every time
    }
  }
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false;

      try {
        // Check if user exists
        let dbUser = await UserRepository.findByEmail(user.email);

        if (!dbUser) {
          // Create new user
          dbUser = await UserRepository.createUser({
            email: user.email,
            name: user.name || undefined,
            image: user.image || undefined,
            googleId: account?.providerAccountId,
            emailVerified: true,
          });
          console.log("✅ New user created:", dbUser.email);
        } else {
          // Update existing user info
          await UserRepository.updateUser(dbUser.id, {
            name: user.name || dbUser.name,
            image: user.image || dbUser.image,
            googleId: account?.providerAccountId || dbUser.googleId,
          });
          console.log("✅ User updated:", dbUser.email);
        }

        return true;
      } catch (error) {
        console.error("❌ Error in signIn callback:", error);
        return false;
      }
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
});