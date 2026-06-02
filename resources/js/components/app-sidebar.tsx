import { Link, usePage } from '@inertiajs/react';
import { useMemo } from 'react';
import {
    LayoutGrid,
    Quote,
    Building2,
    Briefcase,
    FileText,
    Inbox,
    MessageSquare,
    Phone,
    Tags,
    Users,
    SlidersHorizontal,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useAdminT } from '@/hooks/use-admin-translations';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const t = useAdminT();
    const { auth, adminUnread } = usePage().props as {
        auth?: { user?: { email?: string | null } | null };
        adminUnread?: {
            leadSubmissions?: number;
            contactMessages?: number;
        } | null;
    };

    const dashboardNavItems: NavItem[] = useMemo(
        () => [
            {
                title: t('nav.dashboard'),
                href: '/dashboard',
                icon: LayoutGrid,
            },
            {
                title: t('nav.lead_submissions'),
                href: '/dashboard/lead-submissions',
                icon: MessageSquare,
                unreadCount: adminUnread?.leadSubmissions ?? 0,
            },
            {
                title: t('nav.contact_messages'),
                href: '/dashboard/contact-messages',
                icon: Inbox,
                unreadCount: adminUnread?.contactMessages ?? 0,
            },
        ],
        [t, adminUnread?.leadSubmissions, adminUnread?.contactMessages],
    );

    const websiteNavItems: NavItem[] = useMemo(
        () => [
            {
                title: t('nav.property_listings'),
                href: '/dashboard/portfolio',
                icon: Briefcase,
            },
            {
                title: t('nav.listing_categories'),
                href: '/dashboard/listing-categories',
                icon: Tags,
            },
            {
                title: t('nav.property_filters'),
                href: '/dashboard/property-characteristics',
                icon: SlidersHorizontal,
            },
            {
                title: t('nav.about_page'),
                href: '/dashboard/about',
                icon: Building2,
            },
            {
                title: t('nav.testimonials'),
                href: '/dashboard/testimonials',
                icon: Quote,
            },
            {
                title: t('nav.contact_details'),
                href: '/dashboard/contact',
                icon: Phone,
            },
            {
                title: t('nav.homepage_hero'),
                href: '/dashboard/landing-hero',
                icon: LayoutGrid,
            },
        ],
        [t],
    );

    const legalNavItems: NavItem[] = useMemo(
        () => [
            {
                title: t('nav.terms'),
                href: '/dashboard/legal/terms',
                icon: FileText,
            },
            {
                title: t('nav.privacy'),
                href: '/dashboard/legal/privacy',
                icon: FileText,
            },
        ],
        [t],
    );

    const allowedEmails = [
        'andrei.oltean@aao-soft.com',
        'admin@casa-imobby.ro'
    ].map((e) => e.toLowerCase());

    const canManageUsers = auth?.user?.email
        ? allowedEmails.includes(String(auth.user.email).toLowerCase())
        : false;

    const usersNavItems: NavItem[] = useMemo(
        () => [
            {
                title: t('nav.users'),
                href: '/dashboard/users',
                icon: Users,
            },
        ],
        [t],
    );

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain label={t('nav.section_dashboard')} items={dashboardNavItems} />
                <hr className="mx-2 my-3 border-border/60" />
                <NavMain label={t('nav.section_website')} items={websiteNavItems} />

                {canManageUsers && (
                    <>
                        <hr className="mx-2 my-3 border-border/60" />
                        <NavMain label={t('nav.section_users')} items={usersNavItems} />
                    </>
                )}
                <hr className="mx-2 my-3 border-border/60" />
                <NavMain label={t('nav.section_legal')} items={legalNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
