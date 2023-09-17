import { NextRequest, NextResponse } from "next/server";
import { LATEST_VERSION, VERSIONS } from "@/app/api/api-info";

export async function GET(request: NextRequest) {
    return NextResponse.json({
        'version': LATEST_VERSION,
        'available_versions': VERSIONS,
    }, {
        status: 200,
    });
}