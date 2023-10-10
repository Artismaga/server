import prisma from "@/database/prisma";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function authenticateRequest(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return null;
    }

    return session;
}
