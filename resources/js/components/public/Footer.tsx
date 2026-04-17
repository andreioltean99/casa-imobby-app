import { usePage } from '@inertiajs/react';
import { useAppearance } from '@/hooks/use-appearance';

export function Footer() {
    const { translations } = usePage().props as { translations?: any };
    const { resolvedAppearance } = useAppearance();
    const tFooter = translations?.footer ?? {};
    const siteName = translations?.brand?.site_name ?? 'Casa Imobby';
    return (
        <footer className="border-t border-border/60 bg-background/90 dark:bg-[#0c1520]">
            <div
                className="mx-auto flex flex-col gap-4 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:max-w-6xl lg:px-8">
                <div className="flex flex-wrap items-center gap-3">
                    <span>© {new Date().getFullYear()} {siteName}</span>
                    <span className="hidden h-1 w-1 rounded-full bg-muted-foreground/40 sm:inline-block" />
                    <a href="/terms" className="hover:text-foreground">
                        {tFooter.terms ?? 'Terms of Service'}
                    </a>
                    <span className="hidden h-1 w-1 rounded-full bg-muted-foreground/40 sm:inline-block" />
                    <a href="/privacy" className="hover:text-foreground">
                        {tFooter.privacy ?? 'Privacy Policy'}
                    </a>
                </div>
                <div className="flex gap-3">
                    <a href="/login" className="hover:text-foreground">
                        {tFooter.admin ?? 'Admin'}
                    </a>
                </div>
            </div>
            <div className="mx-auto flex flex-col items-start gap-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:max-w-6xl lg:px-8">
                <div>
                    <a style={{margin: 0, lineHeight: 1, padding: 0, textDecoration: 'none'}}
                       href="https://anpc.ro/ce-este-sal/" target="_blank" rel="nofollow">
                        <img style={{display: 'inline-block', border:0, width: 150, margin:5}}
                             src="/anpc-sal.svg"
                             alt="Solutionarea Alternativa a Litigiilor" />
                    </a>
                    <a style={{margin: 0, lineHeight: 1, padding: 0, textDecoration: 'none'}}
                       href="https://ec.europa.eu/consumers/odr" target="_blank" rel="nofollow">
                        <img style={{display: 'inline-block', border:0, width: 150, margin:5}}
                             src="/anpc-sol.svg"
                             alt="Solutionarea Online a Litigiilor" />
                    </a>
                </div>
                <div>
                    <a style={{margin: 0, lineHeight: 1, padding: 0, textDecoration: 'none'}}
                       href="https://aao-soft.com" target="_blank" rel="nofollow">
                        <img
                            style={{display: 'inline-block', border: 0, width: 75, margin: 5}}
                            src={resolvedAppearance === 'dark' ? '/logo-aao-soft-dark.png' : '/logo-aao-soft.jpeg'}
                            alt="AAO Soft logo"
                        />
                    </a>
                </div>
            </div>
        </footer>
    );
}

