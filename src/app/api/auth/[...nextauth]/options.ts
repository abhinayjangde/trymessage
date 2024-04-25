import Credentials from "@auth/core/providers/credentials"
import bcrypt from "bcryptjs"
import db from "@/lib/db"
import UserModel from "@/models/User"

export const authOptions:any = {
    providers: [
        Credentials({
            id: "credentials",
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },

            async authorize(credentials: any): Promise<any> {
                await db()
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier },
                        ]
                    })

                    if (!user) {
                        throw new Error("No user found with this email.")
                    }
                    if (!user.isVerified) {
                        throw new Error("Please verify your account first before login.")
                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)
                    if (isPasswordCorrect) {
                        return user
                    }
                    else {
                        throw new Error("Incorrect credentials.")
                    }
                } catch (error: any) {
                    throw new Error(error)
                }

            }
        })
    ],
    callbacks: {
        async jwt({ token, user }: any) {
            if (user) {
                token._id = user._id?.toString()
                token.isVerified = user.isVerified
                token.isAcceptingMessage = user.isAcceptingMessage
                token.username = user.username
            }
            return token
        },
        async session({ session, token }: any) {
            if (token) {
                session.user._id = token._id
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessage = token.isAcceptingMessage
                session.user.username = token.username
            }
            return session
        }
    },
    pages: {
        singIn: "/singin"
    },
    session: {
        strategy: "jwt"
    },
    secrets: process.env.AUTH_SECRET
}

