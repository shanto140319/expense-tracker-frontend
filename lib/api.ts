// api.ts
import axios from "axios"

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL, // Change this to your backend URL
})

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token") // Adjust the storage method as necessary
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true
            const refresh_token = localStorage.getItem("refresh_token")
            try {
                const refreshResponse = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
                    {refresh_token},
                    {withCredentials: true}
                )

                if (refreshResponse.status === 201) {
                    const {access_token} = refreshResponse.data
                    localStorage.setItem("access_token", access_token)
                    originalRequest.headers[
                        "Authorization"
                    ] = `Bearer ${access_token}`
                    return api(originalRequest)
                }
            } catch (refreshError) {
                // Redirect to login if refresh fails
                localStorage.clear() //clearing local token if refresh token expires
                window.location.href = "/login"
                return Promise.reject(refreshError)
            }
        }
        return Promise.reject(error)
    }
)

export default api
