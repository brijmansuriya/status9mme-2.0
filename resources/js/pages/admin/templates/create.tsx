import { AdminSidebarLayout } from '@/layouts/admin/admin-sidebar-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import PolotnoEditor from '@/components/polotno-editor';
import { 
    FileText, 
    ArrowLeft,
    Save,
    Plus,
    X,
    Upload,
    Eye
} from 'lucide-react';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

interface AdminTemplateCreateProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    };
    categories: Record<string, string>;
}

export default function AdminTemplateCreate({ auth, categories }: AdminTemplateCreateProps) {
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [jsonLayout, setJsonLayout] = useState<object | null>(null);
    const [uploadMode, setUploadMode] = useState<'create' | 'upload' | 'default'>('create');
    const [showEditor, setShowEditor] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        json_layout: null as object | null,
        thumbnail_url: '',
        category: 'general',
        tags: [] as string[],
        version: 1,
        status: 'draft',
        is_default: false,
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

    const handleDefaultTemplateSelect = (templateType: string) => {
        // This would load a predefined template JSON
        const defaultTemplate = {
            version: "5.3.0",
            objects: [
                {
                    type: "text",
                    text: "Sample Text",
                    fontSize: 48,
                    fontFamily: "Arial",
                    fill: "#000000",
                    x: 100,
                    y: 100,
                    width: 300,
                    height: 60
                }
            ],
            background: {
                type: "color",
                color: "#ffffff"
            }
        };
        setJsonLayout(defaultTemplate);
        setData('json_layout', defaultTemplate);
        setShowEditor(true);
        setUploadMode('create');
    };

    const handleEditorSave = (data: object) => {
        setJsonLayout(data);
        setData('json_layout', data);
        setShowEditor(false);
    };

    const handleEditorCancel = () => {
        setShowEditor(false);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        if (!data.json_layout) {
            alert('Please create, upload, or select a template layout.');
            return;
        }

        post('/admin/templates', {
            preserveScroll: true,
            onSuccess: () => {
                // Success message will be handled by the controller
            },
            onError: (errors) => {
                console.error('Error creating template:', errors);
            }
        });
    };

    return (
        <AdminSidebarLayout>
            <Head title="Create Template" />
            <div className="space-y-6 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Create Template</h1>
                        <p className="text-muted-foreground">
                            Create a new template using drag & drop editor, upload JSON, or select from defaults
                        </p>
                    </div>
                    <Button asChild variant="outline">
                        <Link href="/admin/templates">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Templates
                        </Link>
                    </Button>
                </div>

                {/* Template Creation Modes */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Template Creation Method
                        </CardTitle>
                        <CardDescription>
                            Choose how you want to create your template
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-3">
                            <Button
                                variant={uploadMode === 'create' ? 'default' : 'outline'}
                                onClick={() => {
                                    setUploadMode('create');
                                    setShowEditor(true);
                                }}
                                className="h-20 flex flex-col gap-2"
                            >
                                <Plus className="h-6 w-6" />
                                <span>Drag & Drop</span>
                                <span className="text-xs opacity-70">Create with Polotno Editor</span>
                            </Button>
                            <Button
                                variant={uploadMode === 'upload' ? 'default' : 'outline'}
                                onClick={() => setUploadMode('upload')}
                                className="h-20 flex flex-col gap-2"
                            >
                                <Upload className="h-6 w-6" />
                                <span>Upload JSON</span>
                                <span className="text-xs opacity-70">Import existing template</span>
                            </Button>
                            <Button
                                variant={uploadMode === 'default' ? 'default' : 'outline'}
                                onClick={() => setUploadMode('default')}
                                className="h-20 flex flex-col gap-2"
                            >
                                <Eye className="h-6 w-6" />
                                <span>Default Templates</span>
                                <span className="text-xs opacity-70">Start from ready templates</span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Template Editor/Upload Area */}
                {uploadMode === 'create' && showEditor && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Polotno Editor</CardTitle>
                            <CardDescription>
                                Create your template using the drag & drop editor
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="h-96">
                                <PolotnoEditor
                                    initialData={jsonLayout || undefined}
                                    onSave={handleEditorSave}
                                    onCancel={handleEditorCancel}
                                    isVisible={true}
                                />
                            </div>
                        </CardContent>
                    </Card>
                )}

                {uploadMode === 'create' && !showEditor && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Polotno Editor</CardTitle>
                            <CardDescription>
                                Click the button below to open the drag & drop editor
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                                <div className="text-center">
                                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-muted-foreground mb-4">Ready to create your template?</p>
                                    <Button onClick={() => setShowEditor(true)}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Open Editor
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {uploadMode === 'upload' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Upload JSON Template</CardTitle>
                            <CardDescription>
                                Upload a previously exported template file
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-muted-foreground mb-2">Upload your template JSON file</p>
                                    <input
                                        type="file"
                                        accept=".json"
                                        onChange={handleJsonUpload}
                                        className="hidden"
                                        id="json-upload"
                                    />
                                    <Button asChild variant="outline">
                                        <label htmlFor="json-upload" className="cursor-pointer">
                                            Choose File
                                        </label>
                                    </Button>
                                </div>
                                {jsonLayout && (
                                    <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                                        <p className="text-green-800 text-sm">
                                            ✓ Template loaded successfully! Preview will be shown below.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {uploadMode === 'default' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Default Templates</CardTitle>
                            <CardDescription>
                                Choose from our collection of ready-to-use templates
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {Object.entries(categories).map(([key, value]) => (
                                    <Button
                                        key={key}
                                        variant="outline"
                                        onClick={() => handleDefaultTemplateSelect(key)}
                                        className="h-24 flex flex-col gap-2"
                                    >
                                        <span className="font-medium">{value}</span>
                                        <span className="text-xs opacity-70">Template</span>
                                    </Button>
                                ))}
                            </div>
                            {jsonLayout && (
                                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                                    <p className="text-green-800 text-sm">
                                        ✓ Default template loaded! You can customize it in the form below.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Template Details Form */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Template Details
                        </CardTitle>
                        <CardDescription>
                            Fill in the information for the new template
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

                            {/* JSON Layout Validation */}
                            {errors.json_layout && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                                    <p className="text-red-800 text-sm">{errors.json_layout}</p>
                                </div>
                            )}

                            {/* Form Actions */}
                            <div className="flex items-center justify-end gap-4 pt-6 border-t">
                                <Button asChild variant="outline">
                                    <Link href="/admin/templates">Cancel</Link>
                                </Button>
                                <Button type="submit" disabled={processing || !jsonLayout}>
                                    <Save className="h-4 w-4 mr-2" />
                                    {processing ? 'Creating...' : 'Create Template'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AdminSidebarLayout>
    );
}
