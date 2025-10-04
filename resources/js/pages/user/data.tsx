import { UserSidebarLayout } from '@/layouts/user/user-sidebar-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Download, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function UserData() {
    const sampleData = [
        { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active', role: 'User' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Active', role: 'User' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'Inactive', role: 'User' },
        { id: 4, name: 'Alice Brown', email: 'alice@example.com', status: 'Active', role: 'User' },
    ];

    return (
        <UserSidebarLayout>
            <div className="space-y-6 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Data View</h1>
                        <p className="text-muted-foreground">
                            View system data (read-only access)
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            Read Only
                        </Badge>
                    </div>
                </div>

                {/* Search and Filter */}
                <Card>
                    <CardHeader>
                        <CardTitle>Search & Filter</CardTitle>
                        <CardDescription>
                            Filter and search through the data
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search data..."
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <Button variant="outline">
                                <Filter className="h-4 w-4 mr-2" />
                                Filter
                            </Button>
                            <Button variant="outline">
                                <Download className="h-4 w-4 mr-2" />
                                Export
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Data Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>User Data</CardTitle>
                        <CardDescription>
                            View user information (read-only)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left p-2">ID</th>
                                        <th className="text-left p-2">Name</th>
                                        <th className="text-left p-2">Email</th>
                                        <th className="text-left p-2">Status</th>
                                        <th className="text-left p-2">Role</th>
                                        <th className="text-left p-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sampleData.map((item) => (
                                        <tr key={item.id} className="border-b">
                                            <td className="p-2">{item.id}</td>
                                            <td className="p-2 font-medium">{item.name}</td>
                                            <td className="p-2">{item.email}</td>
                                            <td className="p-2">
                                                <Badge
                                                    variant={item.status === 'Active' ? 'default' : 'secondary'}
                                                >
                                                    {item.status}
                                                </Badge>
                                            </td>
                                            <td className="p-2">{item.role}</td>
                                            <td className="p-2">
                                                <Button variant="outline" size="sm">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Info Card */}
                <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                            <div>
                                <h3 className="font-semibold text-primary">Read-Only Access</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    You have read-only access to this data. To modify or manage data,
                                    please contact an administrator.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </UserSidebarLayout>
    );
}
