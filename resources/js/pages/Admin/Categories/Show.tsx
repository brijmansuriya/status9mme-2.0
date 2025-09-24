import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
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
import { ArrowLeft, Edit, Calendar, Hash, Palette, Tag } from 'lucide-react';

interface Template {
  id: number;
  name: string;
  description: string;
  is_premium: boolean;
  is_active: boolean;
  downloads_count: number;
  views_count: number;
  created_at: string;
}

interface Category {
  id: number;
  name: string;
  description: string;
  color: string;
  icon: string;
  is_active: boolean;
  sort_order: number;
  templates_count: number;
  created_at: string;
  updated_at: string;
  templates: Template[];
}

interface Props {
  category: Category;
}

export default function AdminCategoriesShow({ category }: Props) {
  return (
    <>
      <Head title={category.name} />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={route('admin.categories.index')}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Categories
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                {category.icon && <span className="text-3xl">{category.icon}</span>}
                {category.name}
              </h1>
              <p className="text-muted-foreground">
                {category.description || 'No description provided'}
              </p>
            </div>
          </div>
          <Link href={route('admin.categories.edit', category.id)}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Edit Category
            </Button>
          </Link>
        </div>

        {/* Category Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <Tag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Badge variant={category.is_active ? 'default' : 'secondary'}>
                {category.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Templates</CardTitle>
              <Hash className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{category.templates_count}</div>
              <p className="text-xs text-muted-foreground">
                Total templates
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sort Order</CardTitle>
              <Hash className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{category.sort_order}</div>
              <p className="text-xs text-muted-foreground">
                Display order
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Color</CardTitle>
              <Palette className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {category.color ? (
                <div className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-sm font-mono">{category.color}</span>
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">No color set</span>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Templates */}
        <Card>
          <CardHeader>
            <CardTitle>Templates in this Category</CardTitle>
          </CardHeader>
          <CardContent>
            {category.templates.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Downloads</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {category.templates.map((template) => (
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
                        <Link href={route('admin.templates.show', template.id)}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <div className="text-muted-foreground">
                  No templates in this category yet.
                </div>
                <Link href={route('admin.templates.create')} className="mt-4 inline-block">
                  <Button>Create Template</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Metadata */}
        <Card>
          <CardHeader>
            <CardTitle>Metadata</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Created:</span>
                <span>{new Date(category.created_at).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Updated:</span>
                <span>{new Date(category.updated_at).toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
