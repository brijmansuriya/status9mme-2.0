import { AdminSidebarLayout } from '@/layouts/admin/admin-sidebar-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Users,
    UserCog,
    BarChart3,
    FileText,
    Settings,
    Shield,
    TrendingUp
} from 'lucide-react';
import { Head } from '@inertiajs/react';

interface AdminDashboardProps {
    admin: {
        id: number;
        name: string;
        email: string;
        role: string;
    };
}

export default function AdminDashboard({ admin }: AdminDashboardProps) {
    const quickStats = [
        {
            title: 'Total Users',
            value: '1,234',
            change: '+12%',
            icon: Users,
            color: 'text-primary',
        },
        {
            title: 'Active Admins',
            value: '5',
            change: '+2',
            icon: UserCog,
            color: 'text-chart-2',
        },
        {
            title: 'Reports Generated',
            value: '89',
            change: '+23%',
            icon: FileText,
            color: 'text-chart-3',
        },
    ];

    const quickActions = [
        {
            title: 'Manage Users',
            description: 'View and manage user accounts',
            href: '/admin/users',
            icon: Users,
        },
        {
            title: 'View Analytics',
            description: 'Check system analytics and metrics',
            href: '/admin/analytics',
            icon: BarChart3,
        },
        {
            title: 'Generate Reports',
            description: 'Create and download reports',
            href: '/admin/reports',
            icon: FileText,
        },
        {
            title: 'Admin Settings',
            description: 'Configure admin panel settings',
            href: '/admin/settings',
            icon: Settings,
        },
    ];

    return (
        <AdminSidebarLayout>
            <Head title="Admin Dashboard" />
            <div className="space-y-6 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                        <p className="text-muted-foreground">
                            Welcome back, {admin.name}! Manage your system from here.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                            <Shield className="h-3 w-3" />
                            Admin Access
                        </Badge>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-3">
                    {quickStats.map((stat) => (
                        <Card key={stat.title} className="hover:shadow-lg transition-all duration-200">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {stat.title}
                                </CardTitle>
                                <div className="p-2 rounded-lg bg-muted/50">
                                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                    <TrendingUp className="h-3 w-3 text-chart-2" />
                                    <span className="text-chart-2 font-medium">{stat.change}</span>
                                    <span>from last month</span>
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Quick Actions */}
                <div>
                    <h2 className="text-2xl font-bold mb-6 text-foreground">Quick Actions</h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {quickActions.map((action) => (
                            <Card key={action.title} className="hover:shadow-lg hover:scale-105 transition-all duration-200 group cursor-pointer">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                            <action.icon className="h-5 w-5 text-primary" />
                                        </div>
                                        <CardTitle className="text-lg text-foreground">{action.title}</CardTitle>
                                    </div>
                                    <CardDescription className="text-muted-foreground">{action.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <Button asChild className="w-full group-hover:bg-primary/90 transition-colors">
                                        <a href={action.href}>Go to {action.title}</a>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Info Card */}
                <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                            <div>
                                <h3 className="font-semibold text-primary">Admin Panel Access</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    You have full administrative access to manage users, view analytics, generate reports, and configure system settings.
                                    For administrative functions or data modifications, use the quick actions above.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminSidebarLayout>
    );
}
