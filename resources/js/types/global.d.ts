import type { Auth } from '@/types/auth';

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            sidebarOpen: boolean;
            portfolioListingAdmin?: {
                categoryLabel: string;
                categoryPlaceholder: string;
                pinnedHomeLabel: string;
                pinnedHomeOrderLabel: string;
                categoryTitles: Record<string, string>;
            };
            admin?: Record<string, unknown>;
            [key: string]: unknown;
        };
    }
}
