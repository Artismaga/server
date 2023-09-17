import { NextRequest } from "next/server";
import { CATCH_GET, CATCH_DELETE, CATCH_PATCH, CATCH_POST, CATCH_PUT } from "@/app/api/catch-all";

const VERSION = 'v1';

export async function GET(request: NextRequest, { params }: { params: { slug: string[] } }) {
    return await CATCH_GET(request, { params: { slug: [VERSION, ...params.slug]} });
}

export async function DELETE(request: NextRequest, { params }: { params: { slug: string[] } }) {
    return await CATCH_DELETE(request, { params: { slug: [VERSION, ...params.slug]} });
}

export async function PATCH(request: NextRequest, { params }: { params: { slug: string[] } }) {
    return await CATCH_PATCH(request, { params: { slug: [VERSION, ...params.slug]} });
}

export async function POST(request: NextRequest, { params }: { params: { slug: string[] } }) {
    return await CATCH_POST(request, { params: { slug: [VERSION, ...params.slug]} });
}

export async function PUT(request: NextRequest, { params }: { params: { slug: string[] } }) {
    return await CATCH_PUT(request, { params: { slug: [VERSION, ...params.slug]} });
}