import { Link, usePage } from '@inertiajs/react';
import {
    LayoutGrid,
    Quote,
    Building2,
    Briefcase,
    Phone,
    Users,
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
import type { NavItem } from '@/types';
import { dashboard } from '@/routes';

const platformNavItems: NavItem[] = [
    {
        title: 'Portfolio',
        href: '/dashboard/portfolio',
        icon: Briefcase,
    },
    {
        title: 'About & Principles',
        href: '/dashboard/about',
        icon: Building2,
    },
    {
        title: 'Testimonials',
        href: '/dashboard/testimonials',
        icon: Quote,
    },
    {
        title: 'Contact',
        href: '/dashboard/contact',
        icon: Phone,
    },
    {
        title: 'Landing hero',
        href: '/dashboard/landing-hero',
        icon: LayoutGrid,
    },
];

const dashboardNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
];

const legalNavItems: NavItem[] = [
    {
        title: 'Terms & Conditions',
        href: '/dashboard/legal/terms',
        icon: Briefcase,
    },
    {
        title: 'Privacy Policy',
        href: '/dashboard/legal/privacy',
        icon: Briefcase,
    },
];

export function AppSidebar() {
    const { auth } = usePage().props;

    const allowedEmails = [
        'andrei.oltean@aao-soft.com',
        'admin@casa-imobby.ro',
        'pocolaoctavian@gmail.com',
    ].map((e) => e.toLowerCase());

    const canManageUsers = auth?.user?.email
        ? allowedEmails.includes(String(auth.user.email).toLowerCase())
        : false;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain label="Dashboard" items={dashboardNavItems} />
                <hr className="mx-2 my-3 border-border/60" />
                <NavMain items={platformNavItems} />

                {canManageUsers && (
                    <>
                        <hr className="mx-2 my-3 border-border/60" />
                        <NavMain
                            label="Users"
                            items={[
                                {
                                    title: 'Users',
                                    href: '/dashboard/users',
                                    icon: Users,
                                },
                            ]}
                        />
                    </>
                )}
                <hr className="mx-2 my-3 border-border/60" />
                <NavMain label="Legal" items={legalNavItems} />
            </SidebarContent>

            <SidebarFooter>
                {/* Repository/Documentation links removed from admin panel */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
