import { Head, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Header } from '@/components/public/Header';
import { PortfolioSection, type PortfolioItemData } from '@/components/public/PortfolioSection';
import { Footer } from '@/components/public/Footer';

type Props = {
    portfolioItems?: PortfolioItemData[];
};

export default function PortfolioPage({ portfolioItems }: Props) {
    const { props } = usePage<{ translations?: Record<string, unknown> }>();
    const backLabel = (props.translations?.common as Record<string, string> | undefined)?.back ?? 'Back';
    const tPortfolio = (props.translations?.portfolio as Record<string, string> | undefined) ?? {};

    const pageTitle = `${tPortfolio.section_title ?? 'Units'} – Casa Imobby`;

    return (
        <>
            <Head title={pageTitle} />
            <div className="min-h-screen bg-gradient-to-b from-background via-background to-neutral-50 text-foreground dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-900">
                <Header />

                <main className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-10 sm:px-6 sm:py-16 lg:py-20">
                    <div className="flex items-center">
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground"
                            aria-label={backLabel}
                        >
                            <ArrowLeft className="h-4 w-4" />
                            {backLabel}
                        </button>
                    </div>

                    <section className="space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent dark:text-emerald-400">
                            {tPortfolio.page_kicker ?? tPortfolio.section_title ?? 'Units'}
                        </p>
                        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                            {tPortfolio.section_title ?? 'Available units'}
                        </h1>
                        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
                            {tPortfolio.section_body ??
                                'Browse the units we represent and open any card for the full listing page.'}
                        </p>
                    </section>

                    <PortfolioSection portfolioItems={portfolioItems} showViewAll={false} />
                </main>

                <Footer />
            </div>
        </>
    );
}
