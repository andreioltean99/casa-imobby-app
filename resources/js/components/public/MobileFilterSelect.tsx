import { useMemo, useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

export type MobileFilterOption = {
    value: string;
    label: string;
};

type Props = {
    inputId: string;
    label?: string;
    value: string;
    onChange: (value: string) => void;
    options: MobileFilterOption[];
    placeholder?: string;
    noOptionsMessage?: string;
    clearLabel?: string;
};

function foldForMatch(value: string): string {
    try {
        return value
            .normalize('NFD')
            .replace(/\p{M}/gu, '')
            .toLowerCase();
    } catch {
        return value.toLowerCase();
    }
}

export function MobileFilterSelect({
    inputId,
    label,
    value,
    onChange,
    options,
    placeholder,
    noOptionsMessage = 'No matching options',
    clearLabel,
}: Props) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');

    const filtered = useMemo(() => {
        const needle = foldForMatch(query.trim());
        if (!needle) {
            return options;
        }

        return options.filter(
            (option) =>
                foldForMatch(option.label).includes(needle) ||
                foldForMatch(option.value).includes(needle),
        );
    }, [options, query]);

    const selectedLabel = options.find((option) => option.value === value)?.label;

    const handleSelect = (next: string) => {
        onChange(next);
        setOpen(false);
        setQuery('');
    };

    const closeSheet = (nextOpen: boolean) => {
        setOpen(nextOpen);
        if (!nextOpen) {
            setQuery('');
        }
    };

    return (
        <div className="space-y-1.5">
            {label ? (
                <label
                    htmlFor={inputId}
                    className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"
                >
                    {label}
                </label>
            ) : null}
            <button
                id={inputId}
                type="button"
                onClick={() => setOpen(true)}
                className="flex h-11 w-full touch-manipulation items-center justify-between gap-2 rounded-md border border-border bg-background px-3 text-left text-base shadow-xs outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-brand"
                aria-haspopup="dialog"
                aria-expanded={open}
            >
                <span
                    className={cn(
                        'min-w-0 truncate',
                        !selectedLabel && 'text-muted-foreground',
                    )}
                >
                    {selectedLabel || placeholder}
                </span>
                <ChevronsUpDown className="size-4 shrink-0 opacity-60" aria-hidden />
            </button>
            <Sheet open={open} onOpenChange={closeSheet}>
                <SheetContent
                    side="bottom"
                    className="flex max-h-[min(88vh,720px)] flex-col gap-0 rounded-t-2xl p-0 [&>button]:top-3.5 [&>button]:right-3.5"
                >
                    <SheetHeader className="border-b border-border/70 px-4 py-4 pr-12 text-left">
                        <SheetTitle className="text-base font-semibold">
                            {label || placeholder || 'Selectează'}
                        </SheetTitle>
                    </SheetHeader>
                    <div className="border-b border-border/60 p-3">
                        <input
                            type="search"
                            enterKeyHint="search"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder={placeholder}
                            className="h-11 w-full rounded-md border border-border bg-background px-3 text-base outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-brand"
                            autoComplete="off"
                        />
                    </div>
                    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 py-2 pb-[max(1rem,env(safe-area-inset-bottom))]">
                        {clearLabel ? (
                            <button
                                type="button"
                                onClick={() => handleSelect('')}
                                className={cn(
                                    'mb-1 flex w-full touch-manipulation items-center justify-between rounded-lg px-3 py-3.5 text-left text-base',
                                    value === ''
                                        ? 'bg-brand/10 font-medium text-brand dark:bg-sky-400/15 dark:text-sky-100'
                                        : 'text-foreground hover:bg-muted/60',
                                )}
                            >
                                <span>{clearLabel}</span>
                                {value === '' ? (
                                    <Check className="size-4 shrink-0" aria-hidden />
                                ) : null}
                            </button>
                        ) : null}
                        {filtered.length === 0 ? (
                            <p className="px-3 py-4 text-sm text-muted-foreground">
                                {noOptionsMessage}
                            </p>
                        ) : (
                            filtered.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => handleSelect(option.value)}
                                    className={cn(
                                        'flex w-full touch-manipulation items-center justify-between rounded-lg px-3 py-3.5 text-left text-base',
                                        option.value === value
                                            ? 'bg-brand/10 font-medium text-brand dark:bg-sky-400/15 dark:text-sky-100'
                                            : 'text-foreground hover:bg-muted/60',
                                    )}
                                >
                                    <span className="min-w-0 truncate pr-2">
                                        {option.label}
                                    </span>
                                    {option.value === value ? (
                                        <Check className="size-4 shrink-0" aria-hidden />
                                    ) : null}
                                </button>
                            ))
                        )}
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
