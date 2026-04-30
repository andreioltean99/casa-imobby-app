import { Head, Link, usePage } from '@inertiajs/react';
import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';
import { PROPERTIES_INDEX_PATH } from '@/lib/public-properties-path';

export default function PublicNotFound() {
    const { locale, translations } = usePage().props as {
        locale?: string;
        translations?: any;
    };

    const isEnglish = (locale ?? 'ro') === 'en';
    const tBrand = translations?.brand ?? {};
    const tNav = translations?.nav ?? {};

    return (
        <>
            <Head title={`404 - ${tBrand.site_name ?? 'Casa Imobby'}`} />
            <div className="min-h-screen bg-gradient-to-b from-background via-background to-neutral-50 text-foreground dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-900">
                <Header />

                <main className="mx-auto flex min-h-[70vh] max-w-6xl items-center overflow-x-clip px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
                    <section className="w-full rounded-2xl border border-border/70 bg-background/80 p-6 text-center shadow-sm sm:p-10 dark:bg-neutral-950/70">
                        <p className="text-5xl font-bold tracking-wide text-brand dark:text-sky-400 sm:text-7xl">
                            404
                        </p>
                        <h1 className="mt-4 text-2xl font-semibold sm:text-3xl">
                            {isEnglish ? 'Page not found' : 'Pagina nu a fost gasita'}
                        </h1>
                        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
                            {isEnglish
                                ? 'The page you are looking for no longer exists or the address is incorrect.'
                                : 'Linkul accesat nu mai exista sau adresa este gresita.'}
                        </p>

                        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                            <Link
                                href="/"
                                className="inline-flex items-center rounded-full bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand/90 dark:bg-sky-500 dark:hover:bg-sky-400"
                            >
                                {isEnglish ? 'Home' : 'Acasa'}
                            </Link>
                            <Link
                                href={PROPERTIES_INDEX_PATH}
                                className="inline-flex items-center rounded-full border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
                            >
                                {tNav.portfolio ?? (isEnglish ? 'Properties' : 'Proprietăți')}
                            </Link>
                        </div>
                    </section>
                </main>

                <Footer />
            </div>
        </>
    );
}
