"use client"
import {Button} from "@/components/ui/button"
import {endOfMonth, format, startOfMonth} from "date-fns"
import Link from "next/link"
import {useEffect, useState} from "react"
import MonthSelector from "./components/MonthSelector"
import Transactions from "./components/Transactions"

export default function Home() {
    const [dateRange, setDateRange] = useState({startDate: "", endDate: ""})
    useEffect(() => {
        const date = new Date()
        // Determine the start and end of the selected month
        const start = startOfMonth(date)
        const end = endOfMonth(date)

        setDateRange({
            startDate: format(start, "yyyy-MM-dd"),
            endDate: format(end, "yyyy-MM-dd"),
        })
    }, [])

    return (
        <main className='my-10'>
            <div className='flex items-center gap-10'>
                <Link href={"/add?type=expense"}>
                    <Button>Add Expense</Button>
                </Link>
                <Link href={"/add?type=income"}>
                    <Button>Add Income</Button>
                </Link>
            </div>
            <MonthSelector setDateRange={setDateRange} />
            <Transactions dateRange={dateRange} />
        </main>
    )
}
