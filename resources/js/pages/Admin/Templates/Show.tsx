import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { route } from '@/utils/routes';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    Edit, 
    ArrowLeft, 
    Play, 
    Download, 
    Eye, 
    Star,
    Calendar,
    Clock,
    Tag,
    Settings
} from 'lucide-react';

interface Template {
    id: number;
    name: string;
    slug: string;
    description: string;
    json_config: any;
    thumbnail?: string;
    preview_video?: string;
    is_premium: boolean;
    is_active: boolean;
    keywords: string[];
    resolution: string;
    duration: number;
    downloads_count: number;
    views_count: number;
    rating: number | null;
    ratings_count: number;
    created_at: string;
    updated_at: string;
    category: {
        id: number;
        name: string;
        color: string;
    };
    assets: any[];
}

interface ShowProps {
    template: Template;
}

export default function Show({ template }: ShowProps) {
    return (
        <>
            <Head title={`${template.name} - Admin Panel`} />
            
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-4 mb-4">
                            <Link href={route('admin.templates.index')}>
                                <Button variant="outline" size="sm">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to Templates
                                </Button>
                            </Link>
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-gray-900">{template.name}</h1>
                                <p className="text-gray-600">{template.description}</p>
                            </div>
                            <Link href={route('admin.templates.edit', { id: template.id })}>
                                <Button>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit Template
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Preview */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Preview</CardTitle>
                                    <CardDescription>
                                        Template preview and configuration
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="relative bg-black rounded-lg overflow-hidden">
                                        <div className="aspect-[9/16] bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                                            {template.thumbnail ? (
                                                <img 
                                                    src={template.thumbnail} 
                                                    alt={template.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="text-center text-white">
                                                    <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                                    <p className="text-lg">No preview available</p>
                                                </div>
                                            )}
                                        </div>
                                        
                                        {template.preview_video && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Button
                                                    size="lg"
                                                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                                                >
                                                    <Play className="w-6 h-6 mr-2" />
                                                    Play Preview
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Template Configuration */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Template Configuration</CardTitle>
                                    <CardDescription>
                                        JSON configuration and layer details
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-2">Layers ({template.json_config.layers?.length || 0})</h4>
                                            <div className="space-y-2">
                                                {template.json_config.layers?.map((layer: any, index: number) => (
                                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                                <span className="text-xs font-medium text-blue-600">
                                                                    {layer.type.charAt(0).toUpperCase()}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-900">
                                                                    {layer.type.charAt(0).toUpperCase() + layer.type.slice(1)} Layer {index + 1}
                                                                </p>
                                                                {layer.type === 'text' && (
                                                                    <p className="text-xs text-gray-500">"{layer.content}"</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <Badge variant="secondary">
                                                            {layer.type}
                                                        </Badge>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-2">JSON Configuration</h4>
                                            <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto max-h-60">
                                                {JSON.stringify(template.json_config, null, 2)}
                                            </pre>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Template Info */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Template Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Status</span>
                                        <Badge 
                                            variant={template.is_active ? "default" : "secondary"}
                                            className={template.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                                        >
                                            {template.is_active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Premium</span>
                                        <Badge variant={template.is_premium ? "default" : "secondary"}>
                                            {template.is_premium ? 'Yes' : 'No'}
                                        </Badge>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Category</span>
                                        <Badge 
                                            variant="secondary" 
                                            style={{ backgroundColor: template.category.color + '20', color: template.category.color }}
                                        >
                                            {template.category.name}
                                        </Badge>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Resolution</span>
                                        <span className="text-sm font-medium">{template.resolution}</span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Duration</span>
                                        <span className="text-sm font-medium">{template.duration}s</span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Statistics */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Statistics</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Download className="w-4 h-4 mr-2" />
                                            Downloads
                                        </div>
                                        <span className="text-sm font-medium">{template.downloads_count}</span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Eye className="w-4 h-4 mr-2" />
                                            Views
                                        </div>
                                        <span className="text-sm font-medium">{template.views_count}</span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Star className="w-4 h-4 mr-2" />
                                            Rating
                                        </div>
                                        <div className="flex items-center">
                                            <span className="text-sm font-medium">
                                                {template.rating ? Number(template.rating).toFixed(1) : '0.0'}
                                            </span>
                                            <span className="text-xs text-gray-500 ml-1">
                                                ({template.ratings_count})
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Keywords */}
                            {template.keywords && template.keywords.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Keywords</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-2">
                                            {template.keywords.map((keyword, index) => (
                                                <Badge key={index} variant="outline">
                                                    <Tag className="w-3 h-3 mr-1" />
                                                    {keyword}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Dates */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Timeline</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        <span>Created: {new Date(template.created_at).toLocaleDateString()}</span>
                                    </div>
                                    
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Clock className="w-4 h-4 mr-2" />
                                        <span>Updated: {new Date(template.updated_at).toLocaleDateString()}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Actions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <Link href={route('admin.templates.edit', { id: template.id })} className="w-full">
                                        <Button variant="outline" className="w-full justify-start">
                                            <Edit className="w-4 h-4 mr-2" />
                                            Edit Template
                                        </Button>
                                    </Link>
                                    
                                    <Button variant="outline" className="w-full justify-start">
                                        <Settings className="w-4 h-4 mr-2" />
                                        Template Settings
                                    </Button>
                                    
                                    <Button variant="outline" className="w-full justify-start">
                                        <Download className="w-4 h-4 mr-2" />
                                        Export Template
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
