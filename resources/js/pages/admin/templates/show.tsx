import { AdminSidebarLayout } from '@/layouts/admin/admin-sidebar-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    FileText,
    ArrowLeft,
    Edit,
    Copy,
    Trash2,
    Eye,
    Image as ImageIcon,
    Calendar,
    User,
    Tag,
    Hash,
    Clock
} from 'lucide-react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import SuccessMessage from '@/components/success-message';
import ErrorMessage from '@/components/error-message';
import DeleteConfirmationModal from '@/components/delete-confirmation-modal';

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
    admin: {
        id: number;
        name: string;
    };
}

interface AdminTemplateShowProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    };
    template: Template;
}

export default function AdminTemplateShow({ auth, template }: AdminTemplateShowProps) {
    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        isLoading: boolean;
    }>({
        isOpen: false,
        isLoading: false,
    });

    const { props } = usePage();
    const success = (props as any).flash?.success;
    const error = (props as any).flash?.error;

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'published':
                return <Badge variant="default" className="bg-green-100 text-green-800">Published</Badge>;
            case 'draft':
                return <Badge variant="secondary">Draft</Badge>;
            case 'archived':
                return <Badge variant="outline">Archived</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const handleDeleteClick = () => {
        setDeleteModal({
            isOpen: true,
            isLoading: false,
        });
    };

    const handleDeleteConfirm = () => {
        setDeleteModal(prev => ({ ...prev, isLoading: true }));

        router.delete(`/admin/templates/${template.id}`, {
            preserveState: false,
            onSuccess: () => {
                setDeleteModal({
                    isOpen: false,
                    isLoading: false,
                });
            },
            onError: (errors) => {
                console.error('Error deleting template:', errors);
                setDeleteModal(prev => ({ ...prev, isLoading: false }));
            }
        });
    };

    const handleDeleteCancel = () => {
        setDeleteModal({
            isOpen: false,
            isLoading: false,
        });
    };

    const handleDuplicate = () => {
        router.post(`/admin/templates/${template.id}/duplicate`, {}, {
            preserveState: false,
        });
    };

    const handleStatusToggle = () => {
        router.patch(`/admin/templates/${template.id}/toggle-status`, {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const getCategoryDisplayName = (category: string) => {
        const categoryNames: Record<string, string> = {
            'birthday': 'Birthday',
            'wedding': 'Wedding',
            'festival': 'Festival',
            'quotes': 'Quotes',
            'anniversary': 'Anniversary',
            'graduation': 'Graduation',
            'holiday': 'Holiday',
            'business': 'Business',
            'social': 'Social',
            'general': 'General'
        };
        return categoryNames[category] || category;
    };

    return (
        <AdminSidebarLayout>
            <Head title={`Template: ${template.name}`} />
            <div className="space-y-6 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">{template.name}</h1>
                        <p className="text-muted-foreground">
                            Template details and preview
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={handleStatusToggle}
                            className="flex items-center gap-2"
                        >
                            {template.status === 'published' ? 'Archive' : 'Publish'}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleDuplicate}
                            className="flex items-center gap-2"
                        >
                            <Copy className="h-4 w-4" />
                            Duplicate
                        </Button>
                        <Button asChild>
                            <Link href={`/admin/templates/${template.id}/edit`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
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

                {/* Success/Error Messages */}
                {success && (
                    <SuccessMessage message={success} className="mb-4" />
                )}
                {error && (
                    <ErrorMessage message={error} className="mb-4" />
                )}

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Template Preview */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Eye className="h-5 w-5" />
                                    Template Preview
                                </CardTitle>
                                <CardDescription>
                                    Current template layout and design
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {/* Thumbnail */}
                                    <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                                        {template.thumbnail_url ? (
                                            <img
                                                src={template.thumbnail_url}
                                                alt={template.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <div className="text-center">
                                                    <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                                    <p className="text-muted-foreground">No preview available</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* JSON Layout Info */}
                                    <div className="p-4 bg-muted/50 rounded-lg">
                                        <h4 className="font-medium mb-2">Layout Information</h4>
                                        <div className="grid gap-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Objects:</span>
                                                <span>{Array.isArray(template.json_layout?.objects) ? template.json_layout.objects.length : 0}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Version:</span>
                                                <span>{template.json_layout?.version || 'Unknown'}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Background:</span>
                                                <span>{template.json_layout?.background ? 'Set' : 'None'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* JSON Layout Raw Data (Collapsible) */}
                                    <details className="group">
                                        <summary className="cursor-pointer font-medium text-sm text-muted-foreground hover:text-foreground">
                                            View JSON Layout
                                        </summary>
                                        <div className="mt-2 p-4 bg-muted/30 rounded-lg">
                                            <pre className="text-xs overflow-auto max-h-64">
                                                {JSON.stringify(template.json_layout, null, 2)}
                                            </pre>
                                        </div>
                                    </details>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Template Details */}
                    <div className="space-y-6">
                        {/* Basic Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Hash className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">ID:</span>
                                        <span className="font-mono">{template.id}</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Tag className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">Slug:</span>
                                        <span className="font-mono">{template.slug}</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Badge variant="outline">
                                            {getCategoryDisplayName(template.category)}
                                        </Badge>
                                        {template.is_default && (
                                            <Badge variant="secondary">Default</Badge>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    {getStatusBadge(template.status)}
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Hash className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">Version:</span>
                                        <span>{template.version}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Description */}
                        {template.description && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Description</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        {template.description}
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                        {/* Tags */}
                        {template.tags && template.tags.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Tags</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-1">
                                        {template.tags.map((tag, index) => (
                                            <Badge key={index} variant="secondary" className="text-xs">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Metadata */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Metadata</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">Created by:</span>
                                        <span>{template.admin.name}</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">Created:</span>
                                        <span>{new Date(template.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">Updated:</span>
                                        <span>{new Date(template.updated_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button asChild className="w-full">
                                    <Link href={`/admin/templates/${template.id}/edit`}>
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit Template
                                    </Link>
                                </Button>

                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={handleDuplicate}
                                >
                                    <Copy className="h-4 w-4 mr-2" />
                                    Duplicate Template
                                </Button>

                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={handleStatusToggle}
                                >
                                    {template.status === 'published' ? 'Archive' : 'Publish'} Template
                                </Button>

                                <Button
                                    variant="destructive"
                                    className="w-full"
                                    onClick={handleDeleteClick}
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Template
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Delete Confirmation Modal */}
                <DeleteConfirmationModal
                    isOpen={deleteModal.isOpen}
                    onClose={handleDeleteCancel}
                    onConfirm={handleDeleteConfirm}
                    title="Delete Template"
                    description="Are you sure you want to delete this template? This action cannot be undone."
                    itemName={template.name}
                    isLoading={deleteModal.isLoading}
                />
            </div>
        </AdminSidebarLayout>
    );
}
