import React from 'react';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
    BarChart3, 
    Users, 
    Download, 
    Eye, 
    TrendingUp, 
    Calendar,
    Star,
    Play,
    Plus,
    Settings
} from 'lucide-react';

interface Template {
    id: number;
    name: string;
    slug: string;
    description: string;
    thumbnail?: string;
    is_premium: boolean;
    duration: number;
    downloads_count: number;
    views_count: number;
    rating: number | null;
    ratings_count: number;
    created_at: string;
    category: {
        name: string;
        color: string;
    };
}

interface Category {
    id: number;
    name: string;
    color: string;
    templates_count: number;
}

interface DashboardStats {
    totalTemplates: number;
    totalCategories: number;
    totalDownloads: number;
    totalViews: number;
    recentTemplates: Template[];
    topCategories: Category[];
}

interface DashboardProps {
    stats: DashboardStats;
}

export default function Dashboard({ stats }: DashboardProps) {
    const statCards = [
        {
            title: 'Total Templates',
            value: stats.totalTemplates,
            icon: Play,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
            change: '+12%',
            changeType: 'positive' as const,
        },
        {
            title: 'Total Categories',
            value: stats.totalCategories,
            icon: BarChart3,
            color: 'text-green-600',
            bgColor: 'bg-green-100',
            change: '+5%',
            changeType: 'positive' as const,
        },
        {
            title: 'Total Downloads',
            value: stats.totalDownloads.toLocaleString(),
            icon: Download,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100',
            change: '+23%',
            changeType: 'positive' as const,
        },
        {
            title: 'Total Views',
            value: stats.totalViews.toLocaleString(),
            icon: Eye,
            color: 'text-orange-600',
            bgColor: 'bg-orange-100',
            change: '+18%',
            changeType: 'positive' as const,
        },
    ];

    return (
        <>
            <Head title="Admin Dashboard" />
            
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-gray-600">Welcome back! Here's what's happening with your templates.</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {statCards.map((stat, index) => (
                            <motion.div
                                key={stat.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                                <div className="flex items-center mt-2">
                                                    <span className={`text-sm font-medium ${
                                                        stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                                                    }`}>
                                                        {stat.change}
                                                    </span>
                                                    <span className="text-sm text-gray-500 ml-1">from last month</span>
                                                </div>
                                            </div>
                                            <div className={`p-3 rounded-full ${stat.bgColor}`}>
                                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Recent Templates */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Recent Templates</CardTitle>
                                        <CardDescription>
                                            Latest templates added to the platform
                                        </CardDescription>
                                    </div>
                                    <Button variant="outline" size="sm">
                                        View All
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {stats.recentTemplates.map((template, index) => (
                                        <motion.div
                                            key={template.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.1 }}
                                            className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                                                {template.thumbnail ? (
                                                    <img 
                                                        src={template.thumbnail} 
                                                        alt={template.name}
                                                        className="w-full h-full object-cover rounded-lg"
                                                    />
                                                ) : (
                                                    <Play className="w-6 h-6 text-gray-400" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="text-sm font-medium text-gray-900 truncate">
                                                        {template.name}
                                                    </h4>
                                                    {template.is_premium && (
                                                        <Badge className="text-xs bg-yellow-500">
                                                            Premium
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {template.description}
                                                </p>
                                                <div className="flex items-center gap-4 mt-1">
                                                    <span className="text-xs text-gray-500">
                                                        {template.duration}s
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {template.downloads_count} downloads
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {template.views_count} views
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center text-xs text-gray-500">
                                                <Calendar className="w-3 h-3 mr-1" />
                                                {new Date(template.created_at).toLocaleDateString()}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Top Categories */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Top Categories</CardTitle>
                                        <CardDescription>
                                            Most popular template categories
                                        </CardDescription>
                                    </div>
                                    <Button variant="outline" size="sm">
                                        Manage
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {stats.topCategories.map((category, index) => (
                                        <motion.div
                                            key={category.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.1 }}
                                            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div 
                                                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                                                    style={{ backgroundColor: category.color }}
                                                >
                                                    {category.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-900">
                                                        {category.name}
                                                    </h4>
                                                    <p className="text-xs text-gray-500">
                                                        {category.templates_count} templates
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center text-xs text-gray-500">
                                                <TrendingUp className="w-3 h-3 mr-1" />
                                                +12%
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Actions */}
                    <Card className="mt-8">
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                            <CardDescription>
                                Common administrative tasks
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Button className="h-20 flex flex-col items-center justify-center space-y-2">
                                    <Plus className="w-6 h-6" />
                                    <span>Create Template</span>
                                </Button>
                                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                                    <BarChart3 className="w-6 h-6" />
                                    <span>Manage Categories</span>
                                </Button>
                                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                                    <Settings className="w-6 h-6" />
                                    <span>System Settings</span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}