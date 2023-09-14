import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const resource = url.searchParams.get('resource');

    if (resource === null) {
        return new NextResponse(null, {
            status: 400,
        });
    }

    // This route currently is not implemented
    return new NextResponse(null, {
        status: 501,
    });
}