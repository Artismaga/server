import prisma from "@/database/prisma";
import { genSalt, hash } from "bcrypt-ts";
import { NextRequest, NextResponse } from "next/server";
import validatePassword from "@/helpers/validatePassword";
import scanProfanity from "@/helpers/profanityCheck";

async function checkAvailability(email: string = "", name: string = "") {
    if (email.length > 0) {
        const emailUser = await prisma.user.findFirst({
            where: {
                email: email,
            }
        })
    
        if (emailUser) {
            return {
                available: false,
                message: 'Email already exists',
                field: 'email',
            }
        }
    }

    if (name.length > 0) {
        if (name.length > 30) {
            return {
                available: false,
                message: 'Username too long',
                field: 'name',
            }
        }
        if (name.match(/\s/)) {
            return {
                available: false,
                message: 'Username contains spaces',
                field: 'name',
            }
        }
        if (name.match(/[^\p{L}\-_\p{N}]+/u)) {
            return {
                available: false,
                message: 'Username contains invalid characters',
                field: 'name',
            }
        }
        if (name.match(/^[\-_]|[\-_]$/)) {
            return {
                available: false,
                message: 'Username cannot start or end with a - or _',
                field: 'name',
            }
        }
        if (scanProfanity(name)) {
            return {
                available: false,
                message: 'Username contains profanity',
                field: 'name',
            }
        }

        const nameUser = await prisma.user.findFirst({
            where: {
                name: name,
                domain: "",
            }
        });
    
        if (nameUser) {
            let suggestedUsername;
            for (let i = 0; i < 10; i++) {
                suggestedUsername = `${name}-${Math.random() * (800 - 50) + 50}`;
                const nameUser = await prisma.user.findFirst({
                    where: {
                        name: suggestedUsername,
                        domain: "",
                    }
                });
    
                if (!nameUser) {
                    break;
                }
            }
    
            if (suggestedUsername) {
                return {
                    available: false,
                    message: 'Username already exists',
                    suggestedName: suggestedUsername,
                }
            }
        }
    }

    return {
        available: true,
    }
}

function isValidEmail(email: string) {
    const re = /^\S+@\S+$/;
    return re.test(email.toLowerCase());
}

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const email = url.searchParams.get('email') || undefined;
    const name = url.searchParams.get('name') || undefined;

    if (!email && !name) {
        return NextResponse.json({
            message: 'Missing fields',
            fields: [!email && 'email', !name && 'name'],
        }, {
            status: 400,
        });
    }

    const availability = await checkAvailability(email, name);

    return NextResponse.json(availability, {
        status: 200,
    });
}

export async function POST(request: NextRequest) {
    const { email, name, password } = await request.json();

    if (!email || !name || !password) {
        return NextResponse.json({
            message: 'Missing fields',
            fields: [!email && 'email', !name && 'name', !password || 'password'],
        }, {
            status: 400,
        });
    }

    if (!isValidEmail(email)) {
        return NextResponse.json({
            message: 'Invalid email',
            field: 'email',
        }, {
            status: 400,
        });
    }

    if (!validatePassword(password)) {
        return NextResponse.json({
            message: 'Insecure password',
            field: 'password',
        }, {
            status: 400,
        });
    }

    const availability = await checkAvailability(email, name);

    if (availability.available) {
        const salt = await genSalt(Number(process.env?.SALT_ROUNDS) || 16);
        const hashedPassword = await hash(password, salt);

        const user = await prisma.user.create({
            data: {
                id: name,
                email: email,
                name: name,
                password: hashedPassword,
            }
        });

        return new NextResponse(null, {
            status: 201,
        })
    } else {
        if (availability.suggestedName) {
            return NextResponse.json({
                message: 'Username already exists',
                field: 'name',
                suggestedName: availability.suggestedName,
            }, {
                status: 400,
            });
        } else {
            return NextResponse.json({
                message: availability.message,
                field: availability.field,
            }, {
                status: 400,
            });
        }
    }
}
