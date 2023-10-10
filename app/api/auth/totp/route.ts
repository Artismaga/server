import prisma from "@/database/prisma";
import { NextRequest, NextResponse } from "next/server";
import authenticateRequest from "@/app/api/authenticateRequest";

export async function GET(request: NextRequest) {
    const session = await authenticateRequest(request);

    if (!session) {
        return NextResponse.json({
            error: "Not authenticated",
        }, {
            status: 401,
        });
    }

    const user = await prisma.user.findUnique({
        where: {
            email: session.user.email,
        }
    });

    if (!user) {
        return NextResponse.json({
            error: "Not authenticated",
        }, {
            status: 401,
        });
    }

    return NextResponse.json({
        enabled: user.totpSecret !== null,
    }, {
        status: 200,
    });
}