import { contextBridge, ipcRenderer } from 'electron';
import type { INoteData } from './shared/types';
import { broadcast_event } from './shared/events';

function emitAllNotes(notes: INoteData[]) {
  window.dispatchEvent(broadcast_event('all-notes-data', notes));
}

ipcRenderer.on('onstart-notes-data', (_ev, data: INoteData[]) => {
  const fire = () => setTimeout(() => emitAllNotes(data), 0);
  if (document.readyState === 'interactive' || document.readyState === 'complete') fire();
  else window.addEventListener('DOMContentLoaded', fire, { once: true });
});

ipcRenderer.on('update-notes-data', (_ev, data: INoteData[]) => {
  emitAllNotes(data);
});

const renderer = {
  closeApp: () => ipcRenderer.send('close-app'),
  maximizeApp: () => ipcRenderer.send('maximize-app'),
  minimizeApp: () => ipcRenderer.send('minimize-app'),


  async set_note(data: INoteData, explicit = true): Promise<INoteData[]> {
    const notes = (await ipcRenderer.invoke('set-note', data)) as INoteData[];
    if (explicit) emitAllNotes(notes);
    return notes;
  },


  async delete_note(id: number, explicit = true): Promise<INoteData[]> {
    const notes = (await ipcRenderer.invoke('delete-note', id)) as INoteData[];
    if (explicit) emitAllNotes(notes);
    return notes;
  },


  async fetch_all_notes(): Promise<void> {
    const all_notes = (await ipcRenderer.invoke('fetch-all-notes')) as INoteData[];
    emitAllNotes(all_notes);
  },
};

contextBridge.exposeInMainWorld('electron', renderer);
export type IRenderer = typeof renderer;
