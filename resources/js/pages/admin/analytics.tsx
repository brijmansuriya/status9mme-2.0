import { AdminSidebarLayout } from '@/layouts/admin/admin-sidebar-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    Users,
    Eye,
    FileText,
    Database,
    Activity
} from 'lucide-react';
import { Head } from '@inertiajs/react';

interface AdminAnalyticsProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    };
}

export default function AdminAnalytics({ auth }: AdminAnalyticsProps) {
    const analyticsData = {
        overview: [
            {
                title: 'Total Users',
                value: '1,234',
                change: '+12%',
                changeType: 'positive' as const,
                icon: Users,
                color: 'text-blue-600'
            },
            {
                title: 'Page Views',
                value: '45,678',
                change: '+23%',
                changeType: 'positive' as const,
                icon: Eye,
                color: 'text-green-600'
            },
            {
                title: 'Reports Generated',
                value: '89',
                change: '+8%',
                changeType: 'positive' as const,
                icon: FileText,
                color: 'text-purple-600'
            },
            {
                title: 'Database Queries',
                value: '12,345',
                change: '-5%',
                changeType: 'negative' as const,
                icon: Database,
                color: 'text-orange-600'
            }
        ],
        recentActivity: [
            { action: 'New user registered', time: '2 minutes ago', type: 'user' },
            { action: 'Report generated', time: '15 minutes ago', type: 'report' },
            { action: 'Database backup completed', time: '1 hour ago', type: 'system' },
            { action: 'Admin login', time: '2 hours ago', type: 'admin' },
        ]
    };

    const getChangeIcon = (changeType: 'positive' | 'negative') => {
        return changeType === 'positive' ? TrendingUp : TrendingDown;
    };

    const getChangeColor = (changeType: 'positive' | 'negative') => {
        return changeType === 'positive' ? 'text-green-600' : 'text-red-600';
    };

    return (
        <AdminSidebarLayout>
            <Head title="Analytics Dashboard" />
            <div className="space-y-6 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
                        <p className="text-muted-foreground">
                            Monitor system performance and user activity
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                            <Activity className="h-3 w-3" />
                            Real-time Data
                        </Badge>
                        <Button variant="outline">
                            Export Data
                        </Button>
                    </div>
                </div>

                {/* Overview Stats */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {analyticsData.overview.map((stat) => {
                        const ChangeIcon = getChangeIcon(stat.changeType);
                        return (
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
                                    <p className={`text-xs flex items-center gap-1 mt-1 ${getChangeColor(stat.changeType)}`}>
                                        <ChangeIcon className="h-3 w-3" />
                                        <span className="font-medium">{stat.change}</span>
                                        <span className="text-muted-foreground">from last month</span>
                                    </p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Charts Section */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* User Growth Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-foreground">User Growth</CardTitle>
                            <CardDescription className="text-muted-foreground">
                                New user registrations over time
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
                                <div className="text-center">
                                    <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                                    <p className="text-sm text-muted-foreground">Chart will be implemented here</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Activity Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-foreground">System Activity</CardTitle>
                            <CardDescription className="text-muted-foreground">
                                Daily system activity metrics
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
                                <div className="text-center">
                                    <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                                    <p className="text-sm text-muted-foreground">Activity chart will be implemented here</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-foreground">Recent Activity</CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Latest system activities and events
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {analyticsData.recentActivity.map((activity, index) => (
                                <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                                    <div className="w-3 h-3 bg-primary rounded-full flex-shrink-0"></div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-foreground">{activity.action}</p>
                                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                                    </div>
                                    <Badge variant="outline" className="text-xs">
                                        {activity.type}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminSidebarLayout>
    );
}
