import { AdminSidebarLayout } from '@/layouts/admin/admin-sidebar-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Users,
    Search,
    Filter,
    MoreHorizontal,
    Mail,
    Calendar,
    Shield,
    Eye
} from 'lucide-react';
import { Head } from '@inertiajs/react';

interface AdminUsersProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    };
}

export default function AdminUsers({ auth }: AdminUsersProps) {
    // Mock data - replace with real data from backend
    const users = [
        {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            role: 'user',
            status: 'active',
            createdAt: '2024-01-15',
            lastLogin: '2024-01-20'
        },
        {
            id: 2,
            name: 'Jane Smith',
            email: 'jane@example.com',
            role: 'user',
            status: 'active',
            createdAt: '2024-01-10',
            lastLogin: '2024-01-19'
        },
        {
            id: 3,
            name: 'Bob Johnson',
            email: 'bob@example.com',
            role: 'user',
            status: 'inactive',
            createdAt: '2024-01-05',
            lastLogin: '2024-01-10'
        },
    ];

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
            <Head title="Manage Users" />
            <div className="space-y-6 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">User Management</h1>
                        <p className="text-muted-foreground">
                            Manage user accounts, roles, and permissions
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {users.length} Total Users
                        </Badge>
                    </div>
                </div>

                {/* Filters and Search */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex flex-col gap-4 md:flex-row md:items-center">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Search users..."
                                        className="pl-9 w-full md:w-64"
                                    />
                                </div>
                                <Button variant="outline" className="w-fit">
                                    <Filter className="h-4 w-4 mr-2" />
                                    Filter
                                </Button>
                            </div>
                            <Button>
                                <Users className="h-4 w-4 mr-2" />
                                Add User
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Users Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-foreground">Users</CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Manage all user accounts in the system
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {users.map((user) => (
                                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                            <Users className="h-5 w-5 text-primary" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-medium text-foreground">{user.name}</h3>
                                                {getStatusBadge(user.status)}
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <Mail className="h-3 w-3" />
                                                    {user.email}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    Joined {user.createdAt}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm">
                                            <Eye className="h-4 w-4 mr-1" />
                                            View
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminSidebarLayout>
    );
}
