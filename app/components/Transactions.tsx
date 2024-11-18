"use client"

import {Skeleton} from "@/components/ui/skeleton"
import {GroupedData, Transaction} from "@/lib/types"
import {useEffect, useState} from "react"
import useFetch from "../customHooks/useFetch"
import AccordionData from "./AccordionData"
import PieTransactions from "./PieTransactions"
import RecentTransaction from "./RecentTransaction"
type DateRange = {
    startDate: string
    endDate: string
}

interface PropsType {
    dateRange: DateRange
    isDateChanged: boolean
    setIsDateChanged: (isDateChanged: boolean) => void
}
const Transactions = ({
    dateRange,
    isDateChanged,
    setIsDateChanged,
}: PropsType) => {
    const {data, loading, refetch} = useFetch<Transaction[]>(
        `${process.env.NEXT_PUBLIC_API_URL}/transaction/getall?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`
    )
    const [groupedData, setGroupedData] = useState<GroupedData>({})
    const [totalIncome, setTotalincome] = useState<number>(0)
    const [totalExpense, setTotalExpense] = useState<number>(0)
    useEffect(() => {
        if (data && Array.isArray(data)) {
            const grouped = data.reduce((acc: GroupedData, transaction) => {
                const {category} = transaction
                const categoryName = category.name
                if (!acc[categoryName]) {
                    acc[categoryName] = {
                        total: 0,
                        type: category.categoryType,
                        transactions: [],
                    }
                }
                acc[categoryName] = {
                    total: acc[categoryName].total + Number(transaction.amount),
                    type: category.categoryType,
                    transactions: [
                        ...acc[categoryName].transactions,
                        transaction,
                    ],
                }
                return acc
            }, {})
            setGroupedData(grouped)
        }

        const _totalIncome =
            data
                ?.filter((transaction) => transaction.type === "income")
                .reduce(
                    (sum, transaction) => sum + parseFloat(transaction.amount),
                    0
                ) || 0

        const _totalExpense =
            data
                ?.filter((transaction) => transaction.type === "expense")
                .reduce(
                    (sum, transaction) => sum + parseFloat(transaction.amount),
                    0
                ) || 0
        setTotalExpense(_totalExpense)
        setTotalincome(_totalIncome)
    }, [data])

    useEffect(() => {
        if (isDateChanged) {
            refetch()
            setIsDateChanged(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDateChanged])

    if (loading)
        return (
            <section>
                <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-center gap-5 mt-5'>
                    <Skeleton className='h-10 w-full' />
                    <Skeleton className='h-10 w-full' />
                    <Skeleton className='h-10 w-full' />
                    <Skeleton className='h-10 w-full' />
                </div>
                <div className='mt-12 flex justify-center w-full'>
                    <Skeleton className='h-[260px] w-[260px] rounded-full' />
                </div>
                <div className='grid gap-5 w-full max-w-[400px] mt-10'>
                    <div className='flex items-center gap-10'>
                        <Skeleton className='h-10 w-full' />
                        <Skeleton className='h-10 w-full' />
                    </div>
                    <div className='flex items-center gap-10'>
                        <Skeleton className='h-10 w-full' />
                        <Skeleton className='h-10 w-full' />
                    </div>
                </div>
            </section>
        )

    return (
        <section>
            <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-center gap-5 mt-5'>
                <p className='bg-slate-600  rounded-md text-white h-[50px] flex items-center justify-center'>
                    Total Income: {totalIncome}
                </p>
                <p className='bg-slate-600  rounded-md text-white h-[50px] flex items-center justify-center'>
                    Total Expense: {totalExpense}
                </p>
                <p className='bg-slate-600  rounded-md text-white h-[50px] flex items-center justify-center'>
                    Remaining Balance: {totalIncome - totalExpense}
                </p>
            </div>

            {data && data?.length <= 0 ? (
                <div className='mt-10 text-center font-bold text-2xl'>
                    <h2>Please add your transaction</h2>
                </div>
            ) : (
                <>
                    <PieTransactions
                        groupedData={groupedData}
                        totalExpense={totalExpense}
                    />
                    <RecentTransaction data={data} refetch={refetch} />
                    <h2 className='font-bold mt-10 text-2xl'>All Expenses</h2>
                    <AccordionData
                        groupedData={groupedData}
                        refetch={refetch}
                        type='expense'
                    />
                    <h2 className='font-bold mt-10 text-2xl'>All Income</h2>
                    <AccordionData
                        groupedData={groupedData}
                        refetch={refetch}
                        type='income'
                    />
                </>
            )}
        </section>
    )
}

export default Transactions
