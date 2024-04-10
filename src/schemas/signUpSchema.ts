import {z} from "zod"

export const usernameValidation = z
    .string()
    .min(2, "Too short, username must be at least tow characters")
    .max(20, "Username must be no more than 20")
    .regex(/^[a-zA-Z0-9_]+$/,"Username must not contain special character")

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: "Invalid email address"}),
    password : z.string().min(6,{message: "Password must be atleast 6 characters"})

})