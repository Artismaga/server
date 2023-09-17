import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { PUBLIC_VERSIONS, VERSIONS } from '@/app/api/api-info';

export async function middleware(req: NextRequest) {
    const url = new URL(req.url);

    if (url.pathname.startsWith('/api/')) {
        const version = url.pathname.split('/')[2];
        if (VERSIONS.includes(version) && !PUBLIC_VERSIONS.includes(version)) {
            // TODO: Make this check permissions once database has been implemented
            return new NextResponse('Forbidden', { status: 403 });
        }
    }
}

export const config = {
    matcher: ['/:path*'],
}