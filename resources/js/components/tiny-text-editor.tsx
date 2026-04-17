import { useEffect, useRef, useState } from 'react';
import {
    AlignLeft,
    AlignCenter,
    AlignRight,
    Bold,
    Italic,
    Underline,
    List,
    ListOrdered,
    Link2,
    Image as ImageIcon,
    Eraser,
    Heading1,
    Heading2,
    Heading3,
} from 'lucide-react';

type TinyTextEditorProps = {
    value: string;
    onChange: (value: string) => void;
    id?: string;
    className?: string;
};

export function TinyTextEditor({ value, onChange, id, className }: TinyTextEditorProps) {
    const ref = useRef<HTMLDivElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [uploading, setUploading] = useState(false);
    const savedRangeRef = useRef<Range | null>(null);

    useEffect(() => {
        if (!ref.current) return;
        // Only update from props if the editor doesn't have focus,
        // to avoid clobbering user input while typing.
        if (document.activeElement !== ref.current) {
            ref.current.innerHTML = value || '';
        }
    }, [value]);

    const handleInput = () => {
        if (!ref.current) return;
        onChange(ref.current.innerHTML);
    };

    const restoreSelection = () => {
        const selection = window.getSelection();
        const range = savedRangeRef.current;
        if (!selection || !range) return;
        selection.removeAllRanges();
        selection.addRange(range);
    };

    const exec = (command: string, value?: string) => {
        if (!ref.current) return;
        ref.current.focus();
        // Restore last selection (so selecting multiple lines then clicking toolbar works)
        restoreSelection();
        document.execCommand(command, false, value);
        handleInput();
    };

    const handleHeading = (tagName: 'H1' | 'H2' | 'H3') => {
        exec('formatBlock', tagName);
    };

    const handleAlign = (direction: 'left' | 'center' | 'right') => {
        const root = ref.current;
        if (!root) return;
        root.focus();
        restoreSelection();

        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) {
            exec(
                direction === 'left'
                    ? 'justifyLeft'
                    : direction === 'center'
                      ? 'justifyCenter'
                      : 'justifyRight'
            );
            return;
        }

        const range = selection.getRangeAt(0);
        let node: Node | null = range.commonAncestorContainer;
        let img: HTMLImageElement | null = null;

        if (node instanceof HTMLImageElement) {
            img = node;
        } else {
            const el = node instanceof Element ? node : node.parentElement;
            if (el) {
                img = el.querySelector('img') ?? (el.closest ? (el.closest('img') as HTMLImageElement | null) : null);
            }
            if (!img) {
                // Selection might be next to image: walk up and see if we're inside a block that has an img
                let block: Node | null = node;
                while (block && block !== root) {
                    if (block instanceof HTMLElement && block.querySelector('img')) {
                        img = block.querySelector('img');
                        break;
                    }
                    block = block.parentNode;
                }
            }
        }
        if (!img || !root.contains(img)) {
            img = null;
        }

        if (img) {
            // Align only the block that contains this image so the image moves in the editor
            let block: HTMLElement = img.parentElement as HTMLElement;
            if (block === root) {
                // Image is direct child of editor – wrap in a div so we can align it
                const wrapper = document.createElement('div');
                wrapper.style.textAlign = direction;
                root.insertBefore(wrapper, img);
                wrapper.appendChild(img);
                block = wrapper;
            } else {
                block.style.textAlign = direction;
            }
            handleInput();
            return;
        }

        const cmd =
            direction === 'left'
                ? 'justifyLeft'
                : direction === 'center'
                  ? 'justifyCenter'
                  : 'justifyRight';
        exec(cmd);
    };

    const handleCreateLink = () => {
        const url = window.prompt('Link URL');
        if (!url) return;
        exec('createLink', url);
    };

    const handleInsertImage = () => {
        if (!fileInputRef.current) return;
        fileInputRef.current.click();
    };

    return (
        <div className={className}>
            <div
                className="mb-2 flex flex-wrap gap-1 text-[11px]"
                onMouseDown={(e) => {
                    // Keep focus in the editor when clicking toolbar buttons so selection is not lost
                    e.preventDefault();
                }}
            >
                <button
                    type="button"
                    onClick={() => exec('bold')}
                    className="inline-flex items-center justify-center rounded-md border border-sidebar-border bg-muted px-2.5 py-1 hover:bg-muted/80 cursor-pointer"
                >
                    <Bold className="h-3.5 w-3.5" />
                </button>
                <button
                    type="button"
                    onClick={() => exec('italic')}
                    className="inline-flex items-center justify-center rounded-md border border-sidebar-border bg-muted px-2.5 py-1 hover:bg-muted/80 cursor-pointer"
                >
                    <Italic className="h-3.5 w-3.5" />
                </button>
                <button
                    type="button"
                    onClick={() => exec('underline')}
                    className="inline-flex items-center justify-center rounded-md border border-sidebar-border bg-muted px-2.5 py-1 hover:bg-muted/80 cursor-pointer"
                >
                    <Underline className="h-3.5 w-3.5" />
                </button>
                <button
                    type="button"
                    onClick={() => exec('insertUnorderedList')}
                    className="inline-flex items-center justify-center rounded-md border border-sidebar-border bg-muted px-2.5 py-1 hover:bg-muted/80 cursor-pointer"
                >
                    <List className="h-3.5 w-3.5" />
                </button>
                <button
                    type="button"
                    onClick={() => exec('insertOrderedList')}
                    className="inline-flex items-center justify-center rounded-md border border-sidebar-border bg-muted px-2.5 py-1 hover:bg-muted/80 cursor-pointer"
                >
                    <ListOrdered className="h-3.5 w-3.5" />
                </button>
                <button
                    type="button"
                    onClick={() => handleHeading('H1')}
                    className="inline-flex items-center justify-center rounded-md border border-sidebar-border bg-muted px-2.5 py-1 hover:bg-muted/80 cursor-pointer"
                >
                    <Heading1 className="h-3.5 w-3.5" />
                </button>
                <button
                    type="button"
                    onClick={() => handleHeading('H2')}
                    className="inline-flex items-center justify-center rounded-md border border-sidebar-border bg-muted px-2.5 py-1 hover:bg-muted/80 cursor-pointer"
                >
                    <Heading2 className="h-3.5 w-3.5" />
                </button>
                <button
                    type="button"
                    onClick={() => handleHeading('H3')}
                    className="inline-flex items-center justify-center rounded-md border border-sidebar-border bg-muted px-2.5 py-1 hover:bg-muted/80 cursor-pointer"
                >
                    <Heading3 className="h-3.5 w-3.5" />
                </button>
                <button
                    type="button"
                    onClick={handleCreateLink}
                    className="inline-flex items-center justify-center rounded-md border border-sidebar-border bg-muted px-2.5 py-1 hover:bg-muted/80 cursor-pointer"
                >
                    <Link2 className="h-3.5 w-3.5" />
                </button>
                <button
                    type="button"
                    onClick={handleInsertImage}
                    className="inline-flex items-center justify-center rounded-md border border-sidebar-border bg-muted px-2.5 py-1 hover:bg-muted/80 cursor-pointer"
                >
                    {uploading ? (
                        <span className="text-[10px]">…</span>
                    ) : (
                        <ImageIcon className="h-3.5 w-3.5" />
                    )}
                </button>
                <span className="mx-1 h-4 w-px bg-sidebar-border/60" />
                <button
                    type="button"
                    onClick={() => handleAlign('left')}
                    className="inline-flex items-center justify-center rounded-md border border-sidebar-border bg-muted px-2.5 py-1 hover:bg-muted/80 cursor-pointer"
                >
                    <AlignLeft className="h-3.5 w-3.5" />
                </button>
                <button
                    type="button"
                    onClick={() => handleAlign('center')}
                    className="inline-flex items-center justify-center rounded-md border border-sidebar-border bg-muted px-2.5 py-1 hover:bg-muted/80 cursor-pointer"
                >
                    <AlignCenter className="h-3.5 w-3.5" />
                </button>
                <button
                    type="button"
                    onClick={() => handleAlign('right')}
                    className="inline-flex items-center justify-center rounded-md border border-sidebar-border bg-muted px-2.5 py-1 hover:bg-muted/80 cursor-pointer"
                >
                    <AlignRight className="h-3.5 w-3.5" />
                </button>
                <button
                    type="button"
                    onClick={() => exec('removeFormat')}
                    className="inline-flex items-center justify-center rounded-md border border-sidebar-border bg-muted px-2.5 py-1 hover:bg-muted/80 cursor-pointer"
                >
                    <Eraser className="h-3.5 w-3.5" />
                </button>
            </div>
            <div
                id={id}
                ref={ref}
                contentEditable
                onInput={handleInput}
                onKeyUp={() => {
                    const selection = window.getSelection();
                    if (selection && selection.rangeCount > 0) {
                        savedRangeRef.current = selection.getRangeAt(0);
                    }
                }}
                onMouseUp={() => {
                    const selection = window.getSelection();
                    if (selection && selection.rangeCount > 0) {
                        savedRangeRef.current = selection.getRangeAt(0);
                    }
                }}
                className="tiny-editor-content min-h-[200px] w-full max-w-full resize-y overflow-auto whitespace-pre-wrap break-words rounded-md border border-sidebar-border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
                [&>h1]:mt-3 [&>h1]:mb-2 [&>h1]:text-xl [&>h1]:font-semibold
                [&>h2]:mt-2 [&>h2]:mb-1 [&>h2]:text-lg [&>h2]:font-semibold
                [&>h3]:mt-2 [&>h3]:mb-1 [&>h3]:text-base [&>h3]:font-semibold
                [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-md
                [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto"
            />
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setUploading(true);
                    try {
                        const formData = new FormData();
                        formData.append('image', file);
                        const token = (
                            document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement
                        )?.content;
                        const response = await fetch('/dashboard/uploads/legal-image', {
                            method: 'POST',
                            headers: {
                                'X-CSRF-TOKEN': token ?? '',
                                'X-Requested-With': 'XMLHttpRequest',
                            },
                            body: formData,
                            credentials: 'same-origin',
                        });
                        if (!response.ok) {
                            throw new Error('Upload failed');
                        }
                        const json = (await response.json()) as { url?: string };
                        if (json.url && ref.current) {
                            ref.current.focus();
                            document.execCommand('insertImage', false, json.url);
                            handleInput();
                        }
                    } catch (error) {
                        console.error(error);
                        window.alert('Image upload failed. Please try again.');
                    } finally {
                        setUploading(false);
                        if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                        }
                    }
                }}
            />
        </div>
    );
}

