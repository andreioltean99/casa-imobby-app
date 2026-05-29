import { Link } from '@inertiajs/react';
import { BellDot } from 'lucide-react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';
import { toUrl } from '@/lib/utils';

export function NavMain({
    items = [],
    label = 'Platform',
}: {
    items: NavItem[];
    label?: string;
}) {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>{label}</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={isCurrentUrl(item.href)}
                            tooltip={{ children: item.title }}
                        >
                            {
                                !item.nonSPA ? (
                                    <Link href={item.href} prefetch>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                        {item.unreadCount && item.unreadCount > 0 ? (
                                            <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-brand/10 px-1.5 py-0.5 text-[10px] font-semibold text-brand">
                                                <BellDot className="h-3 w-3" />
                                                {item.unreadCount}
                                            </span>
                                        ) : null}
                                    </Link>
                                ) : (
                                    <a href={toUrl(item.href)} target="_blank" rel="noopener noreferrer">
                                        {item.icon && <item.icon className="h-5 w-5" />}
                                        <span>{item.title}</span>
                                    </a>
                                )
                            }

                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
