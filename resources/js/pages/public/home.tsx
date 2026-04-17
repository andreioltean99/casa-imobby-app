import { Head } from '@inertiajs/react';
import { Header } from '@/components/public/Header';
import { Hero } from '@/components/public/Hero';
import { EndToEndCard } from '@/components/public/EndToEndCard';
import { PortfolioSection, type PortfolioItemData } from '@/components/public/PortfolioSection';
import { TestimonialsSection, type TestimonialItem } from '@/components/public/TestimonialsSection';
import { AboutSection, type AboutData, type AboutItemData, type PrincipleItem } from '@/components/public/AboutSection';
import { ContactSection } from '@/components/public/ContactSection';
import { PropertySearchStrip } from '@/components/public/PropertySearchStrip';
import { LeadOfferModal } from '@/components/public/LeadOfferModal';
import { Footer } from '@/components/public/Footer';

type Props = {
    services?: ServiceItem[];
    testimonials?: TestimonialItem[];
    portfolioItems?: PortfolioItemData[];
    about?: AboutData | null;
    aboutItems?: AboutItemData[];
    principles?: PrincipleItem[];
};

export default function PublicHome({ testimonials, portfolioItems, about, aboutItems, principles }: Props) {
    return (
        <>
            <Head title="Casa Imobby – Agenție imobiliară" />
            <div className="min-h-screen bg-gradient-to-b from-background via-background to-neutral-50 text-foreground dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-900">
                <LeadOfferModal />
                <Header />

                <main className="mx-auto flex max-w-7xl flex-col gap-12 overflow-x-clip px-4 py-6 sm:gap-16 sm:px-6 sm:py-10 lg:gap-16 lg:py-12">
                    <section className="grid gap-8 md:grid-cols-[minmax(0,1.45fr)_minmax(0,0.95fr)] md:items-start md:gap-8">
                        <Hero />
                        <EndToEndCard />
                    </section>

                    <PropertySearchStrip />

                    <PortfolioSection portfolioItems={portfolioItems} showViewAll />

                    <TestimonialsSection testimonials={testimonials} />

                    <AboutSection about={about} aboutItems={aboutItems} principles={principles} />

                    <ContactSection />
                </main>

                <Footer />
            </div>
        </>
    );
}

