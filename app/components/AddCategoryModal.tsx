"use client"

import {Button} from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {Textarea} from "@/components/ui/textarea"
import api from "@/lib/api"
import {useState} from "react"
import toast from "react-hot-toast"

interface PropsType {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    setAddCategorySuccess: (isOpen: boolean) => void
    transactionType: string
}

export default function AddCategoryModal({
    isOpen,
    setIsOpen,
    setAddCategorySuccess,
    transactionType,
}: PropsType) {
    const [name, setName] = useState("")
    const [type, setType] = useState(transactionType)
    const [description, setDescription] = useState("")
    // useEffect(() => {
    //     console.log(transactionType)
    //     setType(transactionType)
    // }, [transactionType])

    const addCategory = () => {
        const toastId = toast.loading("Adding category...")
        setAddCategorySuccess(false)
        api.post(`${process.env.NEXT_PUBLIC_API_URL}/category/create`, {
            name,
            categoryType: type,
            description,
        })
            .then((res) => {
                toast.success("Category added successfully!", {
                    id: toastId,
                })
                console.log(res)
                setAddCategorySuccess(true)
            })
            .catch((err) => {
                toast.error("Failed to add category. Please try again.", {
                    id: toastId,
                })
                console.log(err)
            })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setName("")
        setType(transactionType)
        setDescription("")
        addCategory()
        setIsOpen(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className='grid gap-4 py-4'>
                    <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor='name' className='text-right'>
                            Name
                        </Label>
                        <Input
                            id='name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className='col-span-3'
                        />
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor='description' className='text-right'>
                            Description
                        </Label>
                        <Textarea
                            id='description'
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className='col-span-3'
                        />
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor='type' className='text-right'>
                            Type
                        </Label>
                        <Select value={type} onValueChange={setType}>
                            <SelectTrigger className='col-span-3'>
                                <SelectValue placeholder='Select a type' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='expense'>expense</SelectItem>
                                <SelectItem value='income'>income</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button type='submit' className='ml-auto'>
                        Submit
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
