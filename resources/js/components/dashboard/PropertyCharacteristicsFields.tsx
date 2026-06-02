import { useMemo } from 'react';
import Select from 'react-select';
import { useAdminT } from '@/hooks/use-admin-translations';
import { useAppearance } from '@/hooks/use-appearance';
import type { PropertyFilterOption } from '@/hooks/use-portfolio-form-options';
import {
    propertyFilterSelectStyles,
    type PropertyFilterSelectOption,
} from '@/components/dashboard/property-filter-select-styles';

export type PropertyFilterRow = { property_filter_id: string; value: string };

type Props = {
    rows: PropertyFilterRow[];
    onRowsChange: (rows: PropertyFilterRow[]) => void;
    options: PropertyFilterOption[];
    loading?: boolean;
    loadError?: string | null;
    onSelectFocus?: () => void;
};

export function PropertyCharacteristicsFields({
    rows,
    onRowsChange,
    options,
    loading = false,
    loadError = null,
    onSelectFocus,
}: Props) {
    const t = useAdminT();
    const { resolvedAppearance } = useAppearance();
    const isDark = resolvedAppearance === 'dark';
    const activeOptions = options.filter((f) => f.is_active);
    const selectOptions = useMemo<PropertyFilterSelectOption[]>(
        () =>
            activeOptions.map((filter) => ({
                value: String(filter.id),
                label: filter.label,
            })),
        [activeOptions],
    );
    const selectStyles = useMemo(() => propertyFilterSelectStyles(isDark), [isDark]);

    return (
        <div className="space-y-2 rounded-md border border-sidebar-border/70 bg-muted/20 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                    <label className="text-xs font-medium">{t('nav.property_filters')}</label>
                    {loading ? (
                        <span className="text-[11px] text-muted-foreground">
                            {t('portfolio.form.options_loading')}
                        </span>
                    ) : null}
                    {loadError ? (
                        <span className="text-[11px] text-amber-600 dark:text-amber-400">
                            {t('portfolio.form.options_load_failed')}
                        </span>
                    ) : null}
                </div>
                <button
                    type="button"
                    className="text-xs font-medium text-primary hover:underline"
                    onClick={() => onRowsChange([...rows, { property_filter_id: '', value: '' }])}
                >
                    {t('portfolio.form.add_row')}
                </button>
            </div>
            {rows.map((row, index) => (
                <div key={index} className="flex flex-wrap items-center gap-2">
                    <Select<PropertyFilterSelectOption, false>
                        className="min-w-[12rem] flex-1"
                        classNamePrefix="property-filter"
                        options={selectOptions}
                        value={
                            selectOptions.find((opt) => opt.value === row.property_filter_id) ??
                            null
                        }
                        onChange={(option) =>
                            onRowsChange(
                                rows.map((r, i) =>
                                    i === index
                                        ? { ...r, property_filter_id: option?.value ?? '' }
                                        : r,
                                ),
                            )
                        }
                        onMenuOpen={onSelectFocus}
                        isSearchable
                        isClearable
                        isDisabled={loading && activeOptions.length === 0}
                        placeholder={t('portfolio.form.choose_characteristic')}
                        noOptionsMessage={() => t('portfolio.form.no_characteristics_found')}
                        menuPortalTarget={
                            typeof document !== 'undefined' ? document.body : undefined
                        }
                        menuPosition="fixed"
                        styles={selectStyles}
                    />
                    <input
                        value={row.value}
                        onChange={(e) =>
                            onRowsChange(
                                rows.map((r, i) => (i === index ? { ...r, value: e.target.value } : r)),
                            )
                        }
                        placeholder={t('portfolio.form.placeholder_value')}
                        className="h-9 min-w-[8rem] flex-1 rounded-md border border-sidebar-border bg-background px-2 text-xs"
                    />
                    <button
                        type="button"
                        disabled={rows.length <= 1}
                        onClick={() => onRowsChange(rows.filter((_, i) => i !== index))}
                        className="h-9 rounded-md border border-sidebar-border px-2 text-xs text-muted-foreground disabled:opacity-40"
                    >
                        {t('common.remove')}
                    </button>
                </div>
            ))}
        </div>
    );
}
