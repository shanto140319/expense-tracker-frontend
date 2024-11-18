"use client"

import {Button} from "@/components/ui/button"
import api from "@/lib/api"
import {Transaction} from "@/lib/types"
import {Pencil} from "lucide-react"
import Link from "next/link"
import toast from "react-hot-toast"
import DeleteButton from "./DeletePopover"

const RecentTransaction = ({
    data,
    refetch,
}: {
    data: Transaction[] | null
    refetch: () => void
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
        <section>
            <h2 className='font-bold text-xl mb-3'>Recent Transactions:</h2>

            <div>
                {data?.slice(0, 10)?.map((transaction) => {
                    return (
                        <li
                            key={transaction.id}
                            className={`pb-2 flex items-start justify-between gap-5 border-b mb-5 text-sm`}
                        >
                            <div>
                                <p>
                                    <strong className='text-orange-600'>
                                        Created Date:{" "}
                                    </strong>{" "}
                                    {new Intl.DateTimeFormat("en-US", {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true, // Use false for 24-hour format
                                    }).format(
                                        new Date(transaction.createdDate)
                                    )}
                                </p>
                                <p>
                                    <strong>Amount: </strong>
                                    {transaction.amount} Tk
                                </p>

                                <p>
                                    <strong>Description: </strong>{" "}
                                    {transaction.description ||
                                        "No description"}
                                </p>
                            </div>
                            <div className='flex items-center gap-3'>
                                <Link
                                    href={`/update/${transaction.id}?type=${transaction.type}`}
                                >
                                    <Button size='icon' className='h-7 w-7'>
                                        <Pencil className='h-2 w-2' />
                                        <span className='sr-only'>Update</span>
                                    </Button>
                                </Link>
                                <DeleteButton
                                    onDelete={() =>
                                        handleDelete(transaction.id)
                                    }
                                />
                            </div>
                        </li>
                    )
                })}
            </div>
        </section>
    )
}

export default RecentTransaction
