"use client"

import {Button} from "@/components/ui/button"
import api from "@/lib/api"
import {useEffect, useState} from "react"
import toast from "react-hot-toast"
import {MdCheck, MdDelete} from "react-icons/md"

interface PropsType {
    isDeleteOpen?: boolean
    addCategorySuccess: boolean
    selectedCategory: number
    setSelectedcategory: (category: number) => void
    transactionType: string
    disabled?: boolean
}
const Categories = ({
    isDeleteOpen,
    addCategorySuccess,
    selectedCategory,
    setSelectedcategory,
    transactionType,
    disabled,
}: PropsType) => {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(false)

    const getAllcategories = async () => {
        setLoading(true)
        api.get(process.env.NEXT_PUBLIC_API_URL + "/category/getall")
            .then((res) => {
                const getTypedCategories = res?.data?.filter(
                    (item: {categoryType: string}) =>
                        item.categoryType === transactionType
                )
                setCategories(getTypedCategories)
                setLoading(false)
            })
            .catch((err) => {
                console.log(err)
                setLoading(false)
            })
    }

    useEffect(() => {
        getAllcategories()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (addCategorySuccess) {
            getAllcategories()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addCategorySuccess])

    const handleCategoryClick = (category: {id: number; name: string}) => {
        if (isDeleteOpen) {
            const toastId = toast.loading("Adding category...")

            api.delete(
                `${process.env.NEXT_PUBLIC_API_URL}/category/delete/${category.id}`
            )
                .then((res) => {
                    toast.success("Category deleted successfully!", {
                        id: toastId,
                    })
                    console.log(res)
                    getAllcategories()
                })
                .catch((err) => {
                    toast.error(
                        "Failed to delete category. Please try again.",
                        {
                            id: toastId,
                        }
                    )
                    console.log(err)
                })
        } else {
            setSelectedcategory(category.id)
        }
    }

    if (loading) return <div className='h-[100px]'>Loading ...</div>
    if (categories.length === 0) {
        return <div className='mt-5'>Please add category first</div>
    }
    return (
        <article className='mt-5 flex items-center gap-5 flex-wrap'>
            {categories.map((category: {id: number; name: string}) => {
                return (
                    <Button
                        disabled={disabled}
                        key={category.id}
                        onClick={() => handleCategoryClick(category)}
                        className={`${
                            selectedCategory === category.id
                                ? " bg-green-700 hover:bg-green-600"
                                : "bg-orange-600 hover:bg-orange-500"
                        }`}
                    >
                        {category.name}
                        {isDeleteOpen && (
                            <span>
                                <MdDelete />
                            </span>
                        )}
                        {selectedCategory === category.id && <MdCheck />}
                    </Button>
                )
            })}
        </article>
    )
}

export default Categories
