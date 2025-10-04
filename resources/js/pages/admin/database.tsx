import { AdminSidebarLayout } from '@/layouts/admin/admin-sidebar-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
    Database, 
    Download, 
    Upload,
    Trash2,
    RefreshCw,
    HardDrive,
    Activity,
    AlertTriangle
} from 'lucide-react';
import { Head } from '@inertiajs/react';

interface AdminDatabaseProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    };
}

export default function AdminDatabase({ auth }: AdminDatabaseProps) {
    const databaseStats = [
        {
            title: 'Total Size',
            value: '2.4 GB',
            change: '+5%',
            icon: HardDrive,
            color: 'text-blue-600'
        },
        {
            title: 'Tables',
            value: '24',
            change: '+2',
            icon: Database,
            color: 'text-green-600'
        },
        {
            title: 'Records',
            value: '15,678',
            change: '+12%',
            icon: Activity,
            color: 'text-purple-600'
        }
    ];

    const recentBackups = [
        {
            id: 1,
            name: 'Full Backup - 2024-01-20',
            size: '2.4 GB',
            status: 'completed',
            createdAt: '2024-01-20 03:00:00'
        },
        {
            id: 2,
            name: 'Incremental Backup - 2024-01-19',
            size: '145 MB',
            status: 'completed',
            createdAt: '2024-01-19 03:00:00'
        },
        {
            id: 3,
            name: 'Full Backup - 2024-01-18',
            size: '2.3 GB',
            status: 'completed',
            createdAt: '2024-01-18 03:00:00'
        }
    ];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return <Badge variant="default" className="bg-green-100 text-green-800">Completed</Badge>;
            case 'in_progress':
                return <Badge variant="secondary" className="bg-blue-100 text-blue-800">In Progress</Badge>;
            case 'failed':
                return <Badge variant="destructive">Failed</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <AdminSidebarLayout>
            <Head title="Database Management" />
            <div className="space-y-6 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Database Management</h1>
                        <p className="text-muted-foreground">
                            Monitor database performance, manage backups, and optimize storage
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                            <Database className="h-3 w-3" />
                            SQLite Database
                        </Badge>
                    </div>
                </div>

                {/* Database Stats */}
                <div className="grid gap-4 md:grid-cols-3">
                    {databaseStats.map((stat) => (
                        <Card key={stat.title} className="hover:shadow-lg transition-all duration-200">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {stat.title}
                                </CardTitle>
                                <div className="p-2 rounded-lg bg-muted/50">
                                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    <span className="text-green-600 font-medium">{stat.change}</span>
                                    from last week
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Database Actions */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="hover:shadow-lg hover:scale-105 transition-all duration-200 group cursor-pointer">
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                    <Download className="h-5 w-5 text-primary" />
                                </div>
                                <CardTitle className="text-lg text-foreground">Backup Database</CardTitle>
                            </div>
                            <CardDescription className="text-muted-foreground">Create a full database backup</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <Button asChild className="w-full group-hover:bg-primary/90 transition-colors">
                                <a href="#">Create Backup</a>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg hover:scale-105 transition-all duration-200 group cursor-pointer">
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                    <Upload className="h-5 w-5 text-primary" />
                                </div>
                                <CardTitle className="text-lg text-foreground">Restore Database</CardTitle>
                            </div>
                            <CardDescription className="text-muted-foreground">Restore from a backup file</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <Button asChild className="w-full group-hover:bg-primary/90 transition-colors">
                                <a href="#">Restore</a>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg hover:scale-105 transition-all duration-200 group cursor-pointer">
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                    <RefreshCw className="h-5 w-5 text-primary" />
                                </div>
                                <CardTitle className="text-lg text-foreground">Optimize Database</CardTitle>
                            </div>
                            <CardDescription className="text-muted-foreground">Optimize database performance</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <Button asChild className="w-full group-hover:bg-primary/90 transition-colors">
                                <a href="#">Optimize</a>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg hover:scale-105 transition-all duration-200 group cursor-pointer">
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-destructive/10 group-hover:bg-destructive/20 transition-colors">
                                    <Trash2 className="h-5 w-5 text-destructive" />
                                </div>
                                <CardTitle className="text-lg text-foreground">Clean Database</CardTitle>
                            </div>
                            <CardDescription className="text-muted-foreground">Remove unused data and logs</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <Button variant="destructive" className="w-full group-hover:bg-destructive/90 transition-colors">
                                Clean
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Backups */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-foreground">Recent Backups</CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Latest database backup operations
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentBackups.map((backup) => (
                                <div key={backup.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                            <Database className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-foreground">{backup.name}</h4>
                                            <p className="text-sm text-muted-foreground">
                                                {backup.size} • {backup.createdAt}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {getStatusBadge(backup.status)}
                                        <Button variant="outline" size="sm">
                                            Download
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Database Warning */}
                <Card className="border-yellow-200 bg-yellow-50">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-yellow-800">Database Management Warning</h3>
                                <p className="text-sm text-yellow-700 mt-1">
                                    Database operations can affect system performance and data integrity. 
                                    Always create backups before performing maintenance operations and ensure you have proper permissions.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminSidebarLayout>
    );
}
