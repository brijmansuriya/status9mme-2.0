import { Head, Link } from '@inertiajs/react';
import { AdminSidebarLayout } from '@/layouts/admin/admin-sidebar-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Eye, FileText } from 'lucide-react';

interface Template {
    id: number;
    name: string;
    slug: string;
    description: string | null;
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

interface AdminTemplatesProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    };
    templates: {
        data: Template[];
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
    categories: Record<string, string>;
    filters: {
        search?: string;
        status?: string;
        category?: string;
        sort_by?: string;
        sort_order?: string;
    };
}

export default function AdminTemplates({ auth, templates, categories, filters }: AdminTemplatesProps) {

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'published':
                return <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">Published</Badge>;
            case 'draft':
                return <Badge variant="secondary">Draft</Badge>;
            case 'archived':
                return <Badge variant="outline">Archived</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <AdminSidebarLayout>
            <Head title="Template Management" />
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Template Management</h1>
                        <p className="text-muted-foreground">
                            Manage templates and their status
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Badge variant="outline" className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            {templates.total} Templates
                        </Badge>
                        <Button asChild>
                            <Link href="/admin/templates/create">
                                <Plus className="h-4 w-4 mr-2" />
                                Create Template
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Templates Grid */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-foreground">All Templates</CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Manage all templates in the system
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {templates.data.length === 0 ? (
                            <div className="text-center py-12">
                                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-foreground mb-2">No templates found</h3>
                                <p className="text-muted-foreground mb-6">
                                    Get started by creating your first template
                                </p>
                                <Button asChild>
                                    <Link href="/admin/templates/create">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Create Template
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {templates.data.map((template) => (
                                    <Card key={template.id} className="hover:shadow-md transition-shadow">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-start justify-between">
                                                <div className="space-y-1">
                                                    <CardTitle className="text-base line-clamp-1">{template.name}</CardTitle>
                                                    <CardDescription className="line-clamp-2 text-xs">
                                                        {template.description || 'No description'}
                                                    </CardDescription>
                                                </div>
                                                {template.is_default && (
                                                    <Badge variant="outline" className="text-xs">Default</Badge>
                                                )}
                                            </div>
                                        </CardHeader>
                                        <CardContent className="pt-0">
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className="text-xs">
                                                        {categories[template.category] || template.category}
                                                    </Badge>
                                                    {getStatusBadge(template.status)}
                                                </div>

                                                <div className="text-xs text-muted-foreground">
                                                    Version {template.version} • By {template.admin.name}
                                                </div>

                                                {/* Tags */}
                                                {template.tags && template.tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-1">
                                                        {template.tags.slice(0, 2).map((tag, index) => (
                                                            <Badge key={index} variant="secondary" className="text-xs">
                                                                {tag}
                                                            </Badge>
                                                        ))}
                                                        {template.tags.length > 2 && (
                                                            <Badge variant="secondary" className="text-xs">
                                                                +{template.tags.length - 2}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Action Buttons */}
                                                <div className="flex items-center gap-2 pt-2">
                                                    <Button asChild variant="outline" size="sm" className="flex-1">
                                                        <Link href={`/admin/templates/${template.id}`}>
                                                            <Eye className="h-3 w-3 mr-1" />
                                                            View
                                                        </Link>
                                                    </Button>
                                                    <Button asChild variant="outline" size="sm" className="flex-1">
                                                        <Link href={`/admin/templates/${template.id}/edit`}>
                                                            <Edit className="h-3 w-3 mr-1" />
                                                            Edit
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {templates.last_page > 1 && (
                            <div className="flex items-center justify-between mt-8 pt-6 border-t">
                                <div className="text-sm text-muted-foreground">
                                    Showing {((templates.current_page - 1) * templates.per_page) + 1} to {Math.min(templates.current_page * templates.per_page, templates.total)} of {templates.total} results
                                </div>
                                <div className="flex items-center gap-2">
                                    {templates.links.map((link, index) => (
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
            </div>
        </AdminSidebarLayout>
    );
}
