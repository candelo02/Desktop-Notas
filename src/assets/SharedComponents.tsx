import { Maximize, Minus, X } from 'lucide-react'
import React from 'react'

export const WindowButtons = React.memo((props: any) => {
    return (
        <div className="window-buttons flex [&>div]:hover:bg-[#e7e5e4] dark:[&>div]:hover:bg-[#1c1917]">
            <div className="p-2 flex justify-center align-center"
                onClick={() => window.electron.minimizeApp()}>
                <Minus className="w-[20px] h-[20px] text-black dark:text-[#e7e5e4]" />
            </div>
            <div className="p-2 flex justify-center align-center"
                onClick={() => window.electron.maximizeApp()}>
                <Maximize className="w-[20px] h-[20px] text-black dark:text-[#e7e5e4]" />
            </div>
            <div className="p-2 flex justify-center align-center"
                onClick={() => window.electron.closeApp()}>
                <X className="w-[20px] h-[20px] text-black dark:text-[#e7e5e4]" />
            </div>
        </div>
    )
})
