"use server"

import {prisma} from '@/app/lib/prisma';
import { User } from "@prisma/client";

import path from "path";

export async function getUserByEmail(email: string | null): Promise<User | null>  {
    if(!email) {null}
    const user = await prisma.user.findFirst({
        where:{email:email},
    });
    return user;
}



