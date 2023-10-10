import prisma from "@/database/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function authenticatePage(require: boolean = false) {
    const session = await getServerSession(authOptions);

    if (!session && require) {
        redirect(`${process.env.NEXTAUTH_URL}/login`);
    }

    return session;
}
