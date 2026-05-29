import { PublicSeoHead } from '@/components/public/PublicSeoHead';
import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';

type Props = {
    page: {
        title: string;
        body: string;
        updated_at?: string;
    };
};

export default function PrivacyPage({ page }: Props) {
    return (
        <>
            <PublicSeoHead title={page.title} description={page.title} />
            <div className="min-h-screen bg-gradient-to-b from-background via-background to-neutral-50 text-foreground dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-900">
                <Header />

                <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10 sm:px-6 sm:py-16 lg:py-20">
                    <header className="space-y-2">
                        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                            {page.title}
                        </h1>
                        {page.updated_at && (
                            <p className="text-xs text-muted-foreground">
                                Ultima actualizare: {new Date(page.updated_at).toLocaleDateString()}
                            </p>
                        )}
                    </header>

                    <article
                        className="prose prose-sm max-w-none text-sm text-muted-foreground dark:prose-invert sm:prose-base"
                        dangerouslySetInnerHTML={{ __html: page.body }}
                    />
                </main>

                <Footer />
            </div>
        </>
    );
}

