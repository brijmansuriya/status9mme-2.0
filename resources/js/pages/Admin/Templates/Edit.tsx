import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Save, Eye, Upload, X, Plus, Trash2 } from 'lucide-react';

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
    category: {
        id: number;
        name: string;
        color: string;
    };
}

interface Category {
    id: number;
    name: string;
    color: string;
}

interface EditProps {
    template: Template;
    categories: Category[];
}

export default function Edit({ template, categories }: EditProps) {
    const [jsonConfig, setJsonConfig] = useState(template.json_config || {
        duration: 15,
        resolution: '1080x1920',
        layers: []
    });
    const [previewMode, setPreviewMode] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        category_id: template.category_id,
        name: template.name,
        description: template.description,
        json_config: jsonConfig,
        thumbnail: null as File | null,
        preview_video: null as File | null,
        is_premium: template.is_premium,
        is_active: template.is_active,
        keywords: template.keywords.join(', '),
        resolution: template.resolution,
        duration: template.duration,
    });

    useEffect(() => {
        setData('json_config', jsonConfig);
    }, [jsonConfig]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.templates.update', template.id), {
            forceFormData: true,
            onSuccess: () => {
                // Handle success
            }
        });
    };

    const addLayer = (type: 'text' | 'image' | 'video' | 'audio') => {
        const newLayer = {
            type,
            id: Date.now(),
            content: type === 'text' ? 'New Text Layer' : '',
            position: { x: 100, y: 100 },
            size: { width: 200, height: 50 },
            ...(type === 'text' && {
                fontSize: 24,
                color: '#000000',
                fontFamily: 'Arial',
                textAlign: 'center'
            })
        };

        setJsonConfig(prev => ({
            ...prev,
            layers: [...(prev.layers || []), newLayer]
        }));
    };

    const updateLayer = (index: number, field: string, value: any) => {
        setJsonConfig(prev => ({
            ...prev,
            layers: prev.layers.map((layer: any, i: number) => 
                i === index ? { ...layer, [field]: value } : layer
            )
        }));
    };

    const removeLayer = (index: number) => {
        setJsonConfig(prev => ({
            ...prev,
            layers: prev.layers.filter((_: any, i: number) => i !== index)
        }));
    };

    const renderLayerEditor = (layer: any, index: number) => {
        return (
            <Card key={index} className="mb-4">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                            {layer.type.charAt(0).toUpperCase() + layer.type.slice(1)} Layer {index + 1}
                        </CardTitle>
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeLayer(index)}
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {layer.type === 'text' && (
                        <>
                            <div>
                                <Label>Text Content</Label>
                                <Input
                                    value={layer.content}
                                    onChange={(e) => updateLayer(index, 'content', e.target.value)}
                                    placeholder="Enter text content"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Font Size</Label>
                                    <Input
                                        type="number"
                                        value={layer.fontSize}
                                        onChange={(e) => updateLayer(index, 'fontSize', parseInt(e.target.value))}
                                    />
                                </div>
                                <div>
                                    <Label>Color</Label>
                                    <Input
                                        type="color"
                                        value={layer.color}
                                        onChange={(e) => updateLayer(index, 'color', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Font Family</Label>
                                    <Select
                                        value={layer.fontFamily}
                                        onValueChange={(value) => updateLayer(index, 'fontFamily', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Arial">Arial</SelectItem>
                                            <SelectItem value="Helvetica">Helvetica</SelectItem>
                                            <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                                            <SelectItem value="Georgia">Georgia</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Text Alignment</Label>
                                    <Select
                                        value={layer.textAlign}
                                        onValueChange={(value) => updateLayer(index, 'textAlign', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="left">Left</SelectItem>
                                            <SelectItem value="center">Center</SelectItem>
                                            <SelectItem value="right">Right</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Position X</Label>
                            <Input
                                type="number"
                                value={layer.position.x}
                                onChange={(e) => updateLayer(index, 'position', {
                                    ...layer.position,
                                    x: parseInt(e.target.value)
                                })}
                            />
                        </div>
                        <div>
                            <Label>Position Y</Label>
                            <Input
                                type="number"
                                value={layer.position.y}
                                onChange={(e) => updateLayer(index, 'position', {
                                    ...layer.position,
                                    y: parseInt(e.target.value)
                                })}
                            />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Width</Label>
                            <Input
                                type="number"
                                value={layer.size.width}
                                onChange={(e) => updateLayer(index, 'size', {
                                    ...layer.size,
                                    width: parseInt(e.target.value)
                                })}
                            />
                        </div>
                        <div>
                            <Label>Height</Label>
                            <Input
                                type="number"
                                value={layer.size.height}
                                onChange={(e) => updateLayer(index, 'size', {
                                    ...layer.size,
                                    height: parseInt(e.target.value)
                                })}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <>
            <Head title={`Edit Template - ${template.name}`} />
            
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Edit Template</h1>
                        <p className="text-gray-600">Modify template configuration and settings</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main Form */}
                            <div className="lg:col-span-2 space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Basic Information</CardTitle>
                                        <CardDescription>
                                            Configure the basic template details
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <Label htmlFor="name">Template Name</Label>
                                            <Input
                                                id="name"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className="mt-1"
                                            />
                                            {errors.name && (
                                                <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="description">Description</Label>
                                            <Textarea
                                                id="description"
                                                value={data.description}
                                                onChange={(e) => setData('description', e.target.value)}
                                                className="mt-1"
                                                rows={3}
                                            />
                                            {errors.description && (
                                                <p className="text-sm text-red-600 mt-1">{errors.description}</p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="category_id">Category</Label>
                                                <Select
                                                    value={data.category_id.toString()}
                                                    onValueChange={(value) => setData('category_id', parseInt(value))}
                                                >
                                                    <SelectTrigger className="mt-1">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {categories.map(category => (
                                                            <SelectItem key={category.id} value={category.id.toString()}>
                                                                {category.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {errors.category_id && (
                                                    <p className="text-sm text-red-600 mt-1">{errors.category_id}</p>
                                                )}
                                            </div>

                                            <div>
                                                <Label htmlFor="resolution">Resolution</Label>
                                                <Select
                                                    value={data.resolution}
                                                    onValueChange={(value) => setData('resolution', value)}
                                                >
                                                    <SelectTrigger className="mt-1">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="1080x1920">1080x1920 (Mobile)</SelectItem>
                                                        <SelectItem value="1920x1080">1920x1080 (Desktop)</SelectItem>
                                                        <SelectItem value="1080x1080">1080x1080 (Square)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="duration">Duration (seconds)</Label>
                                                <Input
                                                    id="duration"
                                                    type="number"
                                                    min="1"
                                                    max="60"
                                                    value={data.duration}
                                                    onChange={(e) => setData('duration', parseInt(e.target.value))}
                                                    className="mt-1"
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="keywords">Keywords (comma separated)</Label>
                                                <Input
                                                    id="keywords"
                                                    value={data.keywords}
                                                    onChange={(e) => setData('keywords', e.target.value)}
                                                    className="mt-1"
                                                    placeholder="birthday, celebration, party"
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle>Template Configuration</CardTitle>
                                                <CardDescription>
                                                    Configure layers and visual elements
                                                </CardDescription>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => addLayer('text')}
                                                >
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    Add Text
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => addLayer('image')}
                                                >
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    Add Image
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        {jsonConfig.layers?.map((layer: any, index: number) => 
                                            renderLayerEditor(layer, index)
                                        )}
                                        
                                        {(!jsonConfig.layers || jsonConfig.layers.length === 0) && (
                                            <div className="text-center py-8 text-gray-500">
                                                <p>No layers added yet. Click "Add Text" or "Add Image" to get started.</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Settings</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="is_premium">Premium Template</Label>
                                            <Switch
                                                id="is_premium"
                                                checked={data.is_premium}
                                                onCheckedChange={(checked) => setData('is_premium', checked)}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="is_active">Active</Label>
                                            <Switch
                                                id="is_active"
                                                checked={data.is_active}
                                                onCheckedChange={(checked) => setData('is_active', checked)}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Media Files</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <Label htmlFor="thumbnail">Thumbnail</Label>
                                            <Input
                                                id="thumbnail"
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setData('thumbnail', e.target.files?.[0] || null)}
                                                className="mt-1"
                                            />
                                            {template.thumbnail && (
                                                <div className="mt-2">
                                                    <img 
                                                        src={`/storage/${template.thumbnail}`} 
                                                        alt="Current thumbnail"
                                                        className="w-20 h-20 object-cover rounded"
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="preview_video">Preview Video</Label>
                                            <Input
                                                id="preview_video"
                                                type="file"
                                                accept="video/*"
                                                onChange={(e) => setData('preview_video', e.target.files?.[0] || null)}
                                                className="mt-1"
                                            />
                                            {template.preview_video && (
                                                <div className="mt-2">
                                                    <video 
                                                        src={`/storage/${template.preview_video}`} 
                                                        className="w-32 h-20 object-cover rounded"
                                                        controls
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>JSON Preview</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
                                            {JSON.stringify(jsonConfig, null, 2)}
                                        </pre>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end space-x-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => window.history.back()}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {processing ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
