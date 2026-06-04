import { usePage } from '@inertiajs/react';
import { Footer } from '@/components/public/Footer';
import { Header } from '@/components/public/Header';
import { LegalPageContent } from '@/components/public/LegalPageContent';
import { PublicSeoHead } from '@/components/public/PublicSeoHead';

type LegalPageData = {
    title: string;
    body: string;
    updated_at?: string;
};

type Props = {
    page: LegalPageData;
    canonicalPath: string;
};

export function LegalPageShell({ page, canonicalPath }: Props) {
    const { locale } = usePage().props as { locale?: string };
    const updatedLabel =
        locale === 'en' ? 'Last updated:' : 'Ultima actualizare:';
    const dateLocale = locale === 'en' ? 'en-GB' : 'ro-RO';

    return (
        <>
            <PublicSeoHead
                title={page.title}
                description={page.title}
                canonicalPath={canonicalPath}
            />
            <div className="min-h-screen bg-gradient-to-b from-background via-background to-neutral-50 text-foreground dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-900">
                <Header />

                <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10 sm:px-6 sm:py-16 lg:py-20">
                    <header className="space-y-2">
                        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                            {page.title}
                        </h1>
                        {page.updated_at ? (
                            <p className="text-xs text-muted-foreground">
                                {updatedLabel}{' '}
                                {new Date(page.updated_at).toLocaleDateString(dateLocale, {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                })}
                            </p>
                        ) : null}
                    </header>

                    <LegalPageContent content={page.body} />
                </main>

                <Footer />
            </div>
        </>
    );
}
