"use client"
import {Button} from "@/components/ui/button"
import {endOfMonth, format, startOfMonth} from "date-fns"
import {LogOut} from "lucide-react"
import Link from "next/link"
import {useRouter} from "next/navigation"
import {useState} from "react"
import MonthSelector from "./components/MonthSelector"
import Transactions from "./components/Transactions"

export default function Home() {
    const [dateRange, setDateRange] = useState({
        startDate: format(startOfMonth(new Date()), "yyyy-MM-dd"),
        endDate: format(endOfMonth(new Date()), "yyyy-MM-dd"),
    })

    const [isDateChanged, setIsDateChanged] = useState(false)

    const router = useRouter()

    const logOut = () => {
        localStorage.clear()
        router.replace("/login")
    }
    return (
        <main className='my-10'>
            <Button className='mb-10 flex ml-auto' onClick={logOut}>
                <LogOut />
            </Button>
            <div className='flex items-center gap-10'>
                <Link href={"/add?type=expense"}>
                    <Button>Add Expense</Button>
                </Link>
                <Link href={"/add?type=income"}>
                    <Button>Add Income</Button>
                </Link>
            </div>
            <MonthSelector
                setDateRange={setDateRange}
                setIsDateChanged={setIsDateChanged}
            />
            <Transactions
                dateRange={dateRange}
                isDateChanged={isDateChanged}
                setIsDateChanged={setIsDateChanged}
            />
        </main>
    )
}
