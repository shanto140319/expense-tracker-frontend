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
    email: string
    password: string
}

interface FormErrors {
    userName?: string
    email?: string
    password?: string
    confirmPassword?: string
}

export default function CreateAccountForm() {
    const router = useRouter()
    const [formData, setFormData] = useState<FormData>({
        userName: "",
        email: "",
        password: "",
    })

    const [errors, setErrors] = useState<FormErrors>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [confirmPassword, setConfirmPassword] = useState("")

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target
        setFormData((prev) => ({...prev, [name]: value}))
    }

    const validateForm = () => {
        const newErrors: FormErrors = {}
        if (!formData.userName) newErrors.userName = "Username is required"
        if (!formData.email) newErrors.email = "Email number is required"
        if (!formData.password) newErrors.password = "Password is required"
        if (formData.password.length < 8)
            newErrors.password = "Password must be at least 8 characters"
        if (formData.password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords are not equal"
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (validateForm()) {
            setIsSubmitting(true)
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/user/create`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(formData),
                    }
                )

                if (!response.ok) {
                    const data = await response.json()
                    toast.error(data.message)
                    throw new Error("Failed to create account")
                }

                router.push("/login")
            } catch (error) {
                console.error("Error:", error)
                setErrors((prev) => ({
                    ...prev,
                    submit: "Account creation failed",
                }))
            } finally {
                setIsSubmitting(false)
            }
        }
    }

    return (
        <form onSubmit={handleSubmit} className='space-y-6 w-full mt-10'>
            <h2 className='text-2xl font-bold'>Create Account</h2>

            <div className='space-y-2'>
                <Label htmlFor='username'>Username</Label>
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
                <Label htmlFor='email'>Email</Label>
                <Input
                    type='email'
                    id='email'
                    name='email'
                    value={formData.email}
                    onChange={handleInputChange}
                />
                {errors.email && (
                    <p className='text-sm text-red-500 flex items-center gap-1'>
                        <AlertCircle size={16} /> {errors.email}
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
            <div className='space-y-2'>
                <Label htmlFor='password'>Confirm password</Label>
                <Input
                    type='password'
                    id='password'
                    name='password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {errors.confirmPassword && (
                    <p className='text-sm text-red-500 flex items-center gap-1'>
                        <AlertCircle size={16} /> {errors.confirmPassword}
                    </p>
                )}
            </div>

            <Button type='submit' className='w-full' disabled={isSubmitting}>
                {isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>

            <p className='mt-5 text-center'>
                Already have an account?{" "}
                <Link href='/login' className='ml-2 underline'>
                    Login
                </Link>
            </p>
        </form>
    )
}
