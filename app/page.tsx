"use client"
import {Button} from "@/components/ui/button"
import {endOfMonth, format, startOfMonth} from "date-fns"
import {LogOut} from "lucide-react"
import Link from "next/link"
import {useRouter} from "next/navigation"
import {useState} from "react"
import MonthSelector from "./components/MonthSelector"
import Transactions from "./components/Transactions"
import withAuth from "./components/hoc/withAuth"
function Home() {
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
      <Button className='mb-5 flex ml-auto' variant={"ghost"} onClick={logOut}>
        <LogOut />
      </Button>
      <div className='flex items-center gap-5'>
        <Link href={"/add?type=expense"}>
          <Button className='bg-orange-600'>Add Expense</Button>
        </Link>
        <Link href={"/add?type=income"}>
          <Button className='bg-green-500'>Add Income</Button>
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
export default withAuth(Home)
