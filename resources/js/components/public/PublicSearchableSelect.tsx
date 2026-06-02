import { useMemo } from 'react';
import Select from 'react-select';
import { useAppearance } from '@/hooks/use-appearance';
import {
    propertyFilterSelectStyles,
    type PropertyFilterSelectOption,
} from '@/components/dashboard/property-filter-select-styles';

type Props = {
    inputId: string;
    label?: string;
    value: string;
    onChange: (value: string) => void;
    options: PropertyFilterSelectOption[];
    placeholder?: string;
    noOptionsMessage?: string;
    /** Enables clear (×) to reset to empty — maps to “any” filter. */
    anyOptionLabel?: string;
};

export function PublicSearchableSelect({
    inputId,
    label,
    value,
    onChange,
    options,
    placeholder,
    noOptionsMessage = 'No matching options',
    anyOptionLabel,
}: Props) {
    const { resolvedAppearance } = useAppearance();
    const isDark = resolvedAppearance === 'dark';

    const selectOptions = useMemo(
        () => options.filter((option) => option.value !== ''),
        [options],
    );

    const styles = useMemo(() => {
        const base = propertyFilterSelectStyles(isDark);

        return {
            ...base,
            menuPortal: (portalBase: object, state: Parameters<NonNullable<typeof base.menuPortal>>[1]) => ({
                ...(typeof base.menuPortal === 'function'
                    ? base.menuPortal(portalBase, state)
                    : portalBase),
                zIndex: 200,
            }),
            input: (inputBase: object, state: Parameters<NonNullable<typeof base.input>>[1]) => ({
                ...(typeof base.input === 'function' ? base.input(inputBase, state) : inputBase),
                gridArea: '1 / 1 / 2 / 3',
                minWidth: '2ch',
            }),
        };
    }, [isDark]);

    const selected = useMemo(
        () => selectOptions.find((option) => option.value === value) ?? null,
        [selectOptions, value],
    );

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
            <Select<PropertyFilterSelectOption, false>
                inputId={inputId}
                instanceId={inputId}
                className="text-xs"
                classNamePrefix="public-filter"
                options={selectOptions}
                value={selected}
                onChange={(option) => onChange(option?.value ?? '')}
                isSearchable
                isClearable={Boolean(anyOptionLabel)}
                placeholder={placeholder ?? anyOptionLabel}
                noOptionsMessage={() => noOptionsMessage}
                menuPortalTarget={typeof document !== 'undefined' ? document.body : undefined}
                menuPosition="fixed"
                styles={styles}
                openMenuOnClick
                openMenuOnFocus
                blurInputOnSelect
                closeMenuOnSelect
            />
        </div>
    );
}
