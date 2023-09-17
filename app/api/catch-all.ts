import { NextRequest, NextResponse } from "next/server";
import { VERSIONS } from "./api-info";
import path from "path";
import fs from "fs";

// Reroutes API requests from newer versions to their latest old version route
// if the version does not offer a new version of that route

const apiDir = path.resolve(`${__dirname}/../..`);
var apiRoutes: { [version: string]: string[] } = {};

var walk = function(dir: string) {
    var results: string[] = [];
    var list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        var stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            /* Recurse into a subdirectory */
            results = results.concat(walk(file));
        } else { 
            /* Is a file */
            results.push(file);
        }
    });
    return results;
}

for (const version of VERSIONS) {
    apiRoutes[version] = []
    const versionDir = path.resolve(`${apiDir}/${version}`);

    // Get all folders with a route.ts file
    const routes = walk(versionDir);
    for (const _route of routes) {
        const route: string = _route;
        if (route.endsWith("route.js")) {
            const routeName = route.replace("/route.js", "");
            const routeFullPath = `${routeName}`
                .replace(/\[+[\w\d\-_.]+\]+/, "*") // Transform dynamic routes into asterisks
                .replace(/\/\([\w\d\-_.]+\)/, ''); // Remove route groups from path
            const routePath = routeFullPath.split("/api/")[1];
            apiRoutes[version].push(routePath);
        }
    }
}

function getVersionsBefore(version: string) {
    const versions = [...VERSIONS];
    const index = versions.indexOf(version);
    return versions.slice(0, index).reverse();
}

export async function CATCH_GET(request: NextRequest, { params }: { params: { slug: string[] } }) {
    const [version, ...path] = params.slug;

    if (!VERSIONS.includes(version)) {
        return new NextResponse(null, { status: 400 });
    }

    let route = null;
    for (const _version of getVersionsBefore(version)) {
        for (const _route of apiRoutes[_version]) {
            if (`${_version}/${path.join("/")}` === _route) {
                route = _route;
                break;
            }
        }
    }

    if (route) {
        const newRequest: NextRequest = new NextRequest(`${request.nextUrl.origin}/api/${route}`, request);
        return await fetch(newRequest);
    }
    return new NextResponse(null, { status: 400 });
}

export async function CATCH_POST(request: NextRequest, { params }: { params: { slug: string[] } }) {
    const [version, ...path] = params.slug;

    if (!VERSIONS.includes(version)) {
        return new NextResponse(null, { status: 400 });
    }

    let route = null;
    for (const _version of getVersionsBefore(version)) {
        for (const _route of apiRoutes[_version]) {
            if (`${_version}/${path.join("/")}` === _route) {
                route = _route;
                break;
            }
        }
    }

    if (route) {
        const newRequest: NextRequest = new NextRequest(`${request.nextUrl.origin}/api/${route}`, request);
        return await fetch(newRequest);
    }
    return new NextResponse(null, { status: 400 });
}

export async function CATCH_PATCH(request: NextRequest, { params }: { params: { slug: string[] } }) {
    const [version, ...path] = params.slug;

    if (!VERSIONS.includes(version)) {
        return new NextResponse(null, { status: 400 });
    }

    let route = null;
    for (const _version of getVersionsBefore(version)) {
        for (const _route of apiRoutes[_version]) {
            if (`${_version}/${path.join("/")}` === _route) {
                route = _route;
                break;
            }
        }
    }

    if (route) {
        const newRequest: NextRequest = new NextRequest(`${request.nextUrl.origin}/api/${route}`, request);
        return await fetch(newRequest);
    }
    return new NextResponse(null, { status: 400 });
}

export async function CATCH_DELETE(request: NextRequest, { params }: { params: { slug: string[] } }) {
    const [version, ...path] = params.slug;

    if (!VERSIONS.includes(version)) {
        return new NextResponse(null, { status: 400 });
    }

    let route = null;
    for (const _version of getVersionsBefore(version)) {
        for (const _route of apiRoutes[_version]) {
            if (`${_version}/${path.join("/")}` === _route) {
                route = _route;
                break;
            }
        }
    }

    if (route) {
        const newRequest: NextRequest = new NextRequest(`${request.nextUrl.origin}/api/${route}`, request);
        return await fetch(newRequest);
    }
    return new NextResponse(null, { status: 400 });
}

export async function CATCH_PUT(request: NextRequest, { params }: { params: { slug: string[] } }) {
    const [version, ...path] = params.slug;

    if (!VERSIONS.includes(version)) {
        return new NextResponse(null, { status: 400 });
    }

    let route = null;
    for (const _version of getVersionsBefore(version)) {
        for (const _route of apiRoutes[_version]) {
            if (`${_version}/${path.join("/")}` === _route) {
                route = _route;
                break;
            }
        }
    }

    if (route) {
        const newRequest: NextRequest = new NextRequest(`${request.nextUrl.origin}/api/${route}`, request);
        return await fetch(newRequest);
    }
    return new NextResponse(null, { status: 400 });
}