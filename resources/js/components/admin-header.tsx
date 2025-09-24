import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
    Search, 
    Bell, 
    Settings, 
    HelpCircle, 
    Plus,
    BarChart3,
    FileText,
    Image,
    FolderTree,
    User,
    LogOut,
    Moon,
    Sun,
    Monitor
} from 'lucide-react';
import { route } from '@/utils/routes';

interface AdminHeaderProps {
    onSearch?: (query: string) => void;
    searchPlaceholder?: string;
}

export function AdminHeader({ 
    onSearch, 
    searchPlaceholder = "Search templates, categories..." 
}: AdminHeaderProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(searchQuery);
        }
    };

    const handleThemeToggle = () => {
        setIsDarkMode(!isDarkMode);
        // Add theme switching logic here
    };

    return (
        <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="flex h-16 items-center justify-between px-6">
                {/* Left side - Search */}
                <div className="flex-1 max-w-md">
                    <form onSubmit={handleSearch} className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input 
                            placeholder={searchPlaceholder}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 h-9"
                        />
                    </form>
                </div>

                {/* Right side - Actions and User Menu */}
                <div className="flex items-center gap-2">
                    {/* Quick Actions */}
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

                    {/* Notifications */}
                    <Button variant="ghost" size="sm" className="relative">
                        <Bell className="h-4 w-4" />
                        <Badge 
                            variant="destructive" 
                            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                        >
                            3
                        </Badge>
                    </Button>

                    {/* Analytics */}
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="#">
                            <BarChart3 className="h-4 w-4" />
                        </Link>
                    </Button>

                    {/* Help */}
                    <Button variant="ghost" size="sm">
                        <HelpCircle className="h-4 w-4" />
                    </Button>

                    {/* Settings */}
                    <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                    </Button>

                    {/* Theme Toggle */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                                <Sun className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={handleThemeToggle}>
                                <Sun className="mr-2 h-4 w-4" />
                                Light
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleThemeToggle}>
                                <Moon className="mr-2 h-4 w-4" />
                                Dark
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleThemeToggle}>
                                <Monitor className="mr-2 h-4 w-4" />
                                System
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* User Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span className="hidden md:inline">Admin User</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                                <User className="mr-2 h-4 w-4" />
                                Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
