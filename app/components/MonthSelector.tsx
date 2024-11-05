"use client"
import {endOfMonth, format, startOfMonth} from "date-fns"
import {useState} from "react"

interface DateRange {
    startDate: string
    endDate: string
}

interface MonthSelectorProps {
    setDateRange: (range: DateRange) => void
}
const MonthSelector = ({setDateRange}: MonthSelectorProps) => {
    const [selectedMonth, setSelectedMonth] = useState(new Date())

    const handleMonthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = new Date(event.target.value)
        setSelectedMonth(newDate)

        // Determine the start and end of the selected month
        const start = startOfMonth(newDate)
        const end = endOfMonth(newDate)

        setDateRange({
            startDate: format(start, "yyyy-MM-dd"),
            endDate: format(end, "yyyy-MM-dd"),
        })
    }

    return (
        <div className='max-w-md mx-auto my-10'>
            <label htmlFor='month' className='block mb-2 text-lg font-semibold'>
                Select Month:
            </label>
            <input
                type='month'
                id='month'
                value={format(selectedMonth, "yyyy-MM")}
                onChange={handleMonthChange}
                className='block w-full p-2 border border-gray-300 rounded-lg'
            />
        </div>
    )
}

export default MonthSelector
