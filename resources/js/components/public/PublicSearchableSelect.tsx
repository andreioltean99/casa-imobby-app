import { useIsMobile } from '@/hooks/use-mobile';
import { MobileFilterSelect } from '@/components/public/MobileFilterSelect';
import {
    SearchableFilterSelect,
    type SearchableFilterOption,
} from '@/components/public/SearchableFilterSelect';

type Props = {
    inputId: string;
    label?: string;
    value: string;
    onChange: (value: string) => void;
    options: SearchableFilterOption[];
    placeholder?: string;
    noOptionsMessage?: string;
    /** Enables clear / “any” option with this label. */
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
    const isMobile = useIsMobile();

    const selectOptions = options.filter((option) => option.value !== '');

    if (isMobile) {
        return (
            <MobileFilterSelect
                inputId={inputId}
                label={label}
                value={value}
                onChange={onChange}
                options={selectOptions}
                placeholder={placeholder ?? anyOptionLabel}
                noOptionsMessage={noOptionsMessage}
                clearLabel={anyOptionLabel}
            />
        );
    }

    return (
        <SearchableFilterSelect
            id={inputId}
            label={label}
            value={value}
            onValueChange={onChange}
            options={selectOptions}
            placeholder={placeholder ?? anyOptionLabel}
            noResultsLabel={noOptionsMessage}
        />
    );
}
