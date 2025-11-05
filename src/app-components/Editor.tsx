import React from "react";
import EditorJSTemplate from "./EditorJSTemplate";
import { ScrollArea } from "@/components/ui/scroll-area";

export default React.memo((props: any)=>{
    const handle_Change = React.useCallback((api: any , event: any) => {
        console.log('api',api);
        
        
    }, [])
    return (
        <ScrollArea className="h-[calc(100%-40px)]">
            <EditorJSTemplate onChange={handle_Change}/>
        </ScrollArea>
    )
})