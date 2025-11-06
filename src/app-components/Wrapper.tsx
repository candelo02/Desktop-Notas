import React from 'react';
import {
    ResizableHandle, ResizablePanel, ResizablePanelGroup,
} from "@/components/ui/resizable";
import { NotesList, WindowButtons } from '@/assets/SharedComponents';
import Editor from './Editor';
import { useMainStore } from '@/shared/zust-store';
import EmptyNoteUI from './EmptyNoteUI';
import { INoteData, TNote } from '@/shared/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { sectionize_notes } from '@/shared/functions';
import { PenBox, Trash } from 'lucide-react';
import * as Switch from '@radix-ui/react-switch';

const safeParse = (val: string | TNote): TNote => {
    if (typeof val === 'string') {
        try { return JSON.parse(val) as TNote; } catch { return { time: 0, blocks: [], version: '' }; }
    }
    return val ?? ({ time: 0, blocks: [], version: '' } as TNote);
};
const sort_notes = (a: INoteData, b: INoteData) =>
    safeParse(b.note).time - safeParse(a.note).time;

export default React.memo(() => {
    const active_note = useMainStore(s => s.active_note);
    const notes = useMainStore(s => s.notes);
    const set_state = useMainStore(s => s.set_state);

    const [dark_mode, set_dark_mode] = React.useState<boolean>(
        (localStorage.getItem('dark_mode') ?? 'light') === 'dark'
    );

    const section_notes = React.useMemo(() => sectionize_notes(notes), [notes]);

    const handle_create_new_note = React.useCallback(async () => {
        const dummy_data: INoteData = { id: null, note: '{}' };
        const next = await window.electron.set_note(dummy_data, true);
        const sorted = [...next].sort(sort_notes);
        set_state('notes', sorted);
        set_state('active_note', sorted[0] ?? null);
    }, [set_state]);

    const handle_set_active_note = React.useCallback((note: INoteData) => {
        set_state('active_note', note);
    }, [set_state]);

    React.useEffect(() => {
        const enable = (d: boolean) => {
            localStorage.setItem('dark_mode', d ? 'dark' : 'light');
            document.documentElement.classList.toggle('dark', d);
            set_dark_mode(d);
        };
        enable(dark_mode);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onDarkToggle = React.useCallback((checked: boolean) => {
        localStorage.setItem('dark_mode', checked ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark', checked);
        set_dark_mode(checked);
    }, []);

    const handle_delete_note = React.useCallback(async () => {
        if (!active_note?.id) return;
        const ok = window.confirm('¿Estás seguro de que deseas eliminar esta nota? Esta acción es irreversible.');
        if (!ok) return;
        const next = await window.electron.delete_note(active_note.id, true);
        const sorted = [...next].sort(sort_notes);
        set_state('notes', sorted);
        set_state('active_note', sorted[0] ?? null);
    }, [active_note, set_state]);

    React.useLayoutEffect(() => {
        const listener = (ev: Event & { detail: INoteData[] }) => {
            const sorted = [...ev.detail].sort(sort_notes);
            set_state('notes', sorted);
            set_state('active_note', sorted[0] ?? null);
        };
        window.addEventListener('all-notes-data', listener as any);
        return () => window.removeEventListener('all-notes-data', listener as any);
    }, [set_state]);

    return (
        <div className="h-[100vh] w-full bg-white text-stone-900 dark:bg-[#0b0e14] dark:text-stone-100">
            <ResizablePanelGroup direction="horizontal" className="h-full">
                {/* LEFT */}
                <ResizablePanel minSize={30} defaultSize={35} className="border-r border-stone-200 dark:border-stone-800">
                    {/* Toolbar izquierda */}
                    <div className="h-10 w-full app-dragger flex items-center justify-between px-2 border-b border-stone-200 dark:border-stone-800 bg-white/70 dark:bg-stone-900/60 backdrop-blur">
                        <div className="text-xs uppercase tracking-wide text-stone-500 dark:text-stone-400 select-none">
                            Hoy
                        </div>
                        <div className="app-no-drag flex items-center gap-1">
                            <button
                                title="Nueva nota"
                                onClick={handle_create_new_note}
                                className="inline-flex items-center justify-center h-8 w-8 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition"
                            >
                                <PenBox className="h-[18px] w-[18px]" />
                            </button>
                            {notes.length > 0 && (
                                <button
                                    title="Eliminar nota"
                                    onClick={handle_delete_note}
                                    className="inline-flex items-center justify-center h-8 w-8 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition"
                                >
                                    <Trash className="h-[18px] w-[18px]" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Lista de notas */}
                    <ScrollArea className="h-[calc(100%-40px)]">
                        {notes.length === 0 ? (
                            <div className="h-full flex items-center justify-center p-6">
                                <div className="text-xs text-stone-500 dark:text-stone-400">No hay notas</div>
                            </div>
                        ) : (
                            <div className="p-3 space-y-3">
                                {Object.keys(section_notes).map((section) => {
                                    const arr = section_notes[section as keyof typeof section_notes] as INoteData[] | undefined;
                                    return (
                                        <div key={section} className="space-y-2">
                                            <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 px-1">
                                                {section}
                                            </div>
                                            <div className="space-y-2">
                                                <NotesList
                                                    section={section}
                                                    data={Array.isArray(arr) ? arr : []}
                                                    onClick={handle_set_active_note}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </ScrollArea>
                </ResizablePanel>

                <ResizableHandle className="bg-stone-100 dark:bg-stone-800" />

                {/* RIGHT */}
                <ResizablePanel minSize={30}>
                    {/* Toolbar derecha */}
                    <div className="h-10 w-full app-dragger flex items-center justify-between px-3 border-b border-stone-200 dark:border-stone-800 bg-white/70 dark:bg-stone-900/60 backdrop-blur">
                        <div className="app-no-drag flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-stone-500 dark:text-stone-400">Modo oscuro</span>
                                <Switch.Root
                                    className="relative h-6 w-11 rounded-full bg-stone-300 dark:bg-stone-700 data-[state=checked]:bg-stone-700 transition-colors"
                                    checked={dark_mode}
                                    onCheckedChange={onDarkToggle}
                                >
                                    <Switch.Thumb
                                        className="block h-4 w-4 rounded-full bg-white shadow-sm translate-x-1 data-[state=checked]:translate-x-[22px] transition-transform"
                                    />
                                </Switch.Root>
                            </div>
                        </div>
                        <div className="app-no-drag">
                            <WindowButtons />
                        </div>
                    </div>

                    {/* Contenido */}
                    <div className="h-[calc(100%-40px)]">
                        {active_note == null ? (
                            <div className="h-full flex items-center justify-center">
                                <div className="max-w-sm w-full">
                                    <EmptyNoteUI onClick={handle_create_new_note} />
                                </div>
                            </div>
                        ) : (
                            <div className="h-full">
                                <Editor key={active_note.id ?? 'new'} />
                            </div>
                        )}
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
});
