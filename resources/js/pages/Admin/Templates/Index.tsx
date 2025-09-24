import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { route } from '@/utils/routes';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  Grid3X3,
  List,
  Filter
} from 'lucide-react';

interface Template {
  id: number;
  name: string;
  description: string;
  category: {
    id: number;
    name: string;
  };
  is_premium: boolean;
  is_active: boolean;
  downloads_count: number;
  views_count: number;
  created_at: string;
  updated_at: string;
}

interface Category {
  id: number;
  name: string;
}

interface Props {
  templates: Template[];
  categories: Category[];
  filters: {
    search?: string;
    category_id?: number;
    is_premium?: boolean;
    is_active?: boolean;
  };
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export default function AdminTemplatesIndex({
  templates, 
  categories, 
  filters, 
  pagination 
}: Props) {
  const [search, setSearch] = useState(filters.search || '');
  const [selectedCategory, setSelectedCategory] = useState(filters.category_id || '');
  const [premiumFilter, setPremiumFilter] = useState(filters.is_premium?.toString() || '');
  const [activeFilter, setActiveFilter] = useState(filters.is_active?.toString() || '');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [deleteTemplate, setDeleteTemplate] = useState<Template | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get(route('admin.templates.index'), {
      search,
      category_id: selectedCategory || undefined,
      is_premium: premiumFilter || undefined,
      is_active: activeFilter || undefined,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  const handleDelete = (template: Template) => {
    setDeleteTemplate(template);
  };

  const confirmDelete = () => {
    if (deleteTemplate) {
      router.delete(route('admin.templates.destroy', { id: deleteTemplate.id }), {
        onSuccess: () => setDeleteTemplate(null),
      });
    }
  };

  const handleEdit = (template: Template) => {
    router.visit(route('admin.templates.edit', { id: template.id }));
  };

  const handleView = (template: Template) => {
    router.visit(route('admin.templates.show', { id: template.id }));
  };

  return (
    <AdminLayout 
      title="Templates"
      description="Manage your video templates. Create, edit, and organize templates for your video status maker platform."
      breadcrumbs={[
        { title: 'Dashboard', href: route('admin.dashboard') },
        { title: 'Templates', href: route('admin.templates') }
      ]}
    >
      <Head title="Templates Management" />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Templates</h1>
            <p className="text-muted-foreground">
              Manage your video templates and their settings
            </p>
          </div>
          <Link href={route('admin.templates.create')}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Template
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search templates..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Premium</label>
                  <select
                    value={premiumFilter}
                    onChange={(e) => setPremiumFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md"
                  >
                    <option value="">All</option>
                    <option value="1">Premium Only</option>
                    <option value="0">Free Only</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <select
                    value={activeFilter}
                    onChange={(e) => setActiveFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md"
                  >
                    <option value="">All</option>
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <Button type="submit">Apply Filters</Button>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">View:</span>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                Templates ({pagination.total})
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {viewMode === 'list' ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Downloads</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[50px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-semibold">{template.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {template.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {template.category.name}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {template.is_premium && (
                            <Badge variant="default">Premium</Badge>
                          )}
                          <Badge 
                            variant={template.is_active ? 'default' : 'secondary'}
                          >
                            {template.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>{template.downloads_count}</TableCell>
                      <TableCell>{template.views_count}</TableCell>
                      <TableCell>
                        {new Date(template.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleView(template)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(template)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(template)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => (
                  <Card key={template.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {template.description}
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleView(template)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(template)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(template)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">
                            {template.category.name}
                          </Badge>
                          {template.is_premium && (
                            <Badge variant="default">Premium</Badge>
                          )}
                          <Badge 
                            variant={template.is_active ? 'default' : 'secondary'}
                          >
                            {template.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>{template.downloads_count} downloads</span>
                          <span>{template.views_count} views</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Created {new Date(template.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {templates.length === 0 && (
              <div className="text-center py-12">
                <div className="text-muted-foreground">
                  No templates found. Create your first template to get started.
                </div>
                <Link href={route('admin.templates.create')} className="mt-4 inline-block">
                  <Button>Create Template</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTemplate} onOpenChange={() => setDeleteTemplate(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Template</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteTemplate?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}