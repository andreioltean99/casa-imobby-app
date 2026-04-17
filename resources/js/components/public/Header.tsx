import { Link, usePage } from '@inertiajs/react';
import { Moon, Sun } from 'lucide-react';
import { useAppearance } from '@/hooks/use-appearance';
import { useEffect, useState } from 'react';

export function Header() {
    const page = usePage();
    const { locale, availableLocales, translations } = page.props as {
        locale?: string;
        availableLocales?: string[];
        translations?: any;
    };
    const tBrand = translations?.brand ?? {};
    const currentPath = page.url.split('?')[0] || '/';
    const sectionHref = (section: 'portfolio' | 'about' | 'contact') => {
        if (section === 'contact') {
            return '/contact';
        }
        return currentPath === '/' ? `#${section}` : `/#${section}`;
    };

    const current = locale ?? 'en';
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const locales = (availableLocales && availableLocales.length > 0
        ? availableLocales
        : ['en', 'ro']
    ).slice(0, 3);

    const siteName = tBrand.site_name ?? 'Casa Imobby';
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 4);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <header
            className={[
                'animate-mobile-header-in relative z-50 border-b border-border/60 bg-background/90 backdrop-blur-md transition-shadow duration-200 dark:bg-background/92 md:sticky md:top-0',
                scrolled ? 'shadow-sm shadow-black/5 dark:shadow-black/20' : '',
            ].join(' ')}
        >
            <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-2.5 sm:px-6 lg:px-8">
                <Link href="/" className="flex min-w-0 items-center gap-3 text-left sm:gap-3.5">
                    <img
                        src="/logo-casa-imobby.png"
                        alt={siteName}
                        className="h-9 w-auto shrink-0 max-w-[min(100%,200px)] object-contain object-left sm:h-11 sm:max-w-[220px]"
                        width={220}
                        height={48}
                    />
                    <div className="flex min-w-0 flex-col items-start justify-center leading-none">
                        <span className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0">
                            <span className="font-brand text-[1.65rem] font-semibold tracking-wide text-brand sm:text-[1.85rem] md:text-[2rem]">
                                Casa
                            </span>
                            <span className="font-sans text-[1.35rem] font-bold uppercase tracking-[0.12em] text-brand sm:text-[1.5rem] md:text-[1.65rem]">
                                Imobby
                            </span>
                        </span>
                        <span className="mt-1 max-w-[min(100%,22rem)] truncate text-[11px] leading-snug text-muted-foreground sm:max-w-[26rem] sm:text-xs">
                            {tBrand.tagline ??
                                'Agenție imobiliară. Case, apartamente și terenuri'}
                        </span>
                    </div>
                </Link>

                <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground sm:flex">
                    <a href={sectionHref('portfolio')} className="transition-colors hover:text-brand">
                        {translations?.nav?.portfolio ?? 'Portfolio'}
                    </a>
                    <a href={sectionHref('about')} className="transition-colors hover:text-brand">
                        {translations?.nav?.about ?? 'About us'}
                    </a>
                    <a href={sectionHref('contact')} className="transition-colors hover:text-brand">
                        {translations?.nav?.contact ?? 'Contact'}
                    </a>
                </nav>

                <div className="flex w-full items-center justify-start gap-1.5 sm:w-auto sm:justify-end sm:gap-3">
                    <button
                        type="button"
                        onClick={() =>
                            updateAppearance(
                                resolvedAppearance === 'dark' ? 'light' : 'dark',
                            )
                        }
                        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-background/80 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:h-9 sm:w-9"
                        aria-label={
                            resolvedAppearance === 'dark'
                                ? 'Switch to light mode'
                                : 'Switch to dark mode'
                        }
                        title={
                            resolvedAppearance === 'dark'
                                ? 'Switch to light mode'
                                : 'Switch to dark mode'
                        }
                    >
                        {resolvedAppearance === 'dark' ? (
                            <Sun className="h-4 w-4" />
                        ) : (
                            <Moon className="h-4 w-4" />
                        )}
                    </button>

                    <div className="flex shrink-0 items-center gap-1 rounded-full border border-border bg-background/80 px-1 py-0.5 text-[10px] font-medium text-muted-foreground sm:ml-0 sm:text-[11px]">
                        {locales.map((code) => {
                            const isActive = code === current;
                            return (
                                <a
                                    key={code}
                                    href={`/lang/${code}`}
                                    className={[
                                        'inline-flex h-5 items-center justify-center rounded-full px-1.5 transition-colors sm:h-6 sm:px-2',
                                        isActive
                                            ? 'bg-brand text-white'
                                            : 'hover:bg-muted hover:text-foreground',
                                    ].join(' ')}
                                >
                                    {code.toUpperCase()}
                                </a>
                            );
                        })}
                    </div>
                </div>

                <nav className="flex items-center gap-1 overflow-x-auto pb-0 text-[10px] font-medium text-muted-foreground sm:hidden">
                    <a href={sectionHref('portfolio')} className="whitespace-nowrap rounded-full border border-border/70 bg-background px-2 py-1 leading-none hover:text-brand">
                        {translations?.nav?.portfolio ?? 'Portfolio'}
                    </a>
                    <a href={sectionHref('about')} className="whitespace-nowrap rounded-full border border-border/70 bg-background px-2 py-1 leading-none hover:text-brand">
                        {translations?.nav?.about ?? 'About us'}
                    </a>
                    <a href={sectionHref('contact')} className="whitespace-nowrap rounded-full border border-border/70 bg-background px-2 py-1 leading-none hover:text-brand">
                        {translations?.nav?.contact ?? 'Contact'}
                    </a>
                </nav>
            </div>
        </header>
    );
}
