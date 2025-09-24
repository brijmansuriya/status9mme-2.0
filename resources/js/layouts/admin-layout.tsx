import React from 'react';
import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AdminHeader } from '@/components/admin-header';
import { AdminFooter } from '@/components/admin-footer';
import { AdminSidebarToggle } from '@/components/admin-sidebar-toggle';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { type BreadcrumbItem } from '@/types';

interface AdminLayoutProps {
    children: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    title?: string;
    description?: string;
}

export default function AdminLayout({
    children,
    breadcrumbs = [],
    title = "Admin Panel",
    description = "Manage your video templates and content"
}: AdminLayoutProps) {
    return (
        <AppShell variant="sidebar">
            {/* Sidebar Navigation */}
            <AppSidebar />
            
            {/* Main Content Area */}
            <AppContent variant="sidebar" className="overflow-x-hidden flex flex-col min-h-screen">
                {/* Enhanced Top Header */}
                <div className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur">
                    <div className="flex h-16 items-center justify-between px-6">
                        {/* Left side - Toggle and Breadcrumbs */}
                        <div className="flex items-center gap-4">
                            <AdminSidebarToggle />
                            {breadcrumbs.length > 0 && (
                                <Breadcrumbs breadcrumbs={breadcrumbs} />
                            )}
                        </div>
                        
                        {/* Right side - User Menu */}
                        <div className="flex items-center gap-2">
                            {/* Quick actions and notifications will be handled by AdminHeader */}
                        </div>
                    </div>
                </div>
                
                {/* Enhanced Header with Search and Actions */}
                <AdminHeader />
                
                {/* Page Content */}
                <main className="flex-1 p-6 bg-gray-50/50">
                    <div className="max-w-7xl mx-auto">
                        {/* Page Header */}
                        {(title || description) && (
                            <div className="mb-6">
                                {title && (
                                    <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                                )}
                                {description && (
                                    <p className="mt-2 text-gray-600">{description}</p>
                                )}
                            </div>
                        )}
                        
                        {/* Page Content */}
                        {children}
                    </div>
                </main>
                
                {/* Footer */}
                <AdminFooter />
            </AppContent>
        </AppShell>
    );
}
