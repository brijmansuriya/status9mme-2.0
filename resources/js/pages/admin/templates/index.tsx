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
    return (
        <AdminSidebarLayout>
            <Head title="Template Management" />
            <div className="space-y-6 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Template Management</h1>
                        <p className="text-muted-foreground">
                            Manage templates and their status
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
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
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {templates.data.map((template) => (
                        <Card key={template.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <CardTitle className="text-lg line-clamp-1">
                                            {template.name}
                                        </CardTitle>
                                        <CardDescription className="line-clamp-2">
                                            {template.description || 'No description'}
                                        </CardDescription>
                                    </div>
                                    <Badge 
                                        variant={template.status === 'published' ? 'default' : 'secondary'}
                                        className="ml-2"
                                    >
                                        {template.status}
                                    </Badge>
                                </div>
                            </CardHeader>
                            
                            <CardContent className="space-y-4">
                                {/* Template Preview */}
                                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                                    {template.thumbnail_url ? (
                                        <img
                                            src={template.thumbnail_url}
                                            alt={template.name}
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                    ) : (
                                        <div className="text-center text-muted-foreground">
                                            <FileText className="h-12 w-12 mx-auto mb-2" />
                                            <p className="text-sm">No Preview</p>
                                        </div>
                                    )}
                                </div>

                                {/* Template Info */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Category:</span>
                                        <Badge variant="outline">{template.category}</Badge>
                                    </div>
                                    
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Version:</span>
                                        <span>v{template.version}</span>
                                    </div>

                                    {template.tags && template.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1">
                                            {template.tags.slice(0, 3).map((tag, index) => (
                                                <Badge key={index} variant="secondary" className="text-xs">
                                                    {tag}
                                                </Badge>
                                            ))}
                                            {template.tags.length > 3 && (
                                                <Badge variant="secondary" className="text-xs">
                                                    +{template.tags.length - 3}
                                                </Badge>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 pt-2">
                                    <Button variant="outline" size="sm" asChild className="flex-1">
                                        <Link href={`/admin/templates/${template.id}`}>
                                            <Eye className="h-4 w-4 mr-1" />
                                            View
                                        </Link>
                                    </Button>
                                    <Button variant="outline" size="sm" asChild className="flex-1">
                                        <Link href={`/admin/templates/${template.id}/edit`}>
                                            <Edit className="h-4 w-4 mr-1" />
                                            Edit
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Empty State */}
                {templates.data.length === 0 && (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No templates found</h3>
                            <p className="text-muted-foreground text-center mb-6">
                                Get started by creating your first template
                            </p>
                            <Button asChild>
                                <Link href="/admin/templates/create">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create Template
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Pagination */}
                {templates.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {templates.links.map((link, index) => (
                            <Button
                                key={index}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                asChild={!!link.url}
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
                )}
            </div>
        </AdminSidebarLayout>
    );
}
