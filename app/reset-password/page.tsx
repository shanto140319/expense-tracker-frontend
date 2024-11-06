"use client"

import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import Link from "next/link"
import {useRouter, useSearchParams} from "next/navigation"
import {useState} from "react"
import toast from "react-hot-toast"

export default function LoginForm() {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get("token")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            toast.error("Passwords do not match.")
            return
        }
        const toastId = toast.loading("Please wait...")

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/user/reset-password`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        resetToken: token,
                        newPassword: password,
                    }),
                }
            )

            const data = await response.json()
            if (data.error) {
                toast.error(data.message, {
                    id: toastId,
                })
            } else {
                toast.success("Success", {
                    id: toastId,
                })
                router.push("/login")
            }
        } catch (error) {
            console.error("Error:", error)
            toast.error("Something went wrong", {
                id: toastId,
            })
        }
    }

    return (
        <form onSubmit={handleSubmit} className='space-y-6 w-full mt-10'>
            <h2 className='text-2xl font-bold'>Reset Password</h2>

            <div className='space-y-2'>
                <Label htmlFor='password'> New Password</Label>
                <Input
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <div className='space-y-2'>
                <Label htmlFor='password'> Confirm Password</Label>
                <Input
                    type='password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
