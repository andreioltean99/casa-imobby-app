import { useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const STORAGE_KEY = 'casa_imobby_lead_offer_modal_v1';
const AUTO_OPEN_DELAY_MS = 60_000;

/** Dispatched to open the lead offer dialog from anywhere (e.g. hero CTA). */
export const OPEN_LEAD_OFFER_MODAL_EVENT = 'casa-imobby:open-lead-offer-modal';

export function openLeadOfferModal(): void {
    if (typeof window === 'undefined') {
        return;
    }
    window.dispatchEvent(new Event(OPEN_LEAD_OFFER_MODAL_EVENT));
}

function markSeen(): void {
    try {
        localStorage.setItem(STORAGE_KEY, '1');
    } catch {
        //
    }
}

function hasSeen(): boolean {
    try {
        return Boolean(localStorage.getItem(STORAGE_KEY));
    } catch {
        return true;
    }
}

type LeadModalCopy = {
    title: string;
    subtitle: string;
    full_name_label: string;
    full_name_placeholder: string;
    phone_label: string;
    phone_placeholder: string;
    email_label: string;
    email_placeholder: string;
    budget_label: string;
    budget_placeholder: string;
    newsletter_label: string;
    terms_intro: string;
    terms_link_terms: string;
    terms_mid: string;
    terms_link_privacy: string;
    terms_outro: string;
    submit: string;
    submitting: string;
    close: string;
};

const defaultCopy: LeadModalCopy = {
    title: 'Interested in a Casa Imobby offer?',
    subtitle: 'Leave us your contact details and we will help you choose the right property.',
    full_name_label: 'Full name',
    full_name_placeholder: 'First and last name',
    phone_label: 'Phone',
    phone_placeholder: 'e.g. +40 7xx xxx xxx',
    email_label: 'Email',
    email_placeholder: 'you@example.com',
    budget_label: 'Budget (€)',
    budget_placeholder: 'e.g. 80,000',
    newsletter_label: 'I want to receive news, market insights and property offers.',
    terms_intro: 'I agree to the ',
    terms_link_terms: 'terms of service',
    terms_mid: ' and the ',
    terms_link_privacy: 'privacy policy',
    terms_outro: ' regarding the processing of personal data.',
    submit: 'Send',
    submitting: 'Sending…',
    close: 'Close',
};

export function LeadOfferModal() {
    const page = usePage();
    const raw = (page.props as { translations?: { lead_modal?: Partial<LeadModalCopy> } }).translations?.lead_modal;
    const t = { ...defaultCopy, ...raw };

    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (hasSeen()) {
            return;
        }
        const id = window.setTimeout(() => setOpen(true), AUTO_OPEN_DELAY_MS);
        return () => window.clearTimeout(id);
    }, []);

    useEffect(() => {
        const onOpenRequest = () => setOpen(true);
        window.addEventListener(OPEN_LEAD_OFFER_MODAL_EVENT, onOpenRequest);
        return () => window.removeEventListener(OPEN_LEAD_OFFER_MODAL_EVENT, onOpenRequest);
    }, []);

    const form = useForm({
        full_name: '',
        phone: '',
        email: '',
        budget: '',
        newsletter: false,
        terms_accepted: false,
    });

    const handleOpenChange = (next: boolean) => {
        if (!next) {
            markSeen();
        }
        setOpen(next);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.transform((data) => ({
            ...data,
            newsletter: Boolean(data.newsletter),
            terms_accepted: Boolean(data.terms_accepted),
        }));
        form.post('/lead-offers', {
            preserveScroll: true,
            onSuccess: () => {
                markSeen();
                setOpen(false);
                form.reset();
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent
                className={cn(
                    'max-h-[min(90vh,720px)] gap-0 overflow-y-auto p-0 sm:max-w-xl',
                    '[&>button]:text-muted-foreground [&>button]:hover:text-foreground',
                )}
            >
                <form onSubmit={submit} className="flex flex-col">
                    <DialogHeader className="space-y-2 border-b border-border/60 px-5 pb-4 pt-5 text-left sm:px-6 sm:pt-6">
                        <DialogTitle className="text-balance pr-8 text-lg sm:text-xl">{t.title}</DialogTitle>
                        <DialogDescription className="text-left text-sm leading-relaxed">
                            {t.subtitle}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 px-5 py-4 sm:grid-cols-2 sm:gap-4 sm:px-6">
                        <div className="space-y-1.5 sm:col-span-2">
                            <Label htmlFor="lead-full-name" className="text-xs font-medium">
                                {t.full_name_label}
                            </Label>
                            <Input
                                id="lead-full-name"
                                value={form.data.full_name}
                                onChange={(e) => form.setData('full_name', e.target.value)}
                                placeholder={t.full_name_placeholder}
                                autoComplete="name"
                                className="h-10"
                                required
                            />
                            {form.errors.full_name && (
                                <p className="text-xs text-destructive">{form.errors.full_name}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="lead-phone" className="text-xs font-medium">
                                {t.phone_label}
                            </Label>
                            <Input
                                id="lead-phone"
                                type="tel"
                                value={form.data.phone}
                                onChange={(e) => form.setData('phone', e.target.value)}
                                placeholder={t.phone_placeholder}
                                autoComplete="tel"
                                className="h-10"
                                required
                            />
                            {form.errors.phone && <p className="text-xs text-destructive">{form.errors.phone}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="lead-email" className="text-xs font-medium">
                                {t.email_label}
                            </Label>
                            <Input
                                id="lead-email"
                                type="email"
                                value={form.data.email}
                                onChange={(e) => form.setData('email', e.target.value)}
                                placeholder={t.email_placeholder}
                                autoComplete="email"
                                className="h-10"
                                required
                            />
                            {form.errors.email && <p className="text-xs text-destructive">{form.errors.email}</p>}
                        </div>

                        <div className="space-y-1.5 sm:col-span-2">
                            <Label htmlFor="lead-budget" className="text-xs font-medium">
                                {t.budget_label}
                            </Label>
                            <Input
                                id="lead-budget"
                                value={form.data.budget}
                                onChange={(e) => form.setData('budget', e.target.value)}
                                placeholder={t.budget_placeholder}
                                className="h-10"
                                inputMode="decimal"
                            />
                            {form.errors.budget && <p className="text-xs text-destructive">{form.errors.budget}</p>}
                        </div>

                        <div className="flex items-start gap-3 sm:col-span-2">
                            <Checkbox
                                id="lead-newsletter"
                                checked={form.data.newsletter}
                                onCheckedChange={(c) => form.setData('newsletter', c === true)}
                                className="mt-0.5"
                            />
                            <Label htmlFor="lead-newsletter" className="cursor-pointer text-sm leading-snug font-normal">
                                {t.newsletter_label}
                            </Label>
                        </div>

                        <div className="flex items-start gap-3 sm:col-span-2">
                            <Checkbox
                                id="lead-terms"
                                checked={form.data.terms_accepted}
                                onCheckedChange={(c) => form.setData('terms_accepted', c === true)}
                                className="mt-0.5"
                                aria-invalid={Boolean(form.errors.terms_accepted)}
                            />
                            <Label htmlFor="lead-terms" className="cursor-pointer text-sm leading-snug font-normal">
                                {t.terms_intro}
                                <a href="/terms" className="text-brand underline-offset-2 hover:underline dark:text-sky-300">
                                    {t.terms_link_terms}
                                </a>
                                {t.terms_mid}
                                <a href="/privacy" className="text-brand underline-offset-2 hover:underline dark:text-sky-300">
                                    {t.terms_link_privacy}
                                </a>
                                {t.terms_outro}
                            </Label>
                        </div>
                        {form.errors.terms_accepted && (
                            <p className="text-xs text-destructive sm:col-span-2">{form.errors.terms_accepted}</p>
                        )}
                    </div>

                    <DialogFooter className="flex-col gap-2 border-t border-border/60 bg-muted/20 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                        <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                            {t.close}
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            {form.processing ? t.submitting : t.submit}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
