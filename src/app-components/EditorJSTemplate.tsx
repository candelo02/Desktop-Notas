import React from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Link from '@editorjs/link';
import List from '@editorjs/list';
import CheckList from '@editorjs/checklist';
import Quote from '@editorjs/quote';
// @ts-ignore
import Marker from '@editorjs/marker';

const EditorJSTemplate: React.FC<any> = (props) => {
    const holderRef = React.useRef<HTMLDivElement>(null);
    const editorRef = React.useRef<EditorJS | null>(null);

    React.useEffect(() => {
        if (holderRef.current) {
            editorRef.current = new EditorJS({
                holder: holderRef.current,
                autofocus: true,
                placeholder: 'Escribe aquí…',
                tools: {
                    header: Header,
                    linkTool: Link,
                    checklist: CheckList,
                    list: List,
                    quote: Quote,
                    marker: Marker,
                },
                onChange(api, event) {
                    props.onChange?.(api, event);
                },
            });
        }

        return () => {
            editorRef.current?.destroy?.();
            editorRef.current = null;
        };
    }, [props]);

    return (
        <div
            ref={holderRef}
            className="
        app-no-drag         
        h-[calc(100vh-32px)]
        w-full
        overflow-auto
        p-4
        text-black
        dark:text-white
        dark:[&::selection]:bg-[oklch(37.4%_0.01_67.558)]
        dark:[&_svg_path,_svg_line,_svg_rect]:stroke-[#ddd]
        dark:[&_.ce-popover-item]:text-white
      "
        />
    );
};

export default React.memo(EditorJSTemplate);
