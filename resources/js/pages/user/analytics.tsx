import { UserSidebarLayout } from '@/layouts/user/user-sidebar-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingUp, Users, Eye, Download } from 'lucide-react';

export default function UserAnalytics() {
    const analytics = [
        {
            title: 'User Growth',
            value: '1,234',
            change: '+12%',
            trend: 'up',
            description: 'Total active users this month',
        },
        {
            title: 'Page Views',
            value: '45,678',
            change: '+8%',
            trend: 'up',
            description: 'Total page views this month',
        },
        {
            title: 'Conversion Rate',
            value: '3.2%',
            change: '-2%',
            trend: 'down',
            description: 'Overall conversion rate',
        },
        {
            title: 'Bounce Rate',
            value: '42%',
            change: '+5%',
            trend: 'up',
            description: 'Average bounce rate',
        },
    ];

    const charts = [
        {
            title: 'Monthly Traffic',
            description: 'Website traffic over the last 6 months',
            type: 'Line Chart',
        },
        {
            title: 'User Demographics',
            description: 'Age and location distribution of users',
            type: 'Pie Chart',
        },
        {
            title: 'Device Usage',
            description: 'Desktop vs Mobile vs Tablet usage',
            type: 'Bar Chart',
        },
        {
            title: 'Top Pages',
            description: 'Most visited pages on the website',
            type: 'Table',
        },
    ];

    return (
        <UserSidebarLayout>
            <div className="space-y-6 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Analytics</h1>
                        <p className="text-muted-foreground">
                            View system analytics and metrics (read-only access)
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            Read Only
                        </Badge>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {analytics.map((metric) => (
                        <Card key={metric.title}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {metric.title}
                                </CardTitle>
                                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{metric.value}</div>
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <TrendingUp className={`h-3 w-3 ${metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
                                    {metric.change} from last month
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {metric.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Charts Grid */}
                <div>
                    <h2 className="text-2xl font-bold mb-4">Analytics Charts</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        {charts.map((chart) => (
                            <Card key={chart.title} className="hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BarChart3 className="h-5 w-5" />
                                        {chart.title}
                                    </CardTitle>
                                    <CardDescription>{chart.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-32 bg-gray-50 rounded-lg flex items-center justify-center">
                                        <div className="text-center">
                                            <BarChart3 className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                            <p className="text-sm text-gray-500">{chart.type}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-4">
                                        <Button variant="outline" size="sm">
                                            <Eye className="h-4 w-4 mr-2" />
                                            View
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            <Download className="h-4 w-4 mr-2" />
                                            Export
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Info Card */}
                <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                            <div>
                                <h3 className="font-semibold text-primary">Read-Only Analytics</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    You can view analytics and export data. To modify analytics settings
                                    or create custom reports, please contact an administrator.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </UserSidebarLayout>
    );
}
