import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";

import React from 'react'
import { WindowButtons } from "../assets/SharedComponents";
import Editor from "./Editor";

export default React.memo((props: any) => {
    return (
        <div className="h-[100vh] w-[100%]">
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel minSize={25} defaultSize={40}>
                    <div className='h-[40px] w-[100%] border-b-[.5px] border-b-stone-300 dark:border-b-stone-800 app-dragger flex justify-center'></div>

                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel minSize={25} >
                    <div className='h-[40px] w-[100%] border-b-[.5px] border-b-stone-300 dark:border-b-stone-800 app-dragger flex justify-end'>
                        
                        {
                                window.navigator.userAgent.toLowerCase().includes('win') &&
                                <WindowButtons/>
                        }

                        
                    </div>

                    <Editor/>

                </ResizablePanel >
            </ResizablePanelGroup>

        </div>
    )
})