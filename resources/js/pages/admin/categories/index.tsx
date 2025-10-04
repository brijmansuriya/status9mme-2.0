import { AdminSidebarLayout } from '@/layouts/admin/admin-sidebar-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Folder,
    Search,
    Filter,
    Plus,
    Edit,
    Trash2,
    Eye,
    ToggleLeft,
    ToggleRight,
    ArrowUpDown
} from 'lucide-react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import SuccessMessage from '@/components/success-message';
import ErrorMessage from '@/components/error-message';
import DeleteConfirmationModal from '@/components/delete-confirmation-modal';
import StatusToggleModal from '@/components/status-toggle-modal';

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

interface AdminCategoriesProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    };
    categories: {
        data: Category[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
    filters: {
        search?: string;
        status?: string;
        sort_by?: string;
        sort_order?: string;
    };
}

export default function AdminCategories({ auth, categories, filters }: AdminCategoriesProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [sortBy, setSortBy] = useState(filters.sort_by || 'sort_order');
    const [sortOrder, setSortOrder] = useState(filters.sort_order || 'asc');

    // Delete confirmation modal state
    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        category: Category | null;
        isLoading: boolean;
    }>({
        isOpen: false,
        category: null,
        isLoading: false,
    });

    // Status toggle modal state
    const [statusModal, setStatusModal] = useState<{
        isOpen: boolean;
        category: Category | null;
        isLoading: boolean;
    }>({
        isOpen: false,
        category: null,
        isLoading: false,
    });

    const { props } = usePage();
    const success = (props as any).flash?.success;
    const error = (props as any).flash?.error;

    const handleSearch = () => {
        router.get('/admin/categories', {
            search,
            status,
            sort_by: sortBy,
            sort_order: sortOrder,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleStatusToggleClick = (category: Category) => {
        setStatusModal({
            isOpen: true,
            category,
            isLoading: false,
        });
    };

    const handleStatusToggleConfirm = () => {
        if (!statusModal.category) return;

        setStatusModal(prev => ({ ...prev, isLoading: true }));

        router.patch(`/admin/categories/${statusModal.category.id}/toggle-status`, {}, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setStatusModal({
                    isOpen: false,
                    category: null,
                    isLoading: false,
                });
                // Success message will be handled by the controller
            },
            onError: (errors) => {
                console.error('Error toggling status:', errors);
                setStatusModal(prev => ({ ...prev, isLoading: false }));
            }
        });
    };

    const handleStatusToggleCancel = () => {
        setStatusModal({
            isOpen: false,
            category: null,
            isLoading: false,
        });
    };

    const handleDeleteClick = (category: Category) => {
        setDeleteModal({
            isOpen: true,
            category,
            isLoading: false,
        });
    };

    const handleDeleteConfirm = () => {
        if (!deleteModal.category) return;

        setDeleteModal(prev => ({ ...prev, isLoading: true }));

        router.delete(`/admin/categories/${deleteModal.category.id}`, {
            preserveState: false,
            onSuccess: () => {
                setDeleteModal({
                    isOpen: false,
                    category: null,
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
            category: null,
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

    const handleSort = (field: string) => {
        const newOrder = sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortBy(field);
        setSortOrder(newOrder);

        router.get('/admin/categories', {
            search,
            status,
            sort_by: field,
            sort_order: newOrder,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AdminSidebarLayout>
            <Head title="Category Management" />
            <div className="space-y-6 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Category Management</h1>
                        <p className="text-muted-foreground">
                            Manage categories and their status
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                            <Folder className="h-3 w-3" />
                            {categories.total} Categories
                        </Badge>
                        <Button asChild>
                            <Link href="/admin/categories/create">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Category
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

                {/* Filters and Search */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex flex-col gap-4 md:flex-row md:items-center">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Search categories..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-9 w-full md:w-64"
                                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    />
                                </div>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="px-3 py-2 border border-input rounded-md bg-background text-sm"
                                >
                                    <option value="">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                                <Button onClick={handleSearch} variant="outline" className="w-fit">
                                    <Filter className="h-4 w-4 mr-2" />
                                    Filter
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Categories Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-foreground">Categories</CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Manage all categories in the system
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {categories.data.length === 0 ? (
                                <div className="text-center py-8">
                                    <Folder className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-foreground mb-2">No categories found</h3>
                                    <p className="text-muted-foreground mb-4">
                                        {search || status ? 'Try adjusting your filters' : 'Get started by creating your first category'}
                                    </p>
                                    <Button asChild>
                                        <Link href="/admin/categories/create">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Category
                                        </Link>
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    {/* Table Header */}
                                    <div className="grid grid-cols-12 gap-4 p-3 bg-muted/50 rounded-lg text-sm font-medium text-muted-foreground">
                                        <div className="col-span-3">
                                            <button
                                                onClick={() => handleSort('name')}
                                                className="flex items-center gap-1 hover:text-foreground"
                                            >
                                                Name
                                                <ArrowUpDown className="h-3 w-3" />
                                            </button>
                                        </div>
                                        <div className="col-span-4">Description</div>
                                        <div className="col-span-1">
                                            <button
                                                onClick={() => handleSort('sort_order')}
                                                className="flex items-center gap-1 hover:text-foreground"
                                            >
                                                Order
                                                <ArrowUpDown className="h-3 w-3" />
                                            </button>
                                        </div>
                                        <div className="col-span-1">
                                            <button
                                                onClick={() => handleSort('status')}
                                                className="flex items-center gap-1 hover:text-foreground"
                                            >
                                                Status
                                                <ArrowUpDown className="h-3 w-3" />
                                            </button>
                                        </div>
                                        <div className="col-span-1">
                                            <button
                                                onClick={() => handleSort('created_at')}
                                                className="flex items-center gap-1 hover:text-foreground"
                                            >
                                                Created
                                                <ArrowUpDown className="h-3 w-3" />
                                            </button>
                                        </div>
                                        <div className="col-span-2 text-right">Actions</div>
                                    </div>

                                    {/* Table Rows */}
                                    {categories.data.map((category) => (
                                        <div key={category.id} className="grid grid-cols-12 gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                            <div className="col-span-3">
                                                <div className="font-medium text-foreground">{category.name}</div>
                                                <div className="text-xs text-muted-foreground">/{category.slug}</div>
                                            </div>
                                            <div className="col-span-4">
                                                <div className="text-sm text-muted-foreground">
                                                    {category.description || 'No description'}
                                                </div>
                                            </div>
                                            <div className="col-span-1">
                                                <Badge variant="outline">{category.sort_order}</Badge>
                                            </div>
                                            <div className="col-span-1">
                                                {getStatusBadge(category.status)}
                                            </div>
                                            <div className="col-span-1">
                                                <div className="text-xs text-muted-foreground">
                                                    {new Date(category.created_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <div className="col-span-2">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleStatusToggleClick(category)}
                                                        title={category.status === 'active' ? 'Deactivate' : 'Activate'}
                                                    >
                                                        {category.status === 'active' ? (
                                                            <ToggleRight className="h-4 w-4 text-green-600" />
                                                        ) : (
                                                            <ToggleLeft className="h-4 w-4 text-gray-400" />
                                                        )}
                                                    </Button>
                                                    <Button asChild variant="ghost" size="sm" title="View">
                                                        <Link href={`/admin/categories/${category.id}`}>
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button asChild variant="ghost" size="sm" title="Edit">
                                                        <Link href={`/admin/categories/${category.id}/edit`}>
                                                            <Edit className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDeleteClick(category)}
                                                        className="text-destructive hover:text-destructive"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>

                        {/* Pagination */}
                        {categories.last_page > 1 && (
                            <div className="flex items-center justify-between mt-6">
                                <div className="text-sm text-muted-foreground">
                                    Showing {((categories.current_page - 1) * categories.per_page) + 1} to {Math.min(categories.current_page * categories.per_page, categories.total)} of {categories.total} results
                                </div>
                                <div className="flex items-center gap-2">
                                    {categories.links.map((link, index) => (
                                        <Button
                                            key={index}
                                            variant={link.active ? "default" : "outline"}
                                            size="sm"
                                            asChild={link.url !== null}
                                            disabled={link.url === null}
                                        >
                                            {link.url ? (
                                                <Link href={link.url}>
                                                    <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                                </Link>
                                            ) : (
                                                <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                            )}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Delete Confirmation Modal */}
                <DeleteConfirmationModal
                    isOpen={deleteModal.isOpen}
                    onClose={handleDeleteCancel}
                    onConfirm={handleDeleteConfirm}
                    title="Delete Category"
                    description="Are you sure you want to delete this category?"
                    itemName={deleteModal.category?.name || ''}
                    isLoading={deleteModal.isLoading}
                />

                {/* Status Toggle Modal */}
                <StatusToggleModal
                    isOpen={statusModal.isOpen}
                    onClose={handleStatusToggleCancel}
                    onConfirm={handleStatusToggleConfirm}
                    itemName={statusModal.category?.name || ''}
                    currentStatus={statusModal.category?.status || 'active'}
                    isLoading={statusModal.isLoading}
                />
            </div>
        </AdminSidebarLayout>
    );
}
