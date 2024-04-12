import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import db from "@/lib/db";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server";


export async function POST(request: Request) {
    await db()

    try {
        const {username, email, password} = await request.json()
        await UserModel.findOne({email: email})
       
    } catch (error) {
        console.error("Error registering user", error)
        return NextResponse.json({
            success: false,
            message: "Error registering user"
        },
        {
            status: 500
        }
        )
    }
}