import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { useAdminT } from '@/hooks/use-admin-translations';

const inputClass =
    'h-9 w-full rounded-md border border-sidebar-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary';

type Props = {
    idPrefix: string;
    nameRo: string;
    nameEn: string;
    onNameRoChange: (value: string) => void;
    onNameEnChange: (value: string) => void;
    errors?: {
        name_ro?: string;
        name_en?: string;
    };
    /** When editing, open English field if a translation already exists. */
    defaultShowEnglish?: boolean;
};

export function AdminLocalizedNameFields({
    idPrefix,
    nameRo,
    nameEn,
    onNameRoChange,
    onNameEnChange,
    errors,
    defaultShowEnglish,
}: Props) {
    const t = useAdminT();
    const [showEnglish, setShowEnglish] = useState(
        defaultShowEnglish ?? Boolean(nameEn.trim()),
    );

    const roId = `${idPrefix}_name_ro`;
    const enId = `${idPrefix}_name_en`;

    return (
        <div className="space-y-3">
            <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                    <label className="text-xs font-medium" htmlFor={roId}>
                        {t('common.name')} *
                    </label>
                    {!showEnglish ? (
                        <button
                            type="button"
                            onClick={() => setShowEnglish(true)}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-sidebar-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            title={t('common.add_english_name')}
                            aria-label={t('common.add_english_name')}
                        >
                            <Plus className="size-4" strokeWidth={2} />
                        </button>
                    ) : null}
                </div>
                <input
                    id={roId}
                    type="text"
                    value={nameRo}
                    onChange={(e) => onNameRoChange(e.target.value)}
                    className={inputClass}
                    required
                />
                {errors?.name_ro ? <p className="text-xs text-red-500">{errors.name_ro}</p> : null}
            </div>

            {showEnglish ? (
                <div className="space-y-1 rounded-lg border border-dashed border-sidebar-border/80 bg-muted/20 p-3">
                    <div className="flex items-center justify-between gap-2">
                        <label className="text-xs font-medium" htmlFor={enId}>
                            {t('common.name_english')}
                        </label>
                        <button
                            type="button"
                            onClick={() => {
                                onNameEnChange('');
                                setShowEnglish(false);
                            }}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-sidebar-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            title={t('common.remove_english_name')}
                            aria-label={t('common.remove_english_name')}
                        >
                            <Minus className="size-4" strokeWidth={2} />
                        </button>
                    </div>
                    <input
                        id={enId}
                        type="text"
                        value={nameEn}
                        onChange={(e) => onNameEnChange(e.target.value)}
                        className={inputClass}
                    />
                    {errors?.name_en ? <p className="text-xs text-red-500">{errors.name_en}</p> : null}
                </div>
            ) : null}
        </div>
    );
}

/** Primary label for lists (Romanian name). */
export function adminLocalizedPrimaryName(nameRo: string, nameEn: string): string {
    return nameRo.trim() || nameEn.trim();
}

type NameCellProps = {
    nameRo: string;
    nameEn: string;
};

export function AdminLocalizedNameCell({ nameRo, nameEn }: NameCellProps) {
    const primary = nameRo.trim() || nameEn.trim();
    const en = nameEn.trim();

    if (!primary) {
        return <span className="text-muted-foreground">—</span>;
    }

    return (
        <div className="min-w-0">
            <p className="truncate text-sm">{primary}</p>
            {en && nameRo.trim() ? (
                <p className="truncate text-[11px] text-muted-foreground">{en}</p>
            ) : null}
        </div>
    );
}
