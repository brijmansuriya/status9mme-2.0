import { UserSidebarLayout } from '@/layouts/user/user-sidebar-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Download, Calendar, FileText } from 'lucide-react';

export default function UserReports() {
    const reports = [
        {
            id: 1,
            title: 'Monthly Sales Report',
            description: 'Comprehensive sales data for the current month',
            date: '2024-01-15',
            status: 'Available',
            type: 'PDF',
        },
        {
            id: 2,
            title: 'User Activity Report',
            description: 'Detailed user activity and engagement metrics',
            date: '2024-01-14',
            status: 'Available',
            type: 'Excel',
        },
        {
            id: 3,
            title: 'System Performance Report',
            description: 'Server performance and uptime statistics',
            date: '2024-01-13',
            status: 'Generating',
            type: 'PDF',
        },
        {
            id: 4,
            title: 'Financial Summary',
            description: 'Quarterly financial overview and projections',
            date: '2024-01-12',
            status: 'Available',
            type: 'PDF',
        },
    ];

    return (
        <UserSidebarLayout>
            <div className="space-y-6 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Reports</h1>
                        <p className="text-muted-foreground">
                            View and download available reports (read-only access)
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            Read Only
                        </Badge>
                    </div>
                </div>

                {/* Reports Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {reports.map((report) => (
                        <Card key={report.id} className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-5 w-5 text-muted-foreground" />
                                        <CardTitle className="text-lg">{report.title}</CardTitle>
                                    </div>
                                    <Badge
                                        variant={report.status === 'Available' ? 'default' : 'secondary'}
                                    >
                                        {report.status}
                                    </Badge>
                                </div>
                                <CardDescription>{report.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        {report.date}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <span>Format: {report.type}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={report.status !== 'Available'}
                                        >
                                            <Eye className="h-4 w-4 mr-2" />
                                            View
                                        </Button>
                                        <Button
                                            size="sm"
                                            disabled={report.status !== 'Available'}
                                        >
                                            <Download className="h-4 w-4 mr-2" />
                                            Download
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Info Card */}
                <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                            <div>
                                <h3 className="font-semibold text-primary">Read-Only Access</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    You can view and download available reports. To generate new reports
                                    or modify existing ones, please contact an administrator.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </UserSidebarLayout>
    );
}
