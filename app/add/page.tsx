"use client"

import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Textarea} from "@/components/ui/textarea"
import api from "@/lib/api"
import Link from "next/link"
import {useRouter, useSearchParams} from "next/navigation"
import {useState} from "react"
import toast from "react-hot-toast"
import AddCategoryModal from "../components/AddCategoryModal"
import Categories from "../components/Categories"

const Page = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const paramValue = searchParams.get("type")
    const [isOpen, setIsOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [addCategorySuccess, setAddCategorySuccess] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<number>(0)
    const [transaction, setTransaction] = useState({
        amount: undefined,
        description: "",
    })

    if (!paramValue) {
        router.push("/")
        return
    }

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const {id, value} = e.target
        setTransaction((prev) => ({
            ...prev,
            [id]: id === "amount" ? parseFloat(value) : value,
        }))
    }

    const handleAddTransaction = () => {
        if (Number(transaction.amount) <= 0) {
            toast.error("Amount must be greater than zero")
            return
        }
        if (!selectedCategory) {
            toast.error("Please select a category")
            return
        }
        const toastId = toast.loading("Adding category...")
        api.post(`${process.env.NEXT_PUBLIC_API_URL}/transaction/create`, {
            ...transaction,
            categoryId: selectedCategory,
            type: paramValue,
        })
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
                    <div className='flex items-center gap-5 flex-wrap'>
                        <Button onClick={() => setIsOpen(true)}>
                            Create Category
                        </Button>
                        <Button onClick={() => setIsDeleteOpen(!isDeleteOpen)}>
                            {!isDeleteOpen ? "Delete Category" : "Don't Delete"}
                        </Button>
                    </div>
                </Label>
                <Categories
                    isDeleteOpen={isDeleteOpen}
                    addCategorySuccess={addCategorySuccess}
                    selectedCategory={selectedCategory}
                    setSelectedcategory={setSelectedCategory}
                    transactionType={paramValue}
                />
            </div>

            <AddCategoryModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                setAddCategorySuccess={setAddCategorySuccess}
                transactionType={paramValue}
            />

            <Button className='mt-5' onClick={handleAddTransaction}>
                Add {paramValue}
            </Button>
        </section>
    )
}

export default Page
