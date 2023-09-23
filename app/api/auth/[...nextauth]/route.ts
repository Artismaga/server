import type { NextAuthOptions } from "next-auth";

import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/database/prisma";
import { compare } from "bcrypt-ts";
import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { encode, decode } from 'next-auth/jwt';
import { NextApiRequest, NextApiResponse } from "next";
import { JsonObject } from "@prisma/client/runtime/library";

const adapter = PrismaAdapter(prisma);

// Helper functions to generate unique keys and calculate the expiry dates for session cookies
const generateSessionToken = () => {
    return randomUUID();
}

const fromDate = (time: number, date = Date.now()) => {
    return new Date(date + time * 1000)
}

export const authOptions: NextAuthOptions = {
    adapter: adapter,
    providers: [
        CredentialsProvider({
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials, req) {
                const email = credentials?.email;
                const password = credentials?.password;

                if (!email || !password) {
                    return null;
                }

                const user = await prisma.user.findFirst({
                    where: {
                        email: email,
                    }
                });

                if (user && !user.deletedAt && !user.deleted) {
                    const passwordMatches = await compare(password, user.password);

                    if (passwordMatches) {
                        return {
                            id: user.id,
                            displayName: user.displayName,
                            email: user.email,
                        };
                    }
                }

                return null;
            },
        })
    ],
    pages: {
        signIn: "/login",
        signOut: "/login",
        error: "/login",
        newUser: "/register",
    },
    secret: process.env.NEXTAUTH_SECRET || undefined,
    session: {
        strategy: "jwt",
        maxAge: 60 * 60 * 24 * 30,
        updateAge: 24 * 60 * 60,
    },
    callbacks: {
        async session({session, token}) {
            if (token) {
                session.user.email = token.email as string;

                const user = await prisma.user.findUnique({
                    where: {
                        email: token.email as string,
                    }
                });

                if (user) {
                    session.user.id = user.id;
                    session.user.displayName = user.displayName || user.name;
                    session.user.email = user.email as string; // We know this is present for local users
                    session.user.emailVerified = user.emailVerified != null;
                    session.user.profilePicture = user.profilePicture || "";
                    session.user.profileBanner = user.profileBanner || "";
                    session.user.settings = user.settings as JsonObject;
                    session.user.mature = user.matureProfile;
                    session.user.links = user.links as JsonObject;
                    session.user.createdAt = user.createdAt;
                }
            }

            return session;
        },
    }
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
    // clone authOptions
    const options: NextAuthOptions = {
        ...authOptions,
        callbacks: {
            async signIn({ user }) {
                if (req.query.nextauth?.includes('callback') && req.query.nextauth.includes('credentials') && req.method === 'POST') {
                    if (user) {
                        const sessionToken = generateSessionToken();
                        const sessionExpiry = fromDate(60 * 60 * 24 * 30);
                        console.log(sessionExpiry.toString());

                        await adapter.createSession?.({
                            sessionToken: sessionToken,
                            userId: user.id,
                            expires: sessionExpiry,
                        });

                        const reqCookies = cookies()

                        reqCookies.set('next-auth.session-token', sessionToken, {
                            expires: sessionExpiry,
                        });
                    }
                }

                return true;
            },

            ...authOptions.callbacks
        },

        jwt: {
            encode: async ({ token, secret, maxAge }) => {
                if (req.query.nextauth!.includes('callback') && req.query.nextauth!.includes('credentials') && req.method === 'POST') {
                    const reqCookies = cookies();
  
                    const cookie = reqCookies.get('next-auth.session-token');
  
                    if (cookie) return cookie.value; else return '';
                }
                // Revert to default behaviour when not in the credentials provider callback flow
                return encode({
                    token, secret, maxAge
                });
            },
            decode: async ({ token, secret }) => {
                if (req.query.nextauth!.includes('callback') && req.query.nextauth!.includes('credentials') && req.method === 'POST') {
                    return null
                }
  
                // Revert to default behaviour when not in the credentials provider callback flow
                return decode({
                    token, secret
                });
            }
        }
    }
    return await NextAuth(req, res, authOptions)
}

export { handler as GET, handler as POST };