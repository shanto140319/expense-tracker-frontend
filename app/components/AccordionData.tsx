"use client"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {Button} from "@/components/ui/button"
import api from "@/lib/api"
import {GroupedData} from "@/lib/types"
import {Pencil} from "lucide-react"
import Link from "next/link"
import toast from "react-hot-toast"
import DeleteButton from "./DeletePopover"

const AccordionData = ({
    groupedData,
    refetch,
    type,
}: {
    groupedData: GroupedData
    refetch: () => void
    type: string
}) => {
    const handleDelete = async (id: number) => {
        try {
            await api.delete(
                `${process.env.NEXT_PUBLIC_API_URL}/transaction/delete/${id}`
            )
            refetch()
            toast.success(`Deleted successfully`)
        } catch (error) {
            console.log(error)
            toast.error(`Unable to delete. Please try again`)
        }
    }

    return (
        <Accordion type='single' collapsible>
            {Object.entries(groupedData).map(([categoryName, data]) => {
                if (data.type === type) {
                    return (
                        <AccordionItem key={categoryName} value={categoryName}>
                            <AccordionTrigger>
                                <span
                                    className={`${
                                        data.type === "expense"
                                            ? "bg-orange-600 text-white px-3 py-2 rounded-md"
                                            : "bg-green-700 text-white px-3 py-2 rounded-md"
                                    }`}
                                >
                                    {categoryName}
                                </span>
                            </AccordionTrigger>

                            <AccordionContent>
                                <p className='text-red-600 font-semibold mb-2 pl-3'>
                                    Total : {data.total.toFixed(2)} Tk
                                </p>
                                <ul className='pl-4 space-y-2'>
                                    {data.transactions.map(
                                        (transaction, index) => {
                                            return (
                                                <li
                                                    key={transaction.id}
                                                    className={`pb-2 flex items-start justify-between gap-5 ${
                                                        index <
                                                        data.transactions
                                                            .length -
                                                            1
                                                            ? "border-b"
                                                            : ""
                                                    }`}
                                                >
                                                    <div>
                                                        <p>
                                                            <strong>
                                                                Amount:{" "}
                                                            </strong>
                                                            {transaction.amount}{" "}
                                                            Tk
                                                        </p>

                                                        <p>
                                                            <strong>
                                                                Description:{" "}
                                                            </strong>{" "}
                                                            {transaction.description ||
                                                                "No description"}
                                                        </p>
                                                        <p>
                                                            <strong>
                                                                Created Date:{" "}
                                                            </strong>{" "}
                                                            {new Date(
                                                                transaction.createdDate
                                                            ).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <div className='flex items-center gap-3'>
                                                        <Link
                                                            href={`/update/${transaction.id}?type=${transaction.type}`}
                                                        >
                                                            <Button
                                                                size='icon'
                                                                className='h-7 w-7'
                                                            >
                                                                <Pencil className='h-4 w-4' />
                                                                <span className='sr-only'>
                                                                    Update
                                                                </span>
                                                            </Button>
                                                        </Link>
                                                        <DeleteButton
                                                            onDelete={() =>
                                                                handleDelete(
                                                                    transaction.id
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </li>
                                            )
                                        }
                                    )}
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    )
                }
            })}
        </Accordion>
    )
}

export default AccordionData
