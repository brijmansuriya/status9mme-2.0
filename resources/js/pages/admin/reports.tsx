import { AdminSidebarLayout } from '@/layouts/admin/admin-sidebar-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    FileText,
    Download,
    Calendar,
    Filter,
    Plus,
    Eye,
    MoreHorizontal,
    Clock
} from 'lucide-react';
import { Head } from '@inertiajs/react';

interface AdminReportsProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    };
}

export default function AdminReports({ auth }: AdminReportsProps) {
    // Mock data - replace with real data from backend
    const reports = [
        {
            id: 1,
            name: 'User Registration Report',
            description: 'Monthly user registration statistics',
            type: 'Monthly',
            status: 'completed',
            createdAt: '2024-01-20',
            generatedBy: 'System',
            size: '2.3 MB'
        },
        {
            id: 2,
            name: 'System Activity Report',
            description: 'Daily system activity and performance metrics',
            type: 'Daily',
            status: 'completed',
            createdAt: '2024-01-19',
            generatedBy: auth.user.name,
            size: '1.8 MB'
        },
        {
            id: 3,
            name: 'Database Performance Report',
            description: 'Database query performance and optimization suggestions',
            type: 'Weekly',
            status: 'generating',
            createdAt: '2024-01-19',
            generatedBy: auth.user.name,
            size: '0 MB'
        },
        {
            id: 4,
            name: 'Security Audit Report',
            description: 'Security logs and audit trail analysis',
            type: 'Monthly',
            status: 'scheduled',
            createdAt: '2024-01-18',
            generatedBy: 'System',
            size: '0 MB'
        }
    ];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return <Badge variant="default" className="bg-green-100 text-green-800">Completed</Badge>;
            case 'generating':
                return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Generating</Badge>;
            case 'scheduled':
                return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Scheduled</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getTypeBadge = (type: string) => {
        switch (type) {
            case 'Daily':
                return <Badge variant="outline" className="bg-blue-50 text-blue-700">Daily</Badge>;
            case 'Weekly':
                return <Badge variant="outline" className="bg-purple-50 text-purple-700">Weekly</Badge>;
            case 'Monthly':
                return <Badge variant="outline" className="bg-green-50 text-green-700">Monthly</Badge>;
            default:
                return <Badge variant="outline">{type}</Badge>;
        }
    };

    return (
        <AdminSidebarLayout>
            <Head title="Reports Management" />
            <div className="space-y-6 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Reports Management</h1>
                        <p className="text-muted-foreground">
                            Generate, view, and manage system reports
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {reports.length} Reports
                        </Badge>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Generate Report
                        </Button>
                    </div>
                </div>

                {/* Filters and Actions */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex flex-col gap-4 md:flex-row md:items-center">
                                <div className="flex items-center gap-2">
                                    <Filter className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">Filter by:</span>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm">All Types</Button>
                                    <Button variant="outline" size="sm">Daily</Button>
                                    <Button variant="outline" size="sm">Weekly</Button>
                                    <Button variant="outline" size="sm">Monthly</Button>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Schedule Report
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Reports List */}
                <div className="grid gap-4">
                    {reports.map((report) => (
                        <Card key={report.id} className="hover:shadow-lg transition-all duration-200">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                            <FileText className="h-6 w-6 text-primary" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-medium text-foreground">{report.name}</h3>
                                                {getStatusBadge(report.status)}
                                                {getTypeBadge(report.type)}
                                            </div>
                                            <p className="text-sm text-muted-foreground">{report.description}</p>
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    Created {report.createdAt}
                                                </div>
                                                <div>By {report.generatedBy}</div>
                                                <div>Size: {report.size}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {report.status === 'completed' && (
                                            <Button variant="outline" size="sm">
                                                <Download className="h-4 w-4 mr-1" />
                                                Download
                                            </Button>
                                        )}
                                        <Button variant="outline" size="sm">
                                            <Eye className="h-4 w-4 mr-1" />
                                            View
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Report Templates */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-foreground">Report Templates</CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Pre-configured report templates for quick generation
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {[
                                { name: 'User Activity Report', description: 'User login and activity statistics' },
                                { name: 'System Performance Report', description: 'Server performance and resource usage' },
                                { name: 'Security Audit Report', description: 'Security events and audit trail' },
                                { name: 'Database Report', description: 'Database performance and optimization' },
                                { name: 'Error Log Report', description: 'Application errors and exceptions' },
                                { name: 'Custom Report', description: 'Create your own custom report' }
                            ].map((template, index) => (
                                <Card key={index} className="hover:shadow-lg hover:scale-105 transition-all duration-200 group cursor-pointer">
                                    <CardContent className="pt-6">
                                        <div className="space-y-2">
                                            <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                                                {template.name}
                                            </h4>
                                            <p className="text-sm text-muted-foreground">{template.description}</p>
                                            <Button variant="outline" size="sm" className="w-full mt-3">
                                                Use Template
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminSidebarLayout>
    );
}
