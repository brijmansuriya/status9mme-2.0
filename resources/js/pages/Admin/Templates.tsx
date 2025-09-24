import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { route } from '@/utils/routes';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { 
    Plus, 
    Search, 
    Filter, 
    Edit, 
    Trash2, 
    Eye, 
    Download, 
    Star,
    MoreHorizontal,
    Play,
    Pause
} from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface Template {
    id: number;
    name: string;
    slug: string;
    description: string;
    thumbnail?: string;
    preview_video?: string;
    is_premium: boolean;
    is_active: boolean;
    duration: number;
    downloads_count: number;
    views_count: number;
    rating: number;
    ratings_count: number;
    created_at: string;
    updated_at: string;
    category: {
        id: number;
        name: string;
        color: string;
    };
}

interface TemplatesProps {
    templates: Template[];
    categories: Array<{
        id: number;
        name: string;
        slug: string;
    }>;
}

export default function Templates({ templates, categories }: TemplatesProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('created_at');

    const filteredTemplates = templates.filter(template => {
        const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            template.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || 
                              template.category.id.toString() === selectedCategory;
        const matchesStatus = statusFilter === 'all' || 
                            (statusFilter === 'active' && template.is_active) ||
                            (statusFilter === 'inactive' && !template.is_active) ||
                            (statusFilter === 'premium' && template.is_premium);
        return matchesSearch && matchesCategory && matchesStatus;
    });

    const sortedTemplates = [...filteredTemplates].sort((a, b) => {
        switch (sortBy) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'downloads':
                return b.downloads_count - a.downloads_count;
            case 'views':
                return b.views_count - a.views_count;
            case 'rating':
                return b.rating - a.rating;
            case 'created_at':
            default:
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
    });

    const handleEdit = (template: Template) => {
        router.visit(route('admin.templates.edit', { id: template.id }));
    };

    const handleDelete = (template: Template) => {
        if (confirm('Are you sure you want to delete this template?')) {
            router.delete(route('admin.templates.destroy', { id: template.id }));
        }
    };

    const handleView = (template: Template) => {
        router.visit(route('admin.templates.show', { id: template.id }));
    };

    const handleToggleStatus = (template: Template) => {
        // Toggle active status
        console.log('Toggle status for template:', template.id);
    };

    return (
        <>
            <Head title="Manage Templates - Admin Panel" />
            
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white border-b">
                    <div className="max-w-7xl mx-auto px-4 py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Templates</h1>
                                <p className="text-gray-600">Manage your video templates and their settings</p>
                            </div>
                            
                            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                                <Plus className="w-4 h-4 mr-2" />
                                Create Template
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-8">
                    {/* Filters */}
                    <Card className="mb-6">
                        <CardContent className="p-6">
                            <div className="flex flex-col lg:flex-row gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        placeholder="Search templates..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                
                                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                    <SelectTrigger className="w-full lg:w-48">
                                        <SelectValue placeholder="All Categories" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Categories</SelectItem>
                                        {categories.map(category => (
                                            <SelectItem key={category.id} value={category.id.toString()}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-full lg:w-48">
                                        <SelectValue placeholder="All Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                        <SelectItem value="premium">Premium</SelectItem>
                                    </SelectContent>
                                </Select>
                                
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger className="w-full lg:w-48">
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="created_at">Date Created</SelectItem>
                                        <SelectItem value="name">Name</SelectItem>
                                        <SelectItem value="downloads">Downloads</SelectItem>
                                        <SelectItem value="views">Views</SelectItem>
                                        <SelectItem value="rating">Rating</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Templates Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Templates ({sortedTemplates.length})</CardTitle>
                            <CardDescription>
                                Manage and organize your video templates
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Template</TableHead>
                                            <TableHead>Category</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Stats</TableHead>
                                            <TableHead>Rating</TableHead>
                                            <TableHead>Created</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {sortedTemplates.map((template, index) => (
                                            <motion.tr
                                                key={template.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.6, delay: index * 0.05 }}
                                                className="hover:bg-gray-50"
                                            >
                                                <TableCell>
                                                    <div className="flex items-center space-x-4">
                                                        <div className="w-16 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
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
                                                        <div>
                                                            <h4 className="font-semibold text-gray-900">{template.name}</h4>
                                                            <p className="text-sm text-gray-600 line-clamp-2">{template.description}</p>
                                                            <div className="flex items-center mt-1">
                                                                <span className="text-xs text-gray-500">{template.duration}s</span>
                                                                {template.is_premium && (
                                                                    <Badge className="ml-2 bg-yellow-500 text-xs">
                                                                        Premium
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                
                                                <TableCell>
                                                    <Badge 
                                                        variant="secondary"
                                                        style={{ backgroundColor: template.category.color + '20', color: template.category.color }}
                                                    >
                                                        {template.category.name}
                                                    </Badge>
                                                </TableCell>
                                                
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        <Badge variant={template.is_active ? "default" : "secondary"}>
                                                            {template.is_active ? 'Active' : 'Inactive'}
                                                        </Badge>
                                                    </div>
                                                </TableCell>
                                                
                                                <TableCell>
                                                    <div className="text-sm text-gray-600">
                                                        <div className="flex items-center">
                                                            <Download className="w-4 h-4 mr-1" />
                                                            {template.downloads_count.toLocaleString()}
                                                        </div>
                                                        <div className="flex items-center">
                                                            <Eye className="w-4 h-4 mr-1" />
                                                            {template.views_count.toLocaleString()}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                
                                                <TableCell>
                                                    <div className="flex items-center">
                                                        <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                                                        <span className="font-medium">{template.rating ? Number(template.rating).toFixed(1) : '0.0'}</span>
                                                        <span className="text-sm text-gray-500 ml-1">
                                                            ({template.ratings_count})
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                
                                                <TableCell>
                                                    <div className="text-sm text-gray-600">
                                                        {new Date(template.created_at).toLocaleDateString()}
                                                    </div>
                                                </TableCell>
                                                
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end space-x-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleEdit(template)}
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleToggleStatus(template)}
                                                        >
                                                            {template.is_active ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDelete(template)}
                                                            className="text-red-600 hover:text-red-700"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </motion.tr>
                                        ))}
                                    </TableBody>
                                </Table>
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
                                        setStatusFilter('all');
                                    }}>
                                        Clear Filters
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
