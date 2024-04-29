import getServerSession from "next-auth"
import { authOptions } from "../auth/[...nextauth]/options"
import db from "@/lib/db"
import UserModel from "@/models/User"
import { User } from "next-auth"

export async function POST(request: Request) {
    await db()
    const session = await getServerSession(authOptions)
    const user: User = session?.user
    if(!session || !session.user){
        return Response.json({
            success: false,
            message: "You need to be logged in to accept a message"
        },{status: 401})
    }

    const userId = user._id
    const {acceptMessages} = await request.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId, {isAcceptingMessage: acceptMessages},{new: true})
        if(!updatedUser){
            return Response.json({
                success: false,
                message: "Failed to update user status to accept messages"
            },{status: 401})
        }
        return Response.json({
            success: true,
            message: "User status updated to accept messages",
            updatedUser
        },{status: 200})
        
    } catch (error:any) {
        console.log("Failed to update user status to accept messages", error)
        return Response.json({
            success: false,
            message: "Failed to update user status to accept messages"
        },{status: 500})
    }
}

export async function GET(request: Request) {
    await db()
    const session = await getServerSession(authOptions)
    const user:User = session?.user
    if(!session || !session.user){
        return Response.json({
            success: false,
            message: "You need to be logged in to get user status"
        },{status: 401})
    }

    const userId = user._id
   try {
    const foundUser = await UserModel.findById(userId)
    if(!foundUser){
        return Response.json({
            success: false,
            message: "User not found"
        },{status: 404})
    }
    return Response.json({
        success: true,
        message: "User status found",
        isAcceptionMessage: foundUser.isAcceptingMessage,
        user: foundUser
    },{status: 200})
   } catch (error:any) {
         console.log("Failed to get user status", error)
         return Response.json({
              success: false,
              message: "Error getting user status message acceptance"
         },{status: 500})
   }
}