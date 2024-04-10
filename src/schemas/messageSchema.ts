import {z} from "zod"

export const MessageSchema = z.object({
    content : z
        .string()
        .min(10, {message: "Content must be at least 10 character"})
        .max(10, {message: "Content must be at least 10 character"})
    

})