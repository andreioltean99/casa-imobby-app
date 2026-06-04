import { Link, usePage } from '@inertiajs/react';
import { Header } from '@/components/public/Header';
import { Hero } from '@/components/public/Hero';
import { EndToEndCard } from '@/components/public/EndToEndCard';
import {
    HomePortfolioCategories,
    type PortfolioCategoryBlock,
} from '@/components/public/HomePortfolioCategories';
import {
    TestimonialsSection,
    type TestimonialItem,
} from '@/components/public/TestimonialsSection';
import {
    AboutSection,
    type AboutData,
    type AboutItemData,
    type PrincipleItem,
} from '@/components/public/AboutSection';
import { ContactSection } from '@/components/public/ContactSection';
import { PropertySearchStrip } from '@/components/public/PropertySearchStrip';
import { LeadOfferModal } from '@/components/public/LeadOfferModal';
import { Footer } from '@/components/public/Footer';
import { PublicSeoHead } from '@/components/public/PublicSeoHead';
import { PROPERTIES_INDEX_PATH } from '@/lib/public-properties-path';
import { resolveAppOrigin } from '@/lib/site-origin';

type Props = {
    showTestimonialsSection?: boolean;
    testimonials?: TestimonialItem[];
    portfolioCategoryBlocks?: PortfolioCategoryBlock[];
    listingCategoryTitles?: Record<string, string>;
    about?: AboutData | null;
    aboutItems?: AboutItemData[];
    principles?: PrincipleItem[];
};

export default function PublicHome({
    showTestimonialsSection = false,
    testimonials,
    portfolioCategoryBlocks,
    listingCategoryTitles,
    about,
    aboutItems,
    principles,
}: Props) {
    const { props } = usePage<{
        translations?: Record<string, unknown>;
        appUrl?: string;
    }>();
    const tPortfolio =
        (props.translations?.portfolio as Record<string, string> | undefined) ??
        {};
    const viewAllLabel = tPortfolio.view_all ?? 'View full unit list';
    const appUrl = resolveAppOrigin(props.appUrl);

    return (
        <>
            <PublicSeoHead
                title="Casa Imobby – Agenție imobiliară"
                description="Casa Imobby te ajută să cumperi, vinzi sau închiriezi proprietăți în Cluj-Napoca și împrejurimi. Vezi oferte, filtrează proprietăți și cere consultanță."
                canonicalPath="/"
                jsonLd={[
                    {
                        '@context': 'https://schema.org',
                        '@type': 'RealEstateAgent',
                        name: 'Casa Imobby',
                        url: `${appUrl}/`,
                    },
                    {
                        '@context': 'https://schema.org',
                        '@type': 'WebSite',
                        name: 'Casa Imobby',
                        url: `${appUrl}/`,
                        potentialAction: {
                            '@type': 'SearchAction',
                            target: `${appUrl}/proprietati?q={search_term_string}`,
                            'query-input': 'required name=search_term_string',
                        },
                    },
                ]}
            />
            <div className="min-h-screen bg-gradient-to-b from-background via-background to-neutral-50 text-foreground dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-900">
                <LeadOfferModal />
                <Header />

                <main className="mx-auto flex max-w-7xl flex-col gap-12 overflow-x-clip px-4 py-6 sm:gap-16 sm:px-6 sm:py-10 lg:gap-16 lg:py-12">
                    <section className="grid gap-8 md:grid-cols-[minmax(0,1.45fr)_minmax(0,0.95fr)] md:items-start md:gap-8">
                        <Hero />
                        <EndToEndCard />
                    </section>

                    <PropertySearchStrip />

                    <HomePortfolioCategories
                        blocks={portfolioCategoryBlocks ?? []}
                        categoryTitles={listingCategoryTitles}
                    />

                    <div className="flex justify-center pt-2">
                        <Link
                            href={PROPERTIES_INDEX_PATH}
                            className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                        >
                            {viewAllLabel}
                        </Link>
                    </div>

                    {showTestimonialsSection ? (
                        <TestimonialsSection testimonials={testimonials} />
                    ) : null}

                    <AboutSection
                        about={about}
                        aboutItems={aboutItems}
                        principles={principles}
                    />

                    <ContactSection />
                </main>

                <Footer />
            </div>
        </>
    );
}
