import { AdminSidebarLayout } from '@/layouts/admin/admin-sidebar-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Folder,
    ArrowLeft,
    Save
} from 'lucide-react';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

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

interface AdminCategoryEditProps {
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

export default function AdminCategoryEdit({ auth, category }: AdminCategoryEditProps) {
    const { data, setData, put, processing, errors } = useForm({
        name: category.name,
        description: category.description || '',
        status: category.status,
        sort_order: category.sort_order,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(`/admin/categories/${category.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                // Success message will be handled by the controller
            },
            onError: (errors) => {
                console.error('Error updating category:', errors);
            }
        });
    };

    return (
        <AdminSidebarLayout>
            <Head title={`Edit Category - ${category.name}`} />
            <div className="space-y-6 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Edit Category</h1>
                        <p className="text-muted-foreground">
                            Update the category information
                        </p>
                    </div>
                    <Button asChild variant="outline">
                        <Link href="/admin/categories">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Categories
                        </Link>
                    </Button>
                </div>

                {/* Form */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Folder className="h-5 w-5" />
                            Category Details
                        </CardTitle>
                        <CardDescription>
                            Update the information for this category
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                {/* Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="name">Category Name *</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Enter category name"
                                        required
                                        className={errors.name ? 'border-destructive' : ''}
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-destructive">{errors.name}</p>
                                    )}
                                </div>

                                {/* Status */}
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status *</Label>
                                    <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                        <SelectTrigger className={errors.status ? 'border-destructive' : ''}>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="inactive">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.status && (
                                        <p className="text-sm text-destructive">{errors.status}</p>
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
                                    placeholder="Enter category description (optional)"
                                    rows={4}
                                    className={errors.description ? 'border-destructive' : ''}
                                />
                                {errors.description && (
                                    <p className="text-sm text-destructive">{errors.description}</p>
                                )}
                            </div>

                            {/* Sort Order */}
                            <div className="space-y-2">
                                <Label htmlFor="sort_order">Sort Order</Label>
                                <Input
                                    id="sort_order"
                                    type="number"
                                    value={data.sort_order}
                                    onChange={(e) => setData('sort_order', parseInt(e.target.value) || 0)}
                                    placeholder="0"
                                    min="0"
                                    max="9999"
                                    className={errors.sort_order ? 'border-destructive' : ''}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Lower numbers appear first. Leave as 0 for automatic ordering.
                                </p>
                                {errors.sort_order && (
                                    <p className="text-sm text-destructive">{errors.sort_order}</p>
                                )}
                            </div>

                            {/* Category Info */}
                            <div className="bg-muted/50 p-4 rounded-lg">
                                <h4 className="font-medium text-foreground mb-2">Category Information</h4>
                                <div className="grid gap-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Slug:</span>
                                        <span className="font-mono">{category.slug}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Created:</span>
                                        <span>{new Date(category.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Last Updated:</span>
                                        <span>{new Date(category.updated_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex items-center justify-end gap-4 pt-6 border-t">
                                <Button asChild variant="outline">
                                    <Link href="/admin/categories">Cancel</Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    <Save className="h-4 w-4 mr-2" />
                                    {processing ? 'Updating...' : 'Update Category'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AdminSidebarLayout>
    );
}
