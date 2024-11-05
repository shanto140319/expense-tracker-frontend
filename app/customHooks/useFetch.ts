import api from "@/lib/api"
import {AxiosRequestConfig} from "axios"
import {useEffect, useState} from "react"

interface UseFetchResult<T> {
    data: T | null
    loading: boolean
    error: string | null
    refetch: () => Promise<void>
}

const useFetch = <T>(
    url: string,
    options?: AxiosRequestConfig
): UseFetchResult<T> => {
    const [data, setData] = useState<T | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    const fetchData = async () => {
        setLoading(true)
        setError(null)

        try {
            const response = await api.get<T>(url, options)
            setData(response.data)
            setError(null)
        } catch (err) {
            setError("Failed to fetch data")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Allows manual refetch
    const refetch = () => fetchData()

    return {data, loading, error, refetch}
}

export default useFetch
