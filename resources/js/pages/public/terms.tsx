import { LegalPageShell } from '@/components/public/LegalPageShell';

type Props = {
    page: {
        title: string;
        body: string;
        updated_at?: string;
    };
};

export default function TermsPage({ page }: Props) {
    return <LegalPageShell page={page} />;
}
