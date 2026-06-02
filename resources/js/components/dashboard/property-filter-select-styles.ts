import type { GroupBase, StylesConfig } from 'react-select';

export type PropertyFilterSelectOption = {
    value: string;
    label: string;
};

function cssVar(name: string, fallback: string): string {
    if (typeof document === 'undefined') {
        return fallback;
    }

    const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();

    return value || fallback;
}

export function propertyFilterSelectStyles(
    isDark: boolean,
): StylesConfig<PropertyFilterSelectOption, false, GroupBase<PropertyFilterSelectOption>> {
    const background = cssVar('--background', isDark ? '#0a0a0a' : '#ffffff');
    const foreground = cssVar('--foreground', isDark ? '#fafafa' : '#0a0a0a');
    const border = cssVar('--sidebar-border', isDark ? '#27272a' : '#e4e4e7');
    const muted = cssVar('--muted-foreground', isDark ? '#a1a1aa' : '#71717a');
    const primary = cssVar('--primary', '#1d5e9b');
    const accent = cssVar('--accent', isDark ? '#27272a' : '#f4f4f5');

    return {
        control: (base, state) => ({
            ...base,
            minHeight: '2.25rem',
            fontSize: '0.75rem',
            backgroundColor: background,
            borderColor: state.isFocused ? primary : border,
            boxShadow: state.isFocused ? `0 0 0 1px ${primary}` : 'none',
            '&:hover': {
                borderColor: state.isFocused ? primary : border,
            },
        }),
        valueContainer: (base) => ({
            ...base,
            padding: '0 0.5rem',
        }),
        input: (base) => ({
            ...base,
            margin: 0,
            padding: 0,
            color: foreground,
        }),
        singleValue: (base) => ({
            ...base,
            color: foreground,
        }),
        placeholder: (base) => ({
            ...base,
            color: muted,
        }),
        menuPortal: (base) => ({
            ...base,
            zIndex: 50,
        }),
        menu: (base) => ({
            ...base,
            backgroundColor: background,
            border: `1px solid ${border}`,
            fontSize: '0.75rem',
            overflow: 'hidden',
        }),
        menuList: (base) => ({
            ...base,
            padding: '0.25rem',
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected ? primary : state.isFocused ? accent : background,
            color: state.isSelected ? '#ffffff' : foreground,
            cursor: 'pointer',
            borderRadius: '0.25rem',
        }),
        indicatorSeparator: () => ({
            display: 'none',
        }),
        dropdownIndicator: (base) => ({
            ...base,
            color: muted,
            padding: '0 0.35rem',
        }),
        clearIndicator: (base) => ({
            ...base,
            color: muted,
            padding: '0 0.35rem',
        }),
    };
}
