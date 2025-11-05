// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer,} from "electron";


const renderer = {
    closeApp: () =>{
        ipcRenderer.send("close-app",)

    },
    maximizeApp: () =>{
        ipcRenderer.send("maximize-app");

    },
    minimizeApp: () =>{
        ipcRenderer.send("minimize-app");

    },
}

contextBridge.exposeInMainWorld("electron", renderer);
export type IRenderer = typeof renderer