import React from 'react';
import { Link } from '@inertiajs/react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
    Heart, 
    Github, 
    ExternalLink, 
    Shield, 
    Clock,
    Activity
} from 'lucide-react';
import { route } from '@/utils/routes';

export function AdminFooter() {
    const currentYear = new Date().getFullYear();
    
    return (
        <footer className="border-t bg-white/80 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Left side - Copyright and info */}
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>© {currentYear} Status9MME. Made with</span>
                        <Heart className="h-4 w-4 text-red-500" />
                        <span>for creators</span>
                    </div>
                    
                    {/* Center - Status indicators */}
                    <div className="flex items-center gap-4">
                        <Badge variant="secondary" className="flex items-center gap-1">
                            <Activity className="h-3 w-3 text-green-500" />
                            System Online
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                            <Shield className="h-3 w-3 text-blue-500" />
                            Secure
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-gray-500" />
                            {new Date().toLocaleTimeString()}
                        </Badge>
                    </div>
                    
                    {/* Right side - Links */}
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href={route('home')}>
                                <ExternalLink className="h-4 w-4 mr-2" />
                                View Site
                            </Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                                <Github className="h-4 w-4 mr-2" />
                                GitHub
                            </a>
                        </Button>
                    </div>
                </div>
                
                <Separator className="my-4" />
                
                {/* Bottom row - Additional info */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-gray-500">
                    <div className="flex items-center gap-4">
                        <span>Laravel 12.31.1</span>
                        <span>•</span>
                        <span>Inertia.js v2.0</span>
                        <span>•</span>
                        <span>React 19</span>
                        <span>•</span>
                        <span>Tailwind CSS</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="#" className="hover:text-gray-700 transition-colors">Privacy Policy</Link>
                        <span>•</span>
                        <Link href="#" className="hover:text-gray-700 transition-colors">Terms of Service</Link>
                        <span>•</span>
                        <Link href="#" className="hover:text-gray-700 transition-colors">Support</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
