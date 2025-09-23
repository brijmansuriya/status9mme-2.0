import React from 'react';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    Video, 
    Users, 
    Download, 
    Eye, 
    Plus, 
    TrendingUp, 
    Star,
    BarChart3,
    Settings
} from 'lucide-react';

interface DashboardStats {
    totalTemplates: number;
    totalCategories: number;
    totalDownloads: number;
    totalViews: number;
    recentTemplates: Array<{
        id: number;
        name: string;
        downloads_count: number;
        views_count: number;
        rating: number;
        created_at: string;
    }>;
    topCategories: Array<{
        name: string;
        templates_count: number;
        color: string;
    }>;
}

interface DashboardProps {
    stats: DashboardStats;
}

export default function Dashboard({ stats }: DashboardProps) {
    const statCards = [
        {
            title: 'Total Templates',
            value: stats.totalTemplates,
            icon: Video,
            color: 'bg-blue-500',
            change: '+12%',
            changeType: 'positive' as const,
        },
        {
            title: 'Categories',
            value: stats.totalCategories,
            icon: BarChart3,
            color: 'bg-green-500',
            change: '+3',
            changeType: 'positive' as const,
        },
        {
            title: 'Total Downloads',
            value: stats.totalDownloads.toLocaleString(),
            icon: Download,
            color: 'bg-purple-500',
            change: '+25%',
            changeType: 'positive' as const,
        },
        {
            title: 'Total Views',
            value: stats.totalViews.toLocaleString(),
            icon: Eye,
            color: 'bg-orange-500',
            change: '+18%',
            changeType: 'positive' as const,
        },
    ];

    return (
        <>
            <Head title="Admin Dashboard - Video Status Maker" />
            
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white border-b">
                    <div className="max-w-7xl mx-auto px-4 py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                                <p className="text-gray-600">Welcome back! Here's what's happening with your video templates.</p>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                                    <Plus className="w-4 h-4 mr-2" />
                                    New Template
                                </Button>
                                <Button variant="outline">
                                    <Settings className="w-4 h-4 mr-2" />
                                    Settings
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {statCards.map((stat, index) => (
                            <motion.div
                                key={stat.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <Card className="hover:shadow-lg transition-shadow duration-300">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                                                <div className="flex items-center mt-2">
                                                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                                                    <span className="text-sm text-green-600 font-medium">
                                                        {stat.change}
                                                    </span>
                                                    <span className="text-sm text-gray-500 ml-1">from last month</span>
                                                </div>
                                            </div>
                                            <div className={`${stat.color} p-3 rounded-lg`}>
                                                <stat.icon className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Recent Templates */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle>Recent Templates</CardTitle>
                                    <CardDescription>
                                        Latest templates added to your collection
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {stats.recentTemplates.map((template, index) => (
                                            <div key={template.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-400 rounded-lg flex items-center justify-center">
                                                        <Video className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900">{template.name}</h4>
                                                        <p className="text-sm text-gray-600">
                                                            {new Date(template.created_at).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                                    <div className="flex items-center">
                                                        <Download className="w-4 h-4 mr-1" />
                                                        {template.downloads_count}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Eye className="w-4 h-4 mr-1" />
                                                        {template.views_count}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                                                        {template.rating ? Number(template.rating).toFixed(1) : '0.0'}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Top Categories */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle>Top Categories</CardTitle>
                                    <CardDescription>
                                        Most popular template categories
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {stats.topCategories.map((category, index) => (
                                            <div key={category.name} className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div 
                                                        className="w-4 h-4 rounded-full"
                                                        style={{ backgroundColor: category.color }}
                                                    />
                                                    <span className="font-medium text-gray-900">{category.name}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Badge variant="secondary">
                                                        {category.templates_count} templates
                                                    </Badge>
                                                    <div className="w-24 bg-gray-200 rounded-full h-2">
                                                        <div 
                                                            className="h-2 rounded-full"
                                                            style={{ 
                                                                backgroundColor: category.color,
                                                                width: `${(category.templates_count / Math.max(...stats.topCategories.map(c => c.templates_count))) * 100}%`
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Quick Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        className="mt-8"
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                                <CardDescription>
                                    Common tasks to manage your video templates
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Button variant="outline" className="h-20 flex-col">
                                        <Plus className="w-6 h-6 mb-2" />
                                        Create Template
                                    </Button>
                                    <Button variant="outline" className="h-20 flex-col">
                                        <BarChart3 className="w-6 h-6 mb-2" />
                                        Manage Categories
                                    </Button>
                                    <Button variant="outline" className="h-20 flex-col">
                                        <Settings className="w-6 h-6 mb-2" />
                                        System Settings
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </>
    );
}
