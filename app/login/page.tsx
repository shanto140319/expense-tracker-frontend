"use client"

import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {AlertCircle} from "lucide-react"
import Link from "next/link"
import {useRouter} from "next/navigation"
import {ChangeEvent, FormEvent, useState} from "react"
import toast from "react-hot-toast"

interface FormData {
    userName: string
    password: string
}

interface FormErrors {
    userName?: string
    password?: string
}

export default function LoginForm() {
    const router = useRouter()
    const [formData, setFormData] = useState<FormData>({
        userName: "",
        password: "",
    })

    const [errors, setErrors] = useState<FormErrors>({})

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target
        setFormData((prev) => ({...prev, [name]: value}))
    }

    const validateForm = () => {
        const newErrors: FormErrors = {}
        if (!formData.userName) newErrors.userName = "Username is required"
        if (!formData.password) newErrors.password = "Password is required"
        else if (formData.password.length < 8)
            newErrors.password = "Password must be at least 8 characters"
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (validateForm()) {
            try {
                const toastId = toast.loading("Please wait...")

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(formData),
                    }
                )

                if (!response.ok) {
                    toast.error("Invalid credential", {
                        id: toastId,
                    })
                    throw new Error("Failed to create account")
                }
                toast.success("Success", {
                    id: toastId,
                })
                const data = await response.json()
                localStorage.setItem("access_token", data.access_token)
                localStorage.setItem("refresh_token", data.refresh_token)
                router.push("/")
            } catch (error) {
                console.error("Error:", error)
                setErrors((prev) => ({
                    ...prev,
                    submit: "Account creation failed",
                }))
            }
        }
    }

    return (
        <form onSubmit={handleSubmit} className='space-y-6 w-full mt-10'>
            <h2 className='text-2xl font-bold'>Login</h2>

            <div className='space-y-2'>
                <Label htmlFor='username'>Username or email</Label>
                <Input
                    type='text'
                    id='userName'
                    name='userName'
                    value={formData.userName}
                    onChange={handleInputChange}
                />
                {errors.userName && (
                    <p className='text-sm text-red-500 flex items-center gap-1'>
                        <AlertCircle size={16} /> {errors.userName}
                    </p>
                )}
            </div>

            <div className='space-y-2'>
                <Label htmlFor='password'>Password</Label>
                <Input
                    type='password'
                    id='password'
                    name='password'
                    value={formData.password}
                    onChange={handleInputChange}
                />
                {errors.password && (
                    <p className='text-sm text-red-500 flex items-center gap-1'>
                        <AlertCircle size={16} /> {errors.password}
                    </p>
                )}
            </div>

            <Button type='submit' className='w-full'>
                Login
            </Button>

            <p className='mt-5 text-center'>
                Want to create account?{" "}
                <Link href='/signup' className='ml-2 underline'>
                    Sign Up
                </Link>
            </p>
            <p className='mt-5 text-center'>
                Forgot password?
                <Link href='/forget-password' className='ml-2 underline'>
                    Reset
                </Link>
            </p>
        </form>
    )
}
