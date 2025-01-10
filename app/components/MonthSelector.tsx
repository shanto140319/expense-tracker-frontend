"use client"
import {Button} from "@/components/ui/button"
import {endOfMonth, format, startOfMonth} from "date-fns"
import {useState} from "react"

interface DateRange {
  startDate: string
  endDate: string
}

interface MonthSelectorProps {
  setDateRange: (range: DateRange) => void
  setIsDateChanged: (isDateChanged: boolean) => void
}
const MonthSelector = ({
  setDateRange,
  setIsDateChanged,
}: MonthSelectorProps) => {
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

  const handleClick = () => {
    setIsDateChanged(true)
  }

  return (
    <div className='max-w-md mx-auto my-7 flex items-center gap-5'>
      <input
        type='month'
        id='month'
        value={format(selectedMonth, "yyyy-MM")}
        onChange={handleMonthChange}
        className='block w-full py-[5px] px-[10px] border border-gray-300 rounded-lg'
      />
      <Button onClick={handleClick}>Search</Button>
    </div>
  )
}

export default MonthSelector
