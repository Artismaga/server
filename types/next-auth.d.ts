import NextAuth from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      displayName: string;

      email: string;
      emailVerified: boolean;

      profilePicture: string;
      profileBanner: string;

      settings: {
        [key: string]: any;
      };
      mature: boolean;
      links: {
        [name: string]: any;
      };
      createdAt: Date;
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}