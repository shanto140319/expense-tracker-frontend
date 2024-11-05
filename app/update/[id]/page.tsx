"use client"

import AddCategoryModal from "@/app/components/AddCategoryModal"
import Categories from "@/app/components/Categories"
import useFetch from "@/app/customHooks/useFetch"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Textarea} from "@/components/ui/textarea"
import api from "@/lib/api"
import {Transaction} from "@/lib/types"
import Link from "next/link"
import {usePathname, useRouter, useSearchParams} from "next/navigation"
import {useEffect, useState} from "react"
import toast from "react-hot-toast"

const Page = ({params}: {params: {id: string}}) => {
    const searchParams = useSearchParams()
    const pathName = usePathname()
    console.log("pathname", pathName)
    const router = useRouter()
    const paramValue = searchParams.get("type")
    const [isOpen, setIsOpen] = useState(false)
    const [addCategorySuccess, setAddCategorySuccess] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<number>(0)
    const {data, loading, error} = useFetch<Transaction>(
        `${process.env.NEXT_PUBLIC_API_URL}/transaction/get/${params.id}`
    )

    const [transaction, setTransaction] = useState({
        amount: 0,
        description: "",
    })

    useEffect(() => {
        setTransaction({
            ...transaction,
            amount: Number(data?.amount),
            description: data?.description || "",
        })
        setSelectedCategory(data?.categoryId || 0)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const {id, value} = e.target
        setTransaction((prev) => ({
            ...prev,
            [id]: id === "amount" ? parseFloat(value) : value,
        }))
    }

    const handleUpdate = () => {
        if (transaction.amount <= 0) {
            toast.error("Amount must be greater than zero")
            return
        }
        if (!selectedCategory) {
            toast.error("Please select a category")
            return
        }
        const toastId = toast.loading("Adding category...")
        api.put(
            `${process.env.NEXT_PUBLIC_API_URL}/transaction/update/${params.id}`,
            transaction
        )
            .then((res) => {
                toast.success("Transaction added successfully!", {
                    id: toastId,
                })
                console.log(res)
                router.push("/")
            })
            .catch((err) => {
                toast.error("Failed to add Transaction. Please try again.", {
                    id: toastId,
                })
                console.log(err)
            })
    }

    if (!paramValue) {
        router.push("/")
        return
    }

    if (loading) return <h2>Loading...</h2>
    if (error) return <h2>Something Went wrong</h2>
    return (
        <section className='grid w-full mt-10 gap-5'>
            <Link href={"/"}>
                <Button>Back to home</Button>
            </Link>
            <div className='grid gap-1.5'>
                <Label htmlFor='amount'>Amount</Label>
                <Input
                    type='number'
                    id='amount'
                    placeholder='Enter amount'
                    value={transaction.amount}
                    onChange={handleChange}
                    min='0'
                />
            </div>
            <div className='grid gap-1.5'>
                <Label htmlFor='description'>Description</Label>
                <Textarea
                    placeholder='Enter description'
                    id='description'
                    value={transaction.description}
                    onChange={handleChange}
                />
            </div>
            <div className='grid gap-1.5'>
                <Label htmlFor='category' className='flex flex-col gap-5'>
                    Categories:{" "}
                </Label>
                <Categories
                    addCategorySuccess={addCategorySuccess}
                    selectedCategory={selectedCategory}
                    setSelectedcategory={setSelectedCategory}
                    transactionType={paramValue}
                    disabled={pathName.split("/")[1] === "update"}
                />
            </div>

            <AddCategoryModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                setAddCategorySuccess={setAddCategorySuccess}
                transactionType={paramValue}
            />

            <Button className='mt-5' onClick={handleUpdate}>
                Add {paramValue}
            </Button>
        </section>
    )
}

export default Page
