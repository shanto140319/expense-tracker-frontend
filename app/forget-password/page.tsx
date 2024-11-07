"use client"

import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import Link from "next/link"
import {ChangeEvent, FormEvent, useState} from "react"
import toast from "react-hot-toast"

export default function LoginForm() {
    const [email, setEmail] = useState("")

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {value} = e.target
        setEmail(value)
    }

    const validateForm = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (validateForm()) {
            const toastId = toast.loading("Please wait...")
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/user/forget/${email}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                )
                const data = await response.json()

                if (data.error) {
                    toast.error("Email not found", {
                        id: toastId,
                    })
                } else {
                    toast.success("Please check your email", {
                        id: toastId,
                    })
                }
            } catch (error) {
                console.error("Error:", error)
                toast.error("Something went wrong", {
                    id: toastId,
                })
            }
        } else {
            toast.error("Please enter valid email")
        }
    }

    return (
        <form onSubmit={handleSubmit} className='space-y-6 w-full mt-10'>
            <h2 className='text-2xl font-bold'>Forgot Password</h2>

            <div className='space-y-2'>
                <Label htmlFor='email'>email</Label>
                <Input
                    type='email'
                    id='email'
                    name='email'
                    value={email}
                    onChange={handleInputChange}
                />
            </div>

            <Button type='submit' className='w-full'>
                Submit
            </Button>

            <p className='mt-5 text-center'>
                <Link href='/login' className='ml-2 underline'>
                    Login
                </Link>
            </p>
        </form>
    )
}
