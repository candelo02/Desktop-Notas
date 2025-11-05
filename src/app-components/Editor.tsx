import React from "react";
import EditorJSTemplate from "./EditorJSTemplate";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMainStore } from "@/shared/zust-store";

export default React.memo((props: any) => {
    const active_note = useMainStore(state => state.active_note)

