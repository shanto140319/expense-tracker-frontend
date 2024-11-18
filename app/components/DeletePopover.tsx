"use client"

import {Button} from "@/components/ui/button"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {Trash2} from "lucide-react"
import {useState} from "react"

export default function DeleteButton({onDelete}: {onDelete: () => void}) {
    const [isOpen, setIsOpen] = useState(false)

    const handleDelete = () => {
        onDelete()
        setIsOpen(false)
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant='destructive' size='icon' className='h-7 w-7'>
                    <Trash2 className='h-3 w-3' />
                    <span className='sr-only'>Delete</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-80'>
                <div className='grid gap-4'>
                    <div className='space-y-2'>
                        <h4 className='font-medium leading-none'>
                            Confirm Deletion
                        </h4>
                        <p className='text-sm text-muted-foreground'>
                            Are you sure you want to delete this item?
                        </p>
                    </div>
                    <div className='flex justify-end space-x-2'>
                        <Button
                            variant='outline'
                            onClick={() => setIsOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button variant='destructive' onClick={handleDelete}>
                            Delete
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
