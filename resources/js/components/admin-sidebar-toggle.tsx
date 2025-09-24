import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Menu, X } from 'lucide-react';

export function AdminSidebarToggle() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
        // Add sidebar toggle logic here
    };

    return (
        <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="md:hidden"
            >
                {isOpen ? (
                    <X className="h-4 w-4" />
                ) : (
                    <Menu className="h-4 w-4" />
                )}
            </Button>
        </div>
    );
}
