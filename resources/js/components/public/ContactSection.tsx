import { useForm, usePage } from '@inertiajs/react';
import { MapPin } from 'lucide-react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';

type ContactSectionProps = {
    /** Heading / intro live in the overlapping hero on /contact instead of here. */
    hideHeadingAndIntro?: boolean;
    /** Line above the form (e.g. “Please fill out the form…”). */
    formIntro?: string | null;
};

export function ContactSection({ hideHeadingAndIntro = false, formIntro = null }: ContactSectionProps) {
    const { translations, contact, flash } = usePage().props as {
        translations?: any;
        contact?: any;
        flash?: { contact_submitted?: boolean };
    };
    const tContact = translations?.contact ?? {};
    const tBrand = translations?.brand ?? {};
    const c = contact ?? {};
    const siteName = ((tBrand.site_name as string | undefined) ?? 'Casa Imobby').trim() || 'Casa Imobby';
    const defaultAddressSingle = 'Cluj-Napoca, România';
    const addressLines = (() => {
        const raw = (c.address ?? '').toString().trim();
        if (!raw) {
            return [defaultAddressSingle];
        }
        return raw
            .split('\n')
            .map((s: string) => s.trim())
            .filter(Boolean);
    })();
    const addressForMap = addressLines.join(', ');
    const mapSrc = addressForMap
        ? `https://www.google.com/maps?q=${encodeURIComponent(addressForMap)}&output=embed`
        : null;
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addressForMap)}`;
    const emailDisplay = (c.email ?? 'office@casa-imobby.ro').toString().trim();
    const mailtoHref = `mailto:${emailDisplay}`;
    const defaultPersonName = 'Ploscar Gheorghe Dumitru';
    const defaultPhone = '0741634486';
    const personName =
        ((c.contact_person_name as string | undefined) ?? '').toString().trim() || defaultPersonName;
    const phoneRaw = ((c.phone as string | undefined) ?? '').toString().trim() || defaultPhone;
    const phoneDisplay = formatPhoneDisplay(phoneRaw);
    const telHref = `tel:${phoneRaw.replace(/\s/g, '')}`;
    const personPhotoUrl = (c.contact_person_photo_url as string | null | undefined) ?? null;
    /** Shipped portrait when no photo is set in dashboard. */
    const defaultPersonPhotoSrc = '/contact-person-default.webp';
    const avatarPhotoSrc = personPhotoUrl ?? defaultPersonPhotoSrc;

    const cardClass =
        'rounded-xl bg-card p-5 shadow-[0_4px_24px_rgba(0,0,0,0.07)] ring-1 ring-border/70 sm:p-6 dark:shadow-[0_4px_24px_rgba(0,0,0,0.35)] dark:ring-border/60';
    const inputClassCard =
        'h-9 rounded-md border border-input bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:bg-background';

    const landingInputClass =
        'h-11 rounded-lg border border-border bg-background px-4 text-base outline-none ring-offset-background transition-[box-shadow,border-color] focus-visible:border-brand/40 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:ring-offset-2 dark:bg-background';
    const landingTextareaClass =
        'min-h-[140px] rounded-lg border border-border bg-background px-4 py-3 text-base outline-none ring-offset-background transition-[box-shadow,border-color] focus-visible:border-brand/40 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:ring-offset-2 dark:bg-background';

    const form = useForm({
        first_name: '',
        last_name: '',
        email: '',
        message: '',
        source: hideHeadingAndIntro ? 'contact' : 'home',
    });

    const submitContact = (e: FormEvent) => {
        e.preventDefault();
        form.post('/contact-messages', {
            preserveScroll: true,
            onSuccess: () => form.reset('first_name', 'last_name', 'email', 'message'),
        });
    };

    const showSuccess = Boolean(flash?.contact_submitted);
    const requiredMark = hideHeadingAndIntro;

    /** Landing home: gradient panel — larger form + logo (no street address on home). */
    if (!hideHeadingAndIntro) {
        return (
            <section
                id="contact"
                className="grid gap-10 rounded-2xl border border-border/70 bg-gradient-to-r from-brand-soft via-background to-brand-accent-soft p-6 shadow-sm sm:gap-12 sm:p-9 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,0.95fr)] lg:p-10 dark:from-brand/15 dark:via-neutral-950 dark:to-brand-accent/10"
            >
                <div className="min-w-0 space-y-5">
                    <div>
                        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                            {c.section_title ?? tContact.section_title ?? 'Get in touch today'}
                        </h2>
                        {c.section_body ? (
                            <div
                                className="mt-3 text-base leading-relaxed text-muted-foreground [&_a]:text-brand [&_a]:underline"
                                dangerouslySetInnerHTML={{ __html: c.section_body }}
                            />
                        ) : (
                            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                                {tContact.section_body ??
                                    'We are looking forward to discussing your project. Share a few details and our team will get back to you with next steps.'}
                            </p>
                        )}
                    </div>
                    <div className="rounded-xl border border-border/70 bg-background/70 p-5 shadow-sm ring-1 ring-black/[0.03] sm:p-7 dark:bg-background/45 dark:ring-white/[0.04]">
                        {showSuccess ? (
                            <p className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-900 dark:text-emerald-100">
                                {tContact.form?.success ??
                                    'Thank you! Your message was received. We will get back to you soon.'}
                            </p>
                        ) : null}
                        <form className="grid gap-4 sm:grid-cols-2" onSubmit={submitContact}>
                            <LandingField label={tContact.form?.first_name ?? 'First name'}>
                                <input
                                    type="text"
                                    required
                                    className={landingInputClass}
                                    placeholder={tContact.form?.first_name_placeholder ?? 'Alex'}
                                    value={form.data.first_name}
                                    onChange={(e) => form.setData('first_name', e.target.value)}
                                />
                                {form.errors.first_name ? (
                                    <p className="text-xs text-destructive">{form.errors.first_name}</p>
                                ) : null}
                            </LandingField>
                            <LandingField label={tContact.form?.last_name ?? 'Last name'}>
                                <input
                                    type="text"
                                    required
                                    className={landingInputClass}
                                    placeholder={tContact.form?.last_name_placeholder ?? 'Popescu'}
                                    value={form.data.last_name}
                                    onChange={(e) => form.setData('last_name', e.target.value)}
                                />
                                {form.errors.last_name ? (
                                    <p className="text-xs text-destructive">{form.errors.last_name}</p>
                                ) : null}
                            </LandingField>
                            <LandingField label={tContact.form?.email ?? 'Email'}>
                                <input
                                    type="email"
                                    required
                                    className={landingInputClass}
                                    placeholder={tContact.form?.email_placeholder ?? 'you@example.com'}
                                    value={form.data.email}
                                    onChange={(e) => form.setData('email', e.target.value)}
                                />
                                {form.errors.email ? (
                                    <p className="text-xs text-destructive">{form.errors.email}</p>
                                ) : null}
                            </LandingField>
                            <LandingField label={tContact.form?.message ?? 'Message'} className="sm:col-span-2">
                                <textarea
                                    required
                                    className={landingTextareaClass}
                                    placeholder={
                                        tContact.form?.message_placeholder ??
                                        'Tell us about your project, current challenges and timelines.'
                                    }
                                    value={form.data.message}
                                    onChange={(e) => form.setData('message', e.target.value)}
                                />
                                {form.errors.message ? (
                                    <p className="text-xs text-destructive">{form.errors.message}</p>
                                ) : null}
                            </LandingField>
                            <div className="sm:col-span-2 pt-1">
                                <Button
                                    type="submit"
                                    size="lg"
                                    disabled={form.processing}
                                    className="w-full min-h-11 text-base sm:w-auto sm:min-w-[10rem]"
                                >
                                    {form.processing
                                        ? (tContact.form?.submitting ?? 'Sending…')
                                        : (tContact.form?.submit ?? 'Submit')}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="flex min-w-0 flex-col items-center gap-6 text-sm lg:pt-1">
                    <h3 className="w-full text-center text-base font-semibold tracking-tight sm:text-lg">
                        {c.contact_details_title ?? tContact.contact_details_title ?? 'Contact details'}
                    </h3>
                    <div className="flex w-full justify-center px-2">
                        <img
                            src="/logo-casa-imobby-contact.png"
                            alt={siteName}
                            className="h-auto max-h-40 w-auto max-w-[min(100%,18rem)] object-contain object-center opacity-[0.98] sm:max-h-48 lg:max-h-52"
                            width={280}
                            height={150}
                            decoding="async"
                        />
                    </div>
                    <div className="flex w-full max-w-md flex-row items-center justify-center gap-3 px-1">
                        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border/50 bg-muted/25 shadow-sm dark:bg-muted/20">
                            <img
                                src={avatarPhotoSrc}
                                alt={personName}
                                className="h-full w-full object-cover object-center"
                            />
                        </div>
                        <p className="min-w-0 flex-1 text-left text-base font-semibold leading-snug tracking-tight text-foreground sm:text-lg">
                            {personName}
                        </p>
                    </div>
                    <div className="w-full max-w-md rounded-xl border border-border/80 bg-background px-4 py-4 text-left shadow-sm ring-1 ring-black/[0.04] dark:border-border dark:bg-card dark:ring-white/[0.06]">
                        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                            <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                                {tContact.phone_heading ?? 'Tel.'}:
                            </span>
                            <a
                                href={telHref}
                                className="min-w-0 text-[15px] font-semibold text-brand underline-offset-2 hover:underline sm:text-base dark:text-sky-300"
                            >
                                {phoneDisplay}
                            </a>
                        </div>
                        <div className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-0.5 border-t border-border/60 pt-4">
                            <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                                {tContact.email_heading ?? 'Email'}:
                            </span>
                            <a
                                href={c.email ? `mailto:${c.email}` : 'mailto:office@casa-imobby.ro'}
                                className="min-w-0 break-words text-[15px] font-medium text-foreground underline decoration-brand/50 decoration-1 underline-offset-2 transition-colors hover:text-brand dark:text-sky-100 dark:hover:text-sky-300"
                            >
                                {c.email ?? 'office@casa-imobby.ro'}
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    /** Dedicated /contact page: card layout + directions + full-width map. */
    return (
        <section id="contact" className="flex flex-col gap-6 sm:gap-8">
            <div className="grid gap-6 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] sm:gap-8">
                <div className="space-y-4">
                    <div className={cardClass}>
                        {formIntro ? (
                            <p className="mb-4 text-center text-sm text-muted-foreground sm:text-left">{formIntro}</p>
                        ) : null}
                        {showSuccess ? (
                            <p className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-900 dark:text-emerald-100">
                                {tContact.form?.success ??
                                    'Thank you! Your message was received. We will get back to you soon.'}
                            </p>
                        ) : null}
                        <form className="grid gap-3 text-sm sm:grid-cols-2" onSubmit={submitContact}>
                            <Field
                                label={`${tContact.form?.first_name ?? 'First name'}${requiredMark ? ' *' : ''}`}
                            >
                                <input
                                    type="text"
                                    required
                                    className={inputClassCard}
                                    placeholder={tContact.form?.first_name_placeholder ?? 'Alex'}
                                    value={form.data.first_name}
                                    onChange={(e) => form.setData('first_name', e.target.value)}
                                />
                                {form.errors.first_name ? (
                                    <p className="text-xs text-destructive">{form.errors.first_name}</p>
                                ) : null}
                            </Field>
                            <Field
                                label={`${tContact.form?.last_name ?? 'Last name'}${requiredMark ? ' *' : ''}`}
                            >
                                <input
                                    type="text"
                                    required
                                    className={inputClassCard}
                                    placeholder={tContact.form?.last_name_placeholder ?? 'Popescu'}
                                    value={form.data.last_name}
                                    onChange={(e) => form.setData('last_name', e.target.value)}
                                />
                                {form.errors.last_name ? (
                                    <p className="text-xs text-destructive">{form.errors.last_name}</p>
                                ) : null}
                            </Field>
                            <Field label={`${tContact.form?.email ?? 'Email'}${requiredMark ? ' *' : ''}`}>
                                <input
                                    type="email"
                                    required
                                    className={inputClassCard}
                                    placeholder={tContact.form?.email_placeholder ?? 'you@example.com'}
                                    value={form.data.email}
                                    onChange={(e) => form.setData('email', e.target.value)}
                                />
                                {form.errors.email ? (
                                    <p className="text-xs text-destructive">{form.errors.email}</p>
                                ) : null}
                            </Field>
                            <Field
                                label={`${tContact.form?.message ?? 'Message'}${requiredMark ? ' *' : ''}`}
                                className="sm:col-span-2"
                            >
                                <textarea
                                    required
                                    className="min-h-[96px] rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:bg-background"
                                    placeholder={
                                        tContact.form?.message_placeholder ??
                                        'Tell us about your project, current challenges and timelines.'
                                    }
                                    value={form.data.message}
                                    onChange={(e) => form.setData('message', e.target.value)}
                                />
                                {form.errors.message ? (
                                    <p className="text-xs text-destructive">{form.errors.message}</p>
                                ) : null}
                            </Field>
                            <div className="sm:col-span-2">
                                <Button type="submit" disabled={form.processing} className="w-full sm:w-auto">
                                    {form.processing
                                        ? (tContact.form?.submitting ?? 'Sending…')
                                        : (tContact.form?.submit ?? 'Submit')}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
                <aside className={`flex h-full flex-col ${cardClass}`}>
                    <h3 className="border-b border-border pb-3 font-serif text-base font-bold tracking-tight text-foreground">
                        {c.contact_details_title ?? tContact.contact_details_title ?? 'Contact details'}
                    </h3>
                    <div className="mt-5 flex flex-1 flex-col items-center gap-5 sm:items-stretch">
                        <div className="flex w-full justify-center">
                            <img
                                src="/logo-casa-imobby-contact.png"
                                alt={siteName}
                                className="h-auto max-h-28 w-auto max-w-full object-contain opacity-[0.98] sm:max-h-32"
                                width={240}
                                height={132}
                                decoding="async"
                            />
                        </div>
                        <div className="flex w-full max-w-sm flex-row items-center justify-center gap-3 self-center sm:max-w-none sm:justify-start">
                            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted/30 shadow-sm dark:bg-muted/20">
                                <img
                                    src={avatarPhotoSrc}
                                    alt={personName}
                                    className="h-full w-full object-cover object-center"
                                />
                            </div>
                            <p className="min-w-0 flex-1 text-left text-[15px] font-semibold leading-snug text-foreground sm:text-base">
                                {personName}
                            </p>
                        </div>
                        <div className="w-full rounded-xl border border-border/80 bg-background px-4 py-4 text-left shadow-sm dark:bg-background/95">
                            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                                <span className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                                    {tContact.phone_heading ?? 'Tel.'}:
                                </span>
                                <a
                                    href={telHref}
                                    className="text-[15px] font-semibold text-brand underline-offset-2 hover:underline dark:text-sky-300"
                                >
                                    {phoneDisplay}
                                </a>
                            </div>
                            <div className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-0.5 border-t border-border/60 pt-4">
                                <span className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                                    {tContact.email_heading ?? 'Email'}:
                                </span>
                                <a
                                    href={mailtoHref}
                                    className="min-w-0 break-words text-[15px] font-medium text-foreground underline decoration-brand/50 decoration-1 underline-offset-2 transition-colors hover:text-brand dark:hover:text-sky-300"
                                >
                                    {emailDisplay}
                                </a>
                            </div>
                        </div>
                        <div className="w-full border-t border-border pt-5">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                                {tContact.address_heading ?? 'Address'}
                            </p>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                {addressLines.map((line: string, idx: number) => (
                                    <span key={`${idx}-${line}`}>
                                        {line}
                                        {idx < addressLines.length - 1 ? <br /> : null}
                                    </span>
                                ))}
                            </p>
                            <Button
                                asChild
                                variant="outline"
                                className="mt-4 h-10 w-full gap-2 rounded-md border-border bg-background text-sm font-semibold shadow-sm hover:bg-muted/60 sm:w-auto dark:hover:bg-muted/30"
                            >
                                <a
                                    href={directionsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={
                                        tContact.get_directions_aria ??
                                        'Open Google Maps directions to our office'
                                    }
                                >
                                    <MapPin className="size-4 shrink-0 text-brand" strokeWidth={2} aria-hidden />
                                    {tContact.get_directions ?? 'Get directions'}
                                </a>
                            </Button>
                        </div>
                    </div>
                </aside>
            </div>

            <div className="h-48 w-full overflow-hidden rounded-lg border border-border bg-muted/30 text-xs text-muted-foreground shadow-sm sm:h-56 md:h-64 md:rounded-xl dark:bg-muted/20">
                <iframe
                    title="Map"
                    className="h-full w-full"
                    src={mapSrc ?? `https://www.google.com/maps?q=${encodeURIComponent(defaultAddressSingle)}&output=embed`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                />
            </div>
        </section>
    );
}

function formatPhoneDisplay(phone: string): string {
    const normalized = phone.replace(/\s+/g, '');
    if (/^\d{10}$/.test(normalized)) {
        return `${normalized.slice(0, 4)} ${normalized.slice(4, 7)} ${normalized.slice(7)}`;
    }

    return phone;
}

type LandingFieldProps = {
    label: string;
    className?: string;
    children: React.ReactNode;
};

function LandingField({ label, className, children }: LandingFieldProps) {
    return (
        <div className={`flex flex-col gap-1.5 ${className || ''}`}>
            <label className="text-sm font-medium text-muted-foreground">{label}</label>
            {children}
        </div>
    );
}

type FieldProps = {
    label: string;
    className?: string;
    children: React.ReactNode;
};

function Field({ label, className, children }: FieldProps) {
    return (
        <div className={`flex flex-col gap-1 ${className || ''}`}>
            <label className="text-xs font-medium text-muted-foreground">{label}</label>
            {children}
        </div>
    );
}
