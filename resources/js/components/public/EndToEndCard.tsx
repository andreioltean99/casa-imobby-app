import { Card, CardContent } from '@/components/ui/card';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { usePage } from '@inertiajs/react';

/** Prefer Laravel `trans('website.hero.*')` so language toggle matches locale; DB is fallback only. */
function i18nText(transVal: string | undefined, heroVal: string | null | undefined, fallback: string) {
    const t = transVal?.trim();
    if (t) {
        return t;
    }
    const h = heroVal?.trim();
    if (h) {
        return h;
    }
    return fallback;
}

function computedSteps(hero: any, th: Record<string, string | undefined>) {
    return [
        {
            number: '1',
            title: i18nText(th.step1_title, hero?.step1_title, 'Brief & market context'),
            body: i18nText(th.step1_body, hero?.step1_body, ''),
        },
        {
            number: '2',
            title: i18nText(th.step2_title, hero?.step2_title, 'Shortlist & viewings'),
            body: i18nText(th.step2_body, hero?.step2_body, ''),
        },
        {
            number: '3',
            title: i18nText(th.step3_title, hero?.step3_title, 'Offer to closing'),
            body: i18nText(th.step3_body, hero?.step3_body, ''),
        },
    ];
}

export function EndToEndCard() {
    const page = usePage();
    const { hero, translations } = page.props as {
        hero?: any;
        translations?: any;
    };

    const th = translations?.hero ?? {};
    const steps = computedSteps(hero, th);
    const heading = i18nText(th.end_to_end_heading, hero?.end_to_end_heading, 'How we work with you');

    return (
        <div className="relative">
            <Card className="relative gap-0 overflow-hidden border border-border/70 bg-gradient-to-br from-brand-soft via-white to-brand-accent-soft py-0 shadow-sm dark:from-brand/20 dark:via-neutral-950 dark:to-brand-accent/15">
                <PlaceholderPattern className="pointer-events-none absolute inset-0 size-full stroke-neutral-900/10 dark:stroke-neutral-50/10" />
                <CardContent className="relative space-y-3 p-5 sm:space-y-4 sm:p-6 lg:p-6">
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand dark:text-sky-300">
                        {heading}
                    </p>
                    <ul className="space-y-3 text-sm">
                        {steps.map((step) => (
                            <li key={step.number} className="flex gap-3">
                                <span className="mt-1 h-5 w-5 shrink-0 rounded-full bg-brand/10 text-[11px] font-semibold text-brand ring-1 ring-brand/25 dark:bg-sky-400/10 dark:text-sky-200">
                                    <span className="flex h-full w-full items-center justify-center">
                                        {step.number}
                                    </span>
                                </span>
                                <div>
                                    <h3 className="text-sm font-medium">{step.title}</h3>
                                    <p
                                        className="text-xs text-muted-foreground"
                                        dangerouslySetInnerHTML={{ __html: step.body }}
                                    />
                                </div>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
