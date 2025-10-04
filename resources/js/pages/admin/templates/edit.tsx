import { AdminSidebarLayout } from '@/layouts/admin/admin-sidebar-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
    FileText,
    ArrowLeft,
    Save,
    X,
    Upload,
    Eye
} from 'lucide-react';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

interface Template {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    json_layout: object;
    thumbnail_url: string | null;
    category: string;
    tags: string[] | null;
    version: number;
    status: 'draft' | 'published' | 'archived';
    is_default: boolean;
    created_at: string;
    updated_at: string;
}

interface AdminTemplateEditProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    };
    template: Template;
    categories: Record<string, string>;
}

export default function AdminTemplateEdit({ auth, template, categories }: AdminTemplateEditProps) {
    const [tags, setTags] = useState<string[]>(template.tags || []);
    const [tagInput, setTagInput] = useState('');
    const [jsonLayout, setJsonLayout] = useState<object>(template.json_layout);

    const { data, setData, put, processing, errors } = useForm({
        name: template.name,
        description: template.description || '',
        json_layout: template.json_layout,
        thumbnail_url: template.thumbnail_url || '',
        category: template.category,
        tags: template.tags || [],
        version: template.version,
        status: template.status,
        is_default: template.is_default,
    });

    const addTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            const newTags = [...tags, tagInput.trim()];
            setTags(newTags);
            setData('tags', newTags);
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        const newTags = tags.filter(tag => tag !== tagToRemove);
        setTags(newTags);
        setData('tags', newTags);
    };

    const handleTagKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag();
        }
    };

    const handleJsonUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const jsonData = JSON.parse(event.target?.result as string);
                    setJsonLayout(jsonData);
                    setData('json_layout', jsonData);
                } catch (error) {
                    console.error('Invalid JSON file:', error);
                    alert('Invalid JSON file. Please upload a valid Polotno template file.');
                }
            };
            reader.readAsText(file);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (!data.json_layout) {
            alert('Template layout is required.');
            return;
        }

        put(`/admin/templates/${template.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                // Success message will be handled by the controller
            },
            onError: (errors) => {
                console.error('Error updating template:', errors);
            }
        });
    };

    return (
        <AdminSidebarLayout>
            <Head title={`Edit Template: ${template.name}`} />
            <div className="space-y-6 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Edit Template</h1>
                        <p className="text-muted-foreground">
                            Update template information and layout
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button asChild variant="outline">
                            <Link href={`/admin/templates/${template.id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                View
                            </Link>
                        </Button>
                        <Button asChild variant="outline">
                            <Link href="/admin/templates">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Templates
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Current Template Preview */}
                <Card>
                    <CardHeader>
                        <CardTitle>Current Template</CardTitle>
                        <CardDescription>
                            Version {template.version} • Last updated {new Date(template.updated_at).toLocaleDateString()}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Thumbnail Preview */}
                            <div className="space-y-2">
                                <Label>Thumbnail Preview</Label>
                                <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                                    {template.thumbnail_url ? (
                                        <img
                                            src={template.thumbnail_url}
                                            alt={template.name}
                                            className="w-full h-full object-cover rounded-md"
                                        />
                                    ) : (
                                        <div className="text-center">
                                            <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                            <p className="text-muted-foreground text-sm">No thumbnail</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Template Info */}
                            <div className="space-y-4">
                                <div>
                                    <Label className="text-sm font-medium">Template Name</Label>
                                    <p className="text-foreground">{template.name}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium">Category</Label>
                                    <p className="text-foreground">{categories[template.category] || template.category}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium">Status</Label>
                                    <Badge variant={
                                        template.status === 'published' ? 'default' :
                                            template.status === 'draft' ? 'secondary' : 'outline'
                                    }>
                                        {template.status}
                                    </Badge>
                                </div>
                                {template.tags && template.tags.length > 0 && (
                                    <div>
                                        <Label className="text-sm font-medium">Tags</Label>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {template.tags.map((tag, index) => (
                                                <Badge key={index} variant="secondary" className="text-xs">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Template Details Form */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Edit Template Details
                        </CardTitle>
                        <CardDescription>
                            Update the template information and layout
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                {/* Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="name">Template Name *</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Enter template name"
                                        required
                                        className={errors.name ? 'border-destructive' : ''}
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-destructive">{errors.name}</p>
                                    )}
                                </div>

                                {/* Category */}
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category *</Label>
                                    <Select value={data.category} onValueChange={(value) => setData('category', value)}>
                                        <SelectTrigger className={errors.category ? 'border-destructive' : ''}>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(categories).map(([key, value]) => (
                                                <SelectItem key={key} value={key}>{value}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.category && (
                                        <p className="text-sm text-destructive">{errors.category}</p>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Enter template description (optional)"
                                    rows={4}
                                    className={errors.description ? 'border-destructive' : ''}
                                />
                                {errors.description && (
                                    <p className="text-sm text-destructive">{errors.description}</p>
                                )}
                            </div>

                            {/* Tags */}
                            <div className="space-y-2">
                                <Label htmlFor="tags">Tags</Label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {tags.map((tag, index) => (
                                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => removeTag(tag)}
                                                className="ml-1 hover:text-destructive"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <Input
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyPress={handleTagKeyPress}
                                        placeholder="Add a tag and press Enter"
                                        className={errors.tags ? 'border-destructive' : ''}
                                    />
                                    <Button type="button" onClick={addTag} variant="outline">
                                        Add
                                    </Button>
                                </div>
                                {errors.tags && (
                                    <p className="text-sm text-destructive">{errors.tags}</p>
                                )}
                            </div>

                            {/* JSON Layout Upload */}
                            <div className="space-y-2">
                                <Label>Template Layout</Label>
                                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <p className="text-sm text-muted-foreground mb-2">
                                                Upload a new JSON layout to replace the current one
                                            </p>
                                            <input
                                                type="file"
                                                accept=".json"
                                                onChange={handleJsonUpload}
                                                className="hidden"
                                                id="json-upload"
                                            />
                                            <Button asChild variant="outline" size="sm">
                                                <label htmlFor="json-upload" className="cursor-pointer">
                                                    <Upload className="h-4 w-4 mr-2" />
                                                    Upload New Layout
                                                </label>
                                            </Button>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            Current version: {template.version}
                                        </div>
                                    </div>
                                </div>
                                {errors.json_layout && (
                                    <p className="text-sm text-destructive">{errors.json_layout}</p>
                                )}
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                {/* Status */}
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status *</Label>
                                    <Select value={data.status} onValueChange={(value) => setData('status', value as 'draft' | 'published' | 'archived')}>
                                        <SelectTrigger className={errors.status ? 'border-destructive' : ''}>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="draft">Draft</SelectItem>
                                            <SelectItem value="published">Published</SelectItem>
                                            <SelectItem value="archived">Archived</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.status && (
                                        <p className="text-sm text-destructive">{errors.status}</p>
                                    )}
                                </div>

                                {/* Is Default */}
                                <div className="space-y-2">
                                    <Label>Default Template</Label>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="is_default"
                                            checked={data.is_default}
                                            onChange={(e) => setData('is_default', e.target.checked)}
                                            className="rounded border-gray-300"
                                        />
                                        <Label htmlFor="is_default" className="text-sm">
                                            Mark as system default template
                                        </Label>
                                    </div>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex items-center justify-end gap-4 pt-6 border-t">
                                <Button asChild variant="outline">
                                    <Link href="/admin/templates">Cancel</Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    <Save className="h-4 w-4 mr-2" />
                                    {processing ? 'Updating...' : 'Update Template'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AdminSidebarLayout>
    );
}
