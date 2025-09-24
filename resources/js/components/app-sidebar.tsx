import { NavFooter } from '@/components/nav-footer';
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
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { 
    LayoutGrid, 
    FolderTree, 
    FileTemplate, 
    Image, 
    Settings,
    Users,
    BarChart3,
    Package
} from 'lucide-react';
import AppLogo from './app-logo';
import { route } from '@/utils/routes';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: route('admin.dashboard'),
        icon: LayoutGrid,
    },
    {
        title: 'Categories',
        href: route('admin.categories'),
        icon: FolderTree,
    },
    {
        title: 'Templates',
        href: route('admin.templates'),
        icon: FileTemplate,
    },
    {
        title: 'Assets',
        href: route('admin.assets'),
        icon: Image,
    },
    {
        title: 'Users',
        href: '#',
        icon: Users,
    },
    {
        title: 'Analytics',
        href: '#',
        icon: BarChart3,
    },
    {
        title: 'Settings',
        href: '#',
        icon: Settings,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'View Site',
        href: route('home'),
        icon: Package,
    },
    {
        title: 'Documentation',
        href: '#',
        icon: Settings,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={route('admin.dashboard')} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
