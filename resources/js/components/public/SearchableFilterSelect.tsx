import {
    Combobox,
    ComboboxButton,
    ComboboxInput,
    ComboboxOption,
    ComboboxOptions,
} from '@headlessui/react';
import { ChevronsUpDown } from 'lucide-react';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export type SearchableFilterOption = {
    value: string;
    label: string;
};

/** When Headless UI keeps the selected label in the input, the first typed chars append — strip that prefix. */
function extractTypedSearch(raw: string, selectedLabel: string): string {
    if (!selectedLabel) {
        return raw;
    }
    if (raw === selectedLabel) {
        return '';
    }
    if (raw.startsWith(selectedLabel)) {
        return raw.slice(selectedLabel.length);
    }
    return raw;
}

function foldForMatch(s: string): string {
    try {
        return s
            .normalize('NFD')
            .replace(/\p{M}/gu, '')
            .toLowerCase();
    } catch {
        return s.toLowerCase();
    }
}

type Props = {
    id: string;
    label?: string;
    value: string;
    onValueChange: (next: string) => void;
    options: SearchableFilterOption[];
    placeholder?: string;
    noResultsLabel: string;
    /** Larger control (e.g. hero city search). */
    size?: 'default' | 'large';
    /** Shown inside the input on the left (e.g. location pin). */
    leadingIcon?: ReactNode;
    /** Rendered on the same row as the input (e.g. search button). Label stays above. */
    inlineEnd?: ReactNode;
};

export function SearchableFilterSelect({
    id,
    label,
    value,
    onValueChange,
    options,
    placeholder,
    noResultsLabel,
    size = 'default',
    leadingIcon,
    inlineEnd,
}: Props) {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const selectedLabel = useMemo(() => {
        if (!value) {
            return '';
        }

        return options.find((o) => o.value === value)?.label ?? '';
    }, [options, value]);

    useEffect(() => {
        setQuery('');
    }, [value]);

    const filtered = useMemo(() => {
        const q = foldForMatch(query.trim());
        if (!q) {
            return options;
        }
        return options.filter(
            (o) => foldForMatch(o.label).includes(q) || foldForMatch(o.value).includes(q),
        );
    }, [options, query]);

    const isLarge = size === 'large';
    const inputClass = cn(
        'border-input flex w-full min-w-0 border bg-background/90 outline-none transition-[color,box-shadow]',
        'placeholder:text-muted-foreground',
        'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
        'dark:bg-background/45',
        isLarge
            ? 'h-14 min-h-[3.5rem] rounded-xl px-4 py-3 text-base shadow-sm pr-12'
            : 'h-11 min-h-11 rounded-md px-3 py-2 pr-11 text-base shadow-xs sm:text-sm',
        leadingIcon && (isLarge ? 'pl-12' : 'pl-10'),
    );

    const optionClass = cn(
        'relative flex cursor-pointer select-none items-center px-3 py-2.5 text-sm text-foreground',
        'data-focus:bg-accent data-focus:text-accent-foreground',
        'data-selected:bg-brand/12 data-selected:font-medium data-selected:text-brand',
        'dark:data-selected:bg-sky-400/15 dark:data-selected:text-sky-100',
    );

    return (
        <Combobox
            value={value}
            onClose={() => setQuery('')}
            onChange={(next: string | null) => {
                if (next != null) {
                    onValueChange(next);
                    setQuery('');
                }
            }}
        >
            <div className={cn('space-y-1.5', isLarge && 'space-y-2')}>
                {label ? (
                    <Label
                        htmlFor={id}
                        className={cn(
                            'font-medium text-muted-foreground',
                            isLarge ? 'text-sm text-foreground' : 'text-xs',
                        )}
                    >
                        {label}
                    </Label>
                ) : null}
                <div
                    className={cn(
                        inlineEnd ? 'flex min-w-0 flex-row items-stretch gap-2 sm:gap-3' : 'block',
                    )}
                >
                    <div className={cn('relative', inlineEnd && 'min-w-0 flex-1')}>
                        {leadingIcon ? (
                            <span
                                className={cn(
                                    'pointer-events-none absolute top-1/2 z-10 -translate-y-1/2 text-muted-foreground',
                                    isLarge ? 'left-4' : 'left-3',
                                )}
                                aria-hidden
                            >
                                {leadingIcon}
                            </span>
                        ) : null}
                        <ComboboxInput
                            id={id}
                            className={inputClass}
                            displayValue={(v) => {
                                if (query !== '') {
                                    return query;
                                }

                                if (!v) {
                                    return '';
                                }

                                return options.find((o) => o.value === v)?.label ?? '';
                            }}
                            onChange={(e) => {
                                const raw = e.target.value;

                                if (!value) {
                                    setQuery(raw);
                                    return;
                                }

                                setQuery(extractTypedSearch(raw, selectedLabel));
                            }}
                            onFocus={(e) => {
                                setIsFocused(true);
                                const el = e.currentTarget;

                                if (!value) {
                                    setQuery('');
                                    return;
                                }

                                requestAnimationFrame(() => {
                                    try {
                                        el.setSelectionRange(0, el.value.length);
                                    } catch {
                                        //
                                    }
                                });
                            }}
                            onBlur={() => {
                                setIsFocused(false);
                            }}
                            placeholder={
                                !value && query === '' && !isFocused ? placeholder : undefined
                            }
                            autoComplete="off"
                        />
                        <ComboboxButton
                            type="button"
                            className={cn(
                                'absolute inset-y-0 right-0 flex items-center justify-center text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground',
                                isLarge ? 'w-12 rounded-r-xl' : 'w-11 rounded-r-md',
                            )}
                        >
                            <ChevronsUpDown className={cn('shrink-0 opacity-70', isLarge ? 'size-5' : 'size-4')} aria-hidden />
                        </ComboboxButton>

                        <ComboboxOptions
                            portal
                            modal={false}
                            anchor="bottom start"
                            transition
                            className={cn(
                                'z-[9999] mt-1 max-h-64 min-w-[var(--anchor-width)] overflow-y-auto overscroll-contain rounded-md border border-border bg-popover py-1 text-popover-foreground shadow-lg',
                                'origin-top transition duration-100 ease-out data-closed:scale-95 data-closed:opacity-0',
                            )}
                        >
                            {filtered.length === 0 ? (
                                <div className="px-3 py-2.5 text-sm text-muted-foreground">{noResultsLabel}</div>
                            ) : (
                                filtered.map((o) => (
                                    <ComboboxOption
                                        key={o.value === '' ? '__any__' : o.value}
                                        value={o.value}
                                        className={optionClass}
                                    >
                                        <span className="block min-w-0 truncate">{o.label}</span>
                                    </ComboboxOption>
                                ))
                            )}
                        </ComboboxOptions>
                    </div>
                    {inlineEnd ? (
                        <div className="flex shrink-0 items-center">{inlineEnd}</div>
                    ) : null}
                </div>
            </div>
        </Combobox>
    );
}
