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
    const selectOptions = options.filter((option) => option.value !== '');

    const mobile = (
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

    const desktop = (
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

    return (
        <>
            <div className="md:hidden">{mobile}</div>
            <div className="hidden md:block">{desktop}</div>
        </>
    );
}
