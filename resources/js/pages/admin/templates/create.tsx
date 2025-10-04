import { Head, Link, useForm, router } from '@inertiajs/react';
import { AdminSidebarLayout } from '@/layouts/admin/admin-sidebar-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
    ArrowLeft,
    Save,
    Upload,
    FileText,
    Image as ImageIcon,
    Sparkles,
    Palette,
    FolderOpen
} from 'lucide-react';
import { useState } from 'react';
import PolotnoEditor from '@/components/polotno-editor';
import CanvaEditor from '@/components/canva-editor';

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface AdminCreateTemplateProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    };
    categories: Category[] | Record<string, string>;
}

type CreationMode = 'canva-editor' | 'drag-drop' | 'json-upload' | 'default-templates';

export default function AdminCreateTemplate({ auth, categories }: AdminCreateTemplateProps) {
    const [creationMode, setCreationMode] = useState<CreationMode>('canva-editor');
    const [showEditor, setShowEditor] = useState(false);
    const [editorData, setEditorData] = useState<object | null>(null);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        category: '',
        tags: [] as string[],
        status: 'draft' as 'draft' | 'published' | 'archived',
        is_default: false,
        json_layout: {} as object,
        thumbnail_url: null as string | null,
    });

    const handleTagInput = (value: string) => {
        const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
        setData('tags', tags);
    };

    const handleEditorSave = (templateData: object) => {
        setEditorData(templateData);
        setData('json_layout', templateData);
        setShowEditor(false);
    };

    const handleEditorCancel = () => {
        setShowEditor(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/templates');
    };

    const defaultTemplates = [
        {
            id: 'birthday',
            name: 'Birthday Celebration',
            description: 'Colorful birthday template with balloons and confetti',
            category: 'birthday',
            thumbnail: '/images/templates/birthday.jpg'
        },
        {
            id: 'wedding',
            name: 'Wedding Invitation',
            description: 'Elegant wedding template with romantic elements',
            category: 'wedding',
            thumbnail: '/images/templates/wedding.jpg'
        },
        {
            id: 'business',
            name: 'Business Professional',
            description: 'Clean and professional business template',
            category: 'business',
            thumbnail: '/images/templates/business.jpg'
        },
        {
            id: 'festival',
            name: 'Festival Celebration',
            description: 'Vibrant festival template with cultural elements',
            category: 'festival',
            thumbnail: '/images/templates/festival.jpg'
        }
    ];

    if (showEditor) {
        return (
            <AdminSidebarLayout>
                <Head title="Create Template - Editor" />
                <div className="h-screen">
                    {creationMode === 'canva-editor' ? (
                        <CanvaEditor
                            initialData={editorData}
                            onSave={handleEditorSave}
                            onCancel={handleEditorCancel}
                            mode="create"
                        />
                    ) : (
                        <PolotnoEditor
                            initialData={editorData}
                            onSave={handleEditorSave}
                            onCancel={handleEditorCancel}
                            mode="create"
                        />
                    )}
                </div>
            </AdminSidebarLayout>
        );
    }

    return (
        <AdminSidebarLayout>
            <Head title="Create Template" />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
                <div className="space-y-6 p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                            >
                                <Link href="/admin/templates">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back to Templates
                                </Link>
                            </Button>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                    <Sparkles className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Create Template</h1>
                                    <p className="text-slate-600 dark:text-slate-400">
                                        Choose how you want to create your template
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Creation Mode Selection */}
                        <div className="lg:col-span-1">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Creation Method</CardTitle>
                                    <CardDescription>
                                        Choose how you want to create your template
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button
                                        variant={creationMode === 'canva-editor' ? 'default' : 'outline'}
                                        className="w-full justify-start"
                                        onClick={() => setCreationMode('canva-editor')}
                                    >
                                        <Sparkles className="h-4 w-4 mr-2" />
                                        Canva Editor (Professional)
                                    </Button>
                                    <Button
                                        variant={creationMode === 'drag-drop' ? 'default' : 'outline'}
                                        className="w-full justify-start"
                                        onClick={() => setCreationMode('drag-drop')}
                                    >
                                        <Palette className="h-4 w-4 mr-2" />
                                        Simple Editor
                                    </Button>
                                    <Button
                                        variant={creationMode === 'json-upload' ? 'default' : 'outline'}
                                        className="w-full justify-start"
                                        onClick={() => setCreationMode('json-upload')}
                                    >
                                        <Upload className="h-4 w-4 mr-2" />
                                        Upload JSON
                                    </Button>
                                    <Button
                                        variant={creationMode === 'default-templates' ? 'default' : 'outline'}
                                        className="w-full justify-start"
                                        onClick={() => setCreationMode('default-templates')}
                                    >
                                        <FolderOpen className="h-4 w-4 mr-2" />
                                        Default Templates
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            {creationMode === 'canva-editor' && (
                                <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-700">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                                            <Sparkles className="h-5 w-5" />
                                            Canva Editor - Professional Template Creator
                                        </CardTitle>
                                        <CardDescription className="text-blue-600 dark:text-blue-400">
                                            Professional-grade template editor with scene management, advanced tools, and export capabilities
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-3">
                                                <h4 className="font-semibold text-slate-900 dark:text-slate-100">Features:</h4>
                                                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                                    <li className="flex items-center gap-2">
                                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                        Multiple scenes with timeline
                                                    </li>
                                                    <li className="flex items-center gap-2">
                                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                        Canvas presets (1080×1920, 1080×1080)
                                                    </li>
                                                    <li className="flex items-center gap-2">
                                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                        Advanced drag & drop tools
                                                    </li>
                                                    <li className="flex items-center gap-2">
                                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                        Property panels for fine-tuning
                                                    </li>
                                                    <li className="flex items-center gap-2">
                                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                        Export to JSON and video
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="space-y-3">
                                                <h4 className="font-semibold text-slate-900 dark:text-slate-100">Tools Available:</h4>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {['Text', 'Images', 'Shapes', 'Audio', 'Video', 'Stickers', 'Backgrounds', 'Effects'].map((tool) => (
                                                        <div key={tool} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                                                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                                                            {tool}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-center py-6 space-y-3">
                                            <Button
                                                onClick={() => setShowEditor(true)}
                                                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3"
                                            >
                                                <Sparkles className="h-5 w-5 mr-2" />
                                                Open Canva Editor (Embedded)
                                            </Button>
                                            <div className="text-sm text-slate-500 dark:text-slate-400">or</div>
                                            <Button
                                                onClick={() => router.visit('/admin/templates/canva-editor')}
                                                variant="outline"
                                                className="border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10 px-8 py-3"
                                            >
                                                <Sparkles className="h-5 w-5 mr-2" />
                                                Open Fullscreen Canva Editor
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {creationMode === 'drag-drop' && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Palette className="h-5 w-5" />
                                            Drag & Drop Editor
                                        </CardTitle>
                                        <CardDescription>
                                            Use the visual editor to create your template with drag and drop elements
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="text-center py-8">
                                            <Sparkles className="h-16 w-16 text-primary mx-auto mb-4" />
                                            <h3 className="text-lg font-semibold mb-2">Visual Template Editor</h3>
                                            <p className="text-muted-foreground mb-6">
                                                Create templates with text, images, audio, shapes, and stickers using our intuitive drag & drop editor
                                            </p>
                                            <Button onClick={() => setShowEditor(true)}>
                                                <Palette className="h-4 w-4 mr-2" />
                                                Open Editor
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {creationMode === 'json-upload' && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Upload className="h-5 w-5" />
                                            Upload JSON Template
                                        </CardTitle>
                                        <CardDescription>
                                            Import an existing template from a JSON file
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8">
                                            <div className="text-center">
                                                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                                <h3 className="text-lg font-medium mb-2">Upload JSON File</h3>
                                                <p className="text-muted-foreground mb-4">
                                                    Select a JSON file exported from a template editor
                                                </p>
                                                <input
                                                    type="file"
                                                    accept=".json"
                                                    className="hidden"
                                                    id="json-upload"
                                                />
                                                <Button asChild>
                                                    <label htmlFor="json-upload">
                                                        Choose JSON File
                                                    </label>
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {creationMode === 'default-templates' && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <FolderOpen className="h-5 w-5" />
                                            Default Templates
                                        </CardTitle>
                                        <CardDescription>
                                            Choose from our collection of pre-made templates
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid gap-4 md:grid-cols-2">
                                            {defaultTemplates.map((template) => (
                                                <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                                                    <CardContent className="p-4">
                                                        <div className="aspect-video bg-muted rounded-lg mb-3 flex items-center justify-center">
                                                            <ImageIcon className="h-12 w-12 text-muted-foreground" />
                                                        </div>
                                                        <h4 className="font-medium mb-1">{template.name}</h4>
                                                        <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                                                        <Badge variant="outline">{template.category}</Badge>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>

                    {/* Template Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Template Details</CardTitle>
                            <CardDescription>
                                Fill in the basic information for your template
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Template Name *</Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Enter template name"
                                            className={errors.name ? 'border-red-500' : ''}
                                        />
                                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="category">Category *</Label>
                                        <Select value={data.category} onValueChange={(value) => setData('category', value)}>
                                            <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Array.isArray(categories) ? categories.map((category) => (
                                                    <SelectItem key={category.id} value={category.slug}>
                                                        {category.name}
                                                    </SelectItem>
                                                )) : Object.entries(categories).map(([slug, name]) => (
                                                    <SelectItem key={slug} value={slug}>
                                                        {name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Enter template description"
                                        rows={3}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tags">Tags</Label>
                                    <Input
                                        id="tags"
                                        placeholder="Enter tags separated by commas"
                                        onChange={(e) => handleTagInput(e.target.value)}
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        Tags help categorize and search templates
                                    </p>
                                </div>

                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="status">Status</Label>
                                        <Select value={data.status} onValueChange={(value: any) => setData('status', value)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="draft">Draft</SelectItem>
                                                <SelectItem value="published">Published</SelectItem>
                                                <SelectItem value="archived">Archived</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id="is_default"
                                            checked={data.is_default}
                                            onCheckedChange={(checked) => setData('is_default', checked)}
                                        />
                                        <Label htmlFor="is_default">Set as default template</Label>
                                    </div>
                                </div>

                                {data.tags.length > 0 && (
                                    <div className="space-y-2">
                                        <Label>Preview Tags</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {data.tags.map((tag, index) => (
                                                <Badge key={index} variant="secondary">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-4 pt-4 border-t">
                                    <Button type="submit" disabled={processing}>
                                        {processing ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                                Creating...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="h-4 w-4 mr-2" />
                                                Create Template
                                            </>
                                        )}
                                    </Button>
                                    <Button variant="outline" asChild>
                                        <Link href="/admin/templates">Cancel</Link>
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminSidebarLayout>
    );
}
