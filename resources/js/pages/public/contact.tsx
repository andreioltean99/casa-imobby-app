import { Head, usePage } from '@inertiajs/react';
import { ContactSection } from '@/components/public/ContactSection';
import { Footer } from '@/components/public/Footer';
import { Header } from '@/components/public/Header';

type PageProps = {
    translations?: any;
    contact?: any;
    contactHeroBgUrl?: string | null;
};

/**
 * Layout inspired by intelterm-app /contact: hero band under the nav, overlapping title card, then form + details + map.
 */
export default function PublicContactPage() {
    const page = usePage<PageProps>();
    const { translations, contact, contactHeroBgUrl } = page.props;
    const bgUrl = contactHeroBgUrl?.trim() ? contactHeroBgUrl : null;
    const tContact = translations?.contact ?? {};
    const c = contact ?? {};
    const tBrand = translations?.brand ?? {};
    const siteName = (tBrand.site_name as string | undefined) ?? 'Casa Imobby';

    const panelTitle =
        c.hero_panel_title ??
        tContact.hero_panel_title ??
        tContact.section_title ??
        c.section_title ??
        'Contact';
    const panelSubtitleRaw =
        c.hero_panel_subtitle ??
        tContact.hero_panel_subtitle ??
        tContact.section_body ??
        c.section_body ??
        '';
    const subtitleIsContactBodyHtml = Boolean(c.section_body && panelSubtitleRaw === c.section_body);
    const formIntro =
        tContact.form_section_intro ??
        'Please fill out the form below with your details or contact our office.';
    const serviceAreaNote =
        (c.service_area_note as string | undefined)?.trim() ||
        tContact.service_area_note ||
        '';

    return (
        <>
            <Head title={`${panelTitle} – ${siteName}`} />
            <div className="min-h-screen bg-gradient-to-b from-background via-background to-neutral-50 text-foreground dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-900">
                <Header />

                <main className="mx-auto mt-6 flex max-w-6xl flex-col px-4 pb-6 sm:px-6 sm:pb-8 lg:pb-10">
                    {serviceAreaNote ? (
                        <p className="mb-5 max-w-3xl text-pretty text-sm leading-relaxed text-muted-foreground sm:mb-6 sm:text-base">
                            {serviceAreaNote}
                        </p>
                    ) : null}
                    <ContactSection hideHeadingAndIntro formIntro={formIntro} />
                </main>

                <Footer />
            </div>
        </>
    );
}
