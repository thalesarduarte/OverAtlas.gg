import NextAuth from "next-auth";
import { CredentialsSignin } from "next-auth";
import type { NextAuthConfig } from "next-auth";
import BattleNet from "next-auth/providers/battlenet";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const loginSchema = z.object({
  email: z.string().trim().email().transform((value) => value.toLowerCase()),
  password: z.string().min(6)
});

class UserNotFoundError extends CredentialsSignin {
  code = "user_not_found";
}

class InvalidPasswordError extends CredentialsSignin {
  code = "invalid_password";
}

const providers: NonNullable<NextAuthConfig["providers"]> = [
  Credentials({
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" }
    },
    authorize: async (credentials) => {
      const parsed = loginSchema.safeParse(credentials);

      if (!parsed.success) {
        throw new CredentialsSignin();
      }

      const user = await prisma.user.findUnique({
        where: { email: parsed.data.email }
      });

      if (!user) {
        throw new UserNotFoundError();
      }

      if (!user.password) {
        throw new InvalidPasswordError();
      }

      const isValid = await bcrypt.compare(parsed.data.password, user.password);
      if (!isValid) {
        throw new InvalidPasswordError();
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name ?? undefined,
        image: user.image ?? undefined
      };
    }
  })
];

if (process.env.AUTH_BATTLENET_ID && process.env.AUTH_BATTLENET_SECRET) {
  providers.push(
    BattleNet({
      clientId: process.env.AUTH_BATTLENET_ID,
      clientSecret: process.env.AUTH_BATTLENET_SECRET,
      issuer: "https://oauth.battle.net"
    })
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  trustHost: true,
  providers,
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.email = user.email;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }

      if (session.user && typeof token.email === "string") {
        session.user.email = token.email;
      }

      return session;
    }
  },
  pages: {
    signIn: "/login"
  }
});
