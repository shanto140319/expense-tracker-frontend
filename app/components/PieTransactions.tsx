/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import {GroupedData} from "@/lib/types"
import {ArcElement, Chart as ChartJS, Legend, Tooltip} from "chart.js"
import ChartDataLabels from "chartjs-plugin-datalabels"
import {useEffect, useState} from "react"
import {Doughnut} from "react-chartjs-2"

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels)

const PieTransactions = ({
    groupedData,
    totalExpense,
}: {
    groupedData: GroupedData
    totalExpense: number
}) => {
    const [labels, setLabels] = useState<string[]>([])
    const [totals, setTotals] = useState<number[]>([])
    const [percentages, setPercentages] = useState<string[]>([])
    const [colors, setColors] = useState<string[]>([])

    const generateColor = (index: number) => {
        const hue = (index * 360) / 12 // Spread colors evenly around the color wheel
        return `hsl(${hue}, 70%, 50%)` // Adjust saturation and lightness as needed
    }

    useEffect(() => {
        // Prepare data arrays for Chart.js
        const expenseCategories = Object.fromEntries(
            Object.entries(groupedData).filter(
                ([_, category]) => category.type === "expense"
            )
        )

        // Create an array of entries and sort by total descending
        const sortedCategories = Object.entries(expenseCategories)
            .map(([key, category]) => ({
                label: key,
                total: category.total,
            }))
            .sort((a, b) => b.total - a.total) // Sort in descending order

        // Set sorted labels and totals
        const _labels = sortedCategories.map((item) => item.label)
        const _totals = sortedCategories.map((item) => item.total)
        const _percentages = _totals.map((total) =>
            ((total / totalExpense) * 100).toFixed(2)
        )

        setLabels(_labels)
        setTotals(_totals)
        setPercentages(_percentages)

        // Generate colors based on the number of labels
        const _colors = Array.from({length: _labels.length}, (_, index) =>
            generateColor(index)
        )
        setColors(_colors)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [groupedData])

    const chartData = {
        labels: labels,
        datasets: [
            {
                data: totals,
                backgroundColor: colors, // Use the dynamically generated colors
                hoverBackgroundColor: colors,
                borderColor: "#FFFFFF",
                borderWidth: 2,
                cutout: "70%", // Makes it a donut chart
            },
        ],
    }

    const chartOptions = {
        plugins: {
            legend: {
                display: false, // Hide the default legend
            },
            datalabels: {display: false}, // To hide data labels inside the donut
        },
        cutout: "70%",
        responsive: true,
        maintainAspectRatio: false,
    }

    return (
        <div className='my-10'>
            <h3 className='font-bold text-2xl'>Expense Distribution</h3>
            <div className='w-full h-[300px] py-5'>
                <Doughnut data={chartData} options={chartOptions} />
            </div>
            {/* Display labels with amounts and percentages below the chart */}
            <div className='flex flex-col items-center gap-2'>
                {labels.map((label, index) => {
                    return (
                        <div
                            key={label}
                            className='flex items-center justify-between w-full max-w-[400px]'
                        >
                            <div className='flex items-center'>
                                <div
                                    className='w-4 h-4 mr-2'
                                    style={{
                                        backgroundColor: colors[index],
                                        borderRadius: "50%",
                                    }}
                                ></div>
                                <span>{label}</span>
                            </div>
                            <span>
                                {percentages[index]}% ({totals[index]} TK)
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default PieTransactions
