import getServerSession from "next-auth"
import { authOptions } from "../auth/[...nextauth]/options"
import db from "@/lib/db"
import UserModel from "@/models/User"
import { User } from "next-auth"
import mongoose from "mongoose"

export async function GET(request: Request){
    await db()
    const session = await getServerSession(authOptions)
    const user: User = session?.user
    if(!session || !session.user){
        return Response.json({
            success: false,
            message: "Not authenticated to get messages"
        },{status: 401})
    }
    const userId = new mongoose.Types.ObjectId(user._id)
    try {
        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: "$messages" },
            { $sort: { "messages.createdAt": -1 } },
            { $group: {_id: "$_id", messages: { $push: "$messages" } }}
        ])

        if(!user || user.length === 0){
            return Response.json({
                success: false,
                message: "No user found"
            },{status: 404})
        }
        return Response.json({
            success: true,
            messages: user[0].messages
        },{status: 200})
    } catch (error) {
        console.log("An unexpected error occurred: ", error)
        return Response.json({
            success: false,
            message: "Error getting messages"
        },{status: 500})
    }

}