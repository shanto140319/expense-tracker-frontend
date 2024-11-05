export type User = {
    id: number
    userName: string
    phoneNumber: string
    password: string
    createdDate: string
}

export type Category = {
    id: number
    name: string
    categoryType: string
    description: string
    isActive: boolean
    user: User
}

export type Transaction = {
    id: number
    amount: string
    categoryId: number
    type: string
    description: string
    createdDate: string
    updatedDate: string
    category: Category
    user: User
}

export type GroupedData = {
    [categoryName: string]: {
        total: number
        type: string
        transactions: Transaction[]
    }
}
