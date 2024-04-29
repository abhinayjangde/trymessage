"use client"
import React, { useState, useEffect, use } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from 'next/link'
import { useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation'
import { signUpSchema } from '@/schemas/signUpSchema'
import axios, { AxiosError } from "axios"
import { ApiResponse } from '@/types/ApiResponse'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

const Signup = () => {

  const [username, setUsername] = useState('')
  const [usernameMessage, setUsernameMessage] = useState('')
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmiting, setIsSubmiting] = useState(false)

  const debounced = useDebounceCallback(setUsername, 500)
  const { toast } = useToast()
  const router = useRouter()

  // Zod implementation 
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: ""
    }
  })

  // Check Username
  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true)
        setUsernameMessage("")
        try {
          const response = await axios.get(`/api/check-unique-username?username=${username}`)
          setUsernameMessage(response.data.message)
      } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>
          setUsernameMessage(axiosError.response?.data.message || "Error checking username")

        }
        finally {
          setIsCheckingUsername(false)
        }
      }
    }
    checkUsernameUnique()
  }, [username])


  const onSubmit = async (data : z.infer<typeof signUpSchema>)=>{
    setIsSubmiting(true)
    try {
      const response = await axios.post<ApiResponse>('/api/signup', data)
      console.log(response.data)
      toast({
        title: "Success",
        description: response.data.message
      })
      router.replace(`/verify/${username}`)
      setIsSubmiting(false)
    } catch (error) {
      console.error("Error in singup of user", error)
      const axiosError = error as AxiosError<ApiResponse>
      let errorMessage = axiosError.response?.data.message || "Error in signup"
      toast({
        title: "Signup Failed",
        description: errorMessage,
        variant: "destructive"
      })
      setIsSubmiting(false)
    }

  }
  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
        <div className="text-center">
          <h1 className='text-4xl font-bold tracking-tighter lg:text-5xl mb-6'>Join Try Message</h1>
          <p className='mb-4'>Sign up to start your anonymous adventure</p>
        </div>

        <div>
          <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                <FormField
                  name="username"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                        placeholder="username" {...field}
                        onChange={(e)=>{
                          field.onChange(e)
                          debounced(e.target.value)
                        }}
                        />
                      </FormControl>
                        {isCheckingUsername && <Loader2 className='w-4 h-4 animate-spin'/>}
                        <p className={`text-sm ${usernameMessage === "Username is available" ?'text-green-500' : 'text-red-500'}`}>{usernameMessage}</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email" {...field}/>
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                />
                <FormField
                  name="password"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type='password' placeholder="password" {...field}/>
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                />
                <Button type='submit' disabled={isSubmiting}>
                  {
                    isSubmiting ? (
                      <>
                        <Loader2 className='w-4 h-4 mr-2 animate-spin'/> Please Wait
                      </>
                    ) : ("Signup")
                  }
                </Button>
              </form>
              <div className="text-center mt-4">
                <p>
                  Already a member?{" "}
                  <Link href={'/signin'} className='text-blue-600 hover:text-blue-800'>
                    Sign In
                  </Link>
                </p>
              </div>
          </Form>


        </div>
      </div>
      
    </div>
  )
}

export default Signup