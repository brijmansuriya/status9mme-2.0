import { AdminSidebarLayout } from '@/layouts/admin/admin-sidebar-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Folder,
    ArrowLeft,
    Edit,
    Trash2,
    ToggleLeft,
    ToggleRight,
    Calendar,
    Hash,
    Tag
} from 'lucide-react';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import DeleteConfirmationModal from '@/components/delete-confirmation-modal';

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    status: 'active' | 'inactive';
    sort_order: number;
    created_at: string;
    updated_at: string;
}

interface AdminCategoryShowProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    };
    category: Category;
}

export default function AdminCategoryShow({ auth, category }: AdminCategoryShowProps) {
    // Delete confirmation modal state
    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        isLoading: boolean;
    }>({
        isOpen: false,
        isLoading: false,
    });

    const handleStatusToggle = () => {
        router.patch(`/admin/categories/${category.id}/toggle-status`, {}, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                // Success message will be handled by the controller
            },
            onError: (errors) => {
                console.error('Error toggling status:', errors);
            }
        });
    };

    const handleDeleteClick = () => {
        setDeleteModal({
            isOpen: true,
            isLoading: false,
        });
    };

    const handleDeleteConfirm = () => {
        setDeleteModal(prev => ({ ...prev, isLoading: true }));

        router.delete(`/admin/categories/${category.id}`, {
            preserveState: false,
            onSuccess: () => {
                setDeleteModal({
                    isOpen: false,
                    isLoading: false,
                });
                // Success message will be handled by the controller
            },
            onError: (errors) => {
                console.error('Error deleting category:', errors);
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

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>;
            case 'inactive':
                return <Badge variant="secondary">Inactive</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <AdminSidebarLayout>
            <Head title={`Category - ${category.name}`} />
            <div className="space-y-6 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">{category.name}</h1>
                        <p className="text-muted-foreground">
                            Category details and information
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button asChild variant="outline">
                            <Link href="/admin/categories">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Categories
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href={`/admin/categories/${category.id}/edit`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Category
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Category Details */}
                <div className="grid gap-6 md:grid-cols-3">
                    {/* Main Info Card */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Folder className="h-5 w-5" />
                                Category Information
                            </CardTitle>
                            <CardDescription>
                                Basic information about this category
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-muted-foreground">Name</Label>
                                    <div className="text-lg font-semibold text-foreground">{category.name}</div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                                    <div className="flex items-center gap-2">
                                        {getStatusBadge(category.status)}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleStatusToggle}
                                            title={category.status === 'active' ? 'Deactivate' : 'Activate'}
                                        >
                                            {category.status === 'active' ? (
                                                <ToggleRight className="h-4 w-4 text-green-600" />
                                            ) : (
                                                <ToggleLeft className="h-4 w-4 text-gray-400" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-muted-foreground">Slug</Label>
                                    <div className="flex items-center gap-2">
                                        <Tag className="h-4 w-4 text-muted-foreground" />
                                        <code className="bg-muted px-2 py-1 rounded text-sm">{category.slug}</code>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-muted-foreground">Sort Order</Label>
                                    <div className="flex items-center gap-2">
                                        <Hash className="h-4 w-4 text-muted-foreground" />
                                        <Badge variant="outline">{category.sort_order}</Badge>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                                <div className="text-foreground">
                                    {category.description || (
                                        <span className="text-muted-foreground italic">No description provided</span>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        {/* Timestamps */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Timestamps
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-muted-foreground">Created</Label>
                                    <div className="text-sm text-foreground">
                                        {new Date(category.created_at).toLocaleString()}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-muted-foreground">Last Updated</Label>
                                    <div className="text-sm text-foreground">
                                        {new Date(category.updated_at).toLocaleString()}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button asChild className="w-full">
                                    <Link href={`/admin/categories/${category.id}/edit`}>
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit Category
                                    </Link>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={handleStatusToggle}
                                >
                                    {category.status === 'active' ? (
                                        <>
                                            <ToggleLeft className="h-4 w-4 mr-2" />
                                            Deactivate
                                        </>
                                    ) : (
                                        <>
                                            <ToggleRight className="h-4 w-4 mr-2" />
                                            Activate
                                        </>
                                    )}
                                </Button>
                                <Button
                                    variant="destructive"
                                    className="w-full"
                                    onClick={handleDeleteClick}
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Category
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Future: Related Items */}
                <Card>
                    <CardHeader>
                        <CardTitle>Related Items</CardTitle>
                        <CardDescription>
                            Items that belong to this category (coming soon)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-8 text-muted-foreground">
                            <Folder className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>Related items will be displayed here when implemented.</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Delete Confirmation Modal */}
                <DeleteConfirmationModal
                    isOpen={deleteModal.isOpen}
                    onClose={handleDeleteCancel}
                    onConfirm={handleDeleteConfirm}
                    title="Delete Category"
                    description="Are you sure you want to delete this category?"
                    itemName={category.name}
                    isLoading={deleteModal.isLoading}
                />
            </div>
        </AdminSidebarLayout>
    );
}

function Label({ className, children }: { className?: string; children: React.ReactNode }) {
    return <label className={className}>{children}</label>;
}
