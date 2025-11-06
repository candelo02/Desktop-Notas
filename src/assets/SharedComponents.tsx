import React from 'react';
import { INoteData, TNote } from '@/shared/types';
import { Maximize, Minus, X } from 'lucide-react';
import clsx from 'clsx';
import { userFriendlyTime } from '../shared/functions';
import { useMainStore } from '@/shared/zust-store';


function toTNote(value: string | TNote | undefined | null): TNote | null {
  if (!value) return null;
  if (typeof value === 'string') {
    try { return JSON.parse(value) as TNote; } catch { return null; }
  }
  return value as TNote;
}
function firstText(n: INoteData): string {
  const t = toTNote(n.note);
  return t?.blocks?.[0]?.data?.text ?? 'New note';
}
function secondText(n: INoteData): string {
  const t = toTNote(n.note);
  if (!t?.blocks?.length) return 'New note';
  return (t.blocks[1]?.data?.text ?? t.blocks[0]?.data?.text ?? 'New note');
}
function noteTime(n: INoteData): string {
  const t = toTNote(n.note);
  return t?.time ? userFriendlyTime(t.time) : '';
}

/** --- Window buttons --- */
export const WindowButtons = React.memo(() => {
  return (
    <div className="window-buttons flex [&>div]:hover:bg-[#e7e5e4] dark:[&>div]:hover:bg-[#1c1917]">
      <div className="p-2 flex justify-center items-center" onClick={() => window.electron.minimizeApp()}>
        <Minus className="w-[20px] h-[20px] text-black dark:text-[#e7e5e4]" />
      </div>
      <div className="p-2 flex justify-center items-center" onClick={() => window.electron.maximizeApp()}>
        <Maximize className="w-[20px] h-[20px] text-black dark:text-[#e7e5e4]" />
      </div>
      <div className="p-2 flex justify-center items-center" onClick={() => window.electron.closeApp()}>
        <X className="w-[20px] h-[20px] text-black dark:text-[#e7e5e4]" />
      </div>
    </div>
  );
});


export const NotesItem = React.memo((props: { note: INoteData; onClick?: (n: INoteData) => void }) => {
  const active_note = useMainStore((s) => s.active_note);

  const isActive = active_note?.id != null && props.note?.id != null && active_note.id === props.note.id;
  const title = firstText(props.note);
  const sub   = secondText(props.note);
  const when  = noteTime(props.note);

  return (
    <div
      onContextMenu={() => console.warn('Context menu not implemented')}
      className={clsx('w-full p-4 cursor-pointer [&.active]:rounded-2xl', { active: isActive })}
      onClick={() => props.onClick?.(props.note)}
    >
      {/* Editor.js */}
      <div className="font-bold text-md" dangerouslySetInnerHTML={{ __html: title }} />
      <div className="flex text-xs text-stone-800 dark:text-stone-300">
        <div>{when}</div>
        <div
          className="flex-1 ml-2 truncate"
          dangerouslySetInnerHTML={{ __html: sub }}
        />
      </div>
    </div>
  );
});

/** --- Notes list --- */
export const NotesList = React.memo((props: {
  section: string;
  data?: INoteData[];
  onClick?: (n: INoteData) => void;
}) => {
  const data = Array.isArray(props.data) ? props.data : [];

  return (
    <div className="w-full p-3 [&_.active]:bg-stone-200 dark:[&_.active]:bg-sky-900">
      <div className="text-md capitalize">{props.section}</div>
      <div className="divide-y divide-stone-200 dark:divide-stone-700">
        {data.length === 0 ? (
          <div className="py-2 text-xs text-stone-400">Sin elementos</div>
        ) : (
          data.map((note) => (
            <NotesItem
              key={note.id ?? `tmp-${firstText(note).slice(0, 24)}`}
              note={note}
              onClick={props.onClick}
            />
          ))
        )}
      </div>
    </div>
  );
});
