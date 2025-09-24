import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Heart, Download, Star, Search, Filter, Grid, List } from 'lucide-react';

interface Template {
    id: number;
    name: string;
    slug: string;
    description: string;
    thumbnail?: string;
    preview_video?: string;
    is_premium: boolean;
    duration: number;
    downloads_count: number;
    views_count: number;
    rating: number | null;
    ratings_count: number;
    category: {
        name: string;
        color: string;
        icon: string;
    };
}

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string;
    color: string;
    icon: string;
    templates_count: number;
}

interface TemplatesProps {
    templates: Template[];
    categories: Category[];
    currentCategory?: string;
    search?: string;
}

export default function Templates({ templates, categories, currentCategory, search }: TemplatesProps) {
    const [searchQuery, setSearchQuery] = useState(search || '');
    const [selectedCategory, setSelectedCategory] = useState(currentCategory || 'all');
    const [sortBy, setSortBy] = useState('popular');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const filteredTemplates = templates.filter(template => {
        const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            template.keywords?.some((keyword: string) => 
                                keyword.toLowerCase().includes(searchQuery.toLowerCase())
                            );
        const matchesCategory = selectedCategory === 'all' || 
                              template.category.slug === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const sortedTemplates = [...filteredTemplates].sort((a, b) => {
        switch (sortBy) {
            case 'popular':
                return b.downloads_count - a.downloads_count;
            case 'rating':
                return b.rating - a.rating;
            case 'newest':
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            case 'duration':
                return a.duration - b.duration;
            default:
                return 0;
        }
    });

    return (
        <>
            <Head title="Video Templates - Browse All Templates" />
            
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
                {/* Header */}
                <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10">
                    <div className="max-w-7xl mx-auto px-4 py-6">
                        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Video Templates</h1>
                                <p className="text-gray-600">Choose from {templates.length} amazing templates</p>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                                <div className="relative flex-1 lg:w-80">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        placeholder="Search templates..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                
                                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                    <SelectTrigger className="w-full sm:w-48">
                                        <SelectValue placeholder="All Categories" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Categories</SelectItem>
                                        {categories.map(category => (
                                            <SelectItem key={category.id} value={category.slug}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger className="w-full sm:w-48">
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="popular">Most Popular</SelectItem>
                                        <SelectItem value="rating">Highest Rated</SelectItem>
                                        <SelectItem value="newest">Newest</SelectItem>
                                        <SelectItem value="duration">Shortest Duration</SelectItem>
                                    </SelectContent>
                                </Select>
                                
                                <div className="flex border rounded-lg">
                                    <Button
                                        variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                        size="sm"
                                        onClick={() => setViewMode('grid')}
                                        className="rounded-r-none"
                                    >
                                        <Grid className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant={viewMode === 'list' ? 'default' : 'ghost'}
                                        size="sm"
                                        onClick={() => setViewMode('list')}
                                        className="rounded-l-none"
                                    >
                                        <List className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <Tabs defaultValue="all" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 mb-8">
                            <TabsTrigger value="all">All</TabsTrigger>
                            {categories.map(category => (
                                <TabsTrigger key={category.id} value={category.slug}>
                                    {category.name}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        <TabsContent value="all" className="mt-0">
                            <div className={`grid gap-6 ${
                                viewMode === 'grid' 
                                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                                    : 'grid-cols-1'
                            }`}>
                                {sortedTemplates.map((template, index) => (
                                    <motion.div
                                        key={template.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: index * 0.05 }}
                                    >
                                        {viewMode === 'grid' ? (
                                            <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden">
                                                <div className="relative">
                                                    <div className="aspect-[9/16] bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                                        {template.thumbnail ? (
                                                            <img 
                                                                src={template.thumbnail} 
                                                                alt={template.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <Play className="w-12 h-12 text-gray-400" />
                                                        )}
                                                    </div>
                                                    {template.is_premium && (
                                                        <Badge className="absolute top-2 right-2 bg-yellow-500">
                                                            Premium
                                                        </Badge>
                                                    )}
                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                        <Link href={route('templates.editor', template.slug)}>
                                                            <Button size="sm" className="bg-white text-black hover:bg-gray-100">
                                                                <Play className="w-4 h-4 mr-2" />
                                                                Customize
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </div>
                                                <CardContent className="p-4">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <Badge 
                                                            variant="secondary" 
                                                            style={{ backgroundColor: template.category.color + '20', color: template.category.color }}
                                                        >
                                                            {template.category.name}
                                                        </Badge>
                                                        <div className="flex items-center text-sm text-gray-500">
                                                            <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                                                            {template.rating ? Number(template.rating).toFixed(1) : '0.0'}
                                                        </div>
                                                    </div>
                                                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{template.name}</h3>
                                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{template.description}</p>
                                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                                        <span>{template.duration}s</span>
                                                        <div className="flex items-center gap-3">
                                                            <span className="flex items-center">
                                                                <Heart className="w-4 h-4 mr-1" />
                                                                {template.views_count}
                                                            </span>
                                                            <span className="flex items-center">
                                                                <Download className="w-4 h-4 mr-1" />
                                                                {template.downloads_count}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ) : (
                                            <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                                                <div className="flex gap-4 p-4">
                                                    <div className="relative w-24 h-32 flex-shrink-0">
                                                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                                                            {template.thumbnail ? (
                                                                <img 
                                                                    src={template.thumbnail} 
                                                                    alt={template.name}
                                                                    className="w-full h-full object-cover rounded-lg"
                                                                />
                                                            ) : (
                                                                <Play className="w-8 h-8 text-gray-400" />
                                                            )}
                                                        </div>
                                                        {template.is_premium && (
                                                            <Badge className="absolute -top-2 -right-2 bg-yellow-500 text-xs">
                                                                Premium
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between mb-2">
                                                            <div className="flex items-center gap-2">
                                                                <Badge 
                                                                    variant="secondary" 
                                                                    style={{ backgroundColor: template.category.color + '20', color: template.category.color }}
                                                                >
                                                                    {template.category.name}
                                                                </Badge>
                                                                <div className="flex items-center text-sm text-gray-500">
                                                                    <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                                                                    {template.rating ? Number(template.rating).toFixed(1) : '0.0'} ({template.ratings_count})
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                        <h3 className="font-semibold text-lg mb-2">{template.name}</h3>
                                                        <p className="text-gray-600 mb-3 line-clamp-2">{template.description}</p>
                                                        
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                                <span>{template.duration}s</span>
                                                                <span className="flex items-center">
                                                                    <Heart className="w-4 h-4 mr-1" />
                                                                    {template.views_count} views
                                                                </span>
                                                                <span className="flex items-center">
                                                                    <Download className="w-4 h-4 mr-1" />
                                                                    {template.downloads_count} downloads
                                                                </span>
                                                            </div>
                                                            
                                                            <Link href={route('templates.editor', template.slug)}>
                                                                <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                                                                    <Play className="w-4 h-4 mr-2" />
                                                                    Customize
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                            
                            {sortedTemplates.length === 0 && (
                                <div className="text-center py-12">
                                    <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                        <Search className="w-12 h-12 text-gray-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No templates found</h3>
                                    <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
                                    <Button onClick={() => {
                                        setSearchQuery('');
                                        setSelectedCategory('all');
                                    }}>
                                        Clear Filters
                                    </Button>
                                </div>
                            )}
                        </TabsContent>
                        
                        {categories.map(category => (
                            <TabsContent key={category.id} value={category.slug} className="mt-0">
                                <div className={`grid gap-6 ${
                                    viewMode === 'grid' 
                                        ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                                        : 'grid-cols-1'
                                }`}>
                                    {sortedTemplates
                                        .filter(template => template.category.slug === category.slug)
                                        .map((template, index) => (
                                            <motion.div
                                                key={template.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.6, delay: index * 0.05 }}
                                            >
                                                {/* Same template card as above */}
                                            </motion.div>
                                        ))}
                                </div>
                            </TabsContent>
                        ))}
                    </Tabs>
                </div>
            </div>
        </>
    );
}
