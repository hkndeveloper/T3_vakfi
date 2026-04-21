import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/giris",
  },
  providers: [
    CredentialsProvider({
      name: "Email ve Sifre",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Sifre", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
          include: {
            userRoles: {
              include: {
                role: {
                  include: {
                    permission: {
                      include: {
                        permission: true,
                      },
                    },
                  },
                },
                community: true,
              },
            },
          },
        });

        if (!user || !user.isActive) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash,
        );

        if (!isPasswordValid) {
          return null;
        }

        const roles = user.userRoles.map((item) => item.role.code);
        const permissions = [...new Set(
          user.userRoles.flatMap((item) =>
            item.role.permission.map((rolePermission) => rolePermission.permission.code),
          ),
        )];

        const communityIds = user.userRoles
          .map((item) => item.communityId)
          .filter((value): value is string => Boolean(value));

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          roles,
          permissions,
          communityIds,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.roles = user.roles;
        token.permissions = user.permissions;
        token.communityIds = user.communityIds;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string;
        session.user.roles = (token.roles as string[]) ?? [];
        session.user.permissions = (token.permissions as string[]) ?? [];
        session.user.communityIds = (token.communityIds as string[]) ?? [];
      }

      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
};
