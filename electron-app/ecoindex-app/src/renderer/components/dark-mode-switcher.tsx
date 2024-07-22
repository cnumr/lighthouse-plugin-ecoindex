import React, { useEffect } from 'react'
import { Sun, SunMoon } from 'lucide-react'

import { Button } from '../ui/button'

export const DarkModeSwitcher = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
    const switchDarkMode = (
        setDark = true,
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        console.log(event)

        const html = document.getElementsByTagName('html')[0]
        const light = document.getElementById('light')
        const dark = document.getElementById('dark')

        if (!setDark) {
            html.classList.add('light')
            html.classList.remove('dark')
            light.classList.add('border-2')
            light.classList.add('border-foreground')
            dark.classList.remove('border-2')
            dark.classList.remove('border-foreground')
        } else {
            html.classList.add('dark')
            html.classList.remove('light')
            light.classList.remove('border-2')
            light.classList.remove('border-foreground')
            dark.classList.add('border-2')
            dark.classList.add('border-foreground')
        }
    }
    useEffect(() => {
        const light = document.getElementById('light')
        light.classList.add('border-2')
        light.classList.add('border-foreground')
        const html = document.getElementsByTagName('html')[0]
        html.classList.add('light')
    }, [])

    return (
        <div className={className} {...props}>
            <Button
                id="dark"
                onClick={(e) => switchDarkMode(true, e)}
                variant="outline"
            >
                <Sun className="mr-2 size-4" />
                Dark
            </Button>
            <Button
                id="light"
                onClick={(e) => switchDarkMode(false, e)}
                variant="outline"
            >
                <SunMoon className="mr-2 size-4" />
                Light
            </Button>
        </div>
    )
})
