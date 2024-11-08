import {useRouter} from "next/navigation"
import {ComponentType, useEffect} from "react"

const withAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
    const WithAuthComponent = (props: P) => {
        const router = useRouter()
        const token =
            typeof window !== "undefined" ? localStorage.getItem("token") : null

        useEffect(() => {
            if (!token) {
                // Redirect to login if no token is found
                router.replace("/login")
            }
        }, [token, router])

        if (!token) {
            return null
        }

        return <WrappedComponent {...props} />
    }

    return WithAuthComponent
}

export default withAuth
