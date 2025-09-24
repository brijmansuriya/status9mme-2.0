import { Breadcrumbs } from '@/components/breadcrumbs';
import { NavUser } from '@/components/nav-user';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { 
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { route } from '@/utils/routes';
import { 
    Search, 
    Bell, 
    Settings, 
    HelpCircle, 
    Plus,
    BarChart3,
    Users,
    FileText,
    Image,
    FolderTree
} from 'lucide-react';
import { Link } from '@inertiajs/react';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            {/* Left side - Sidebar trigger and breadcrumbs */}
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>

            {/* Center - Search bar */}
            <div className="flex-1 max-w-md mx-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input 
                        placeholder="Search templates, categories..." 
                        className="pl-10 pr-4 py-2 h-9"
                    />
                </div>
            </div>

            {/* Right side - Navigation and user menu */}
            <div className="flex items-center gap-2">
                {/* Quick Actions */}
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Quick Add
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                        <Link href={route('admin.templates.create')}>
                                            <FileText className="mr-2 h-4 w-4" />
                                            New Template
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href={route('admin.categories.create')}>
                                            <FolderTree className="mr-2 h-4 w-4" />
                                            New Category
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href={route('admin.assets.create')}>
                                            <Image className="mr-2 h-4 w-4" />
                                            Upload Asset
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </NavigationMenuItem>

                        {/* Notifications */}
                        <NavigationMenuItem>
                            <Button variant="ghost" size="sm" className="relative">
                                <Bell className="h-4 w-4" />
                                <Badge 
                                    variant="destructive" 
                                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                                >
                                    3
                                </Badge>
                            </Button>
                        </NavigationMenuItem>

                        {/* Analytics */}
                        <NavigationMenuItem>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="#">
                                    <BarChart3 className="h-4 w-4" />
                                </Link>
                            </Button>
                        </NavigationMenuItem>

                        {/* Help */}
                        <NavigationMenuItem>
                            <Button variant="ghost" size="sm">
                                <HelpCircle className="h-4 w-4" />
                            </Button>
                        </NavigationMenuItem>

                        {/* Settings */}
                        <NavigationMenuItem>
                            <Button variant="ghost" size="sm">
                                <Settings className="h-4 w-4" />
                            </Button>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>

                {/* User Menu */}
                <NavUser />
            </div>
        </header>
    );
}
