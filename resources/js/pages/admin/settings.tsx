import { AdminSidebarLayout } from '@/layouts/admin/admin-sidebar-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
    Settings,
    Save,
    Shield,
    Mail,
    Bell,
    Globe,
    Database,
    Key,
    Users
} from 'lucide-react';
import { Head } from '@inertiajs/react';

interface AdminSettingsProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    };
}

export default function AdminSettings({ auth }: AdminSettingsProps) {
    return (
        <AdminSidebarLayout>
            <Head title="Admin Settings" />
            <div className="space-y-6 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Admin Settings</h1>
                        <p className="text-muted-foreground">
                            Configure admin panel settings and system preferences
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                            <Settings className="h-3 w-3" />
                            System Configuration
                        </Badge>
                    </div>
                </div>

                {/* Settings Sections */}
                <div className="grid gap-6">
                    {/* General Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="h-5 w-5" />
                                General Settings
                            </CardTitle>
                            <CardDescription>
                                Basic system configuration and preferences
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="site-name">Site Name</Label>
                                    <Input id="site-name" defaultValue="Status9MME 2.0" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="site-url">Site URL</Label>
                                    <Input id="site-url" defaultValue="https://status9mme-2.0.test" />
                                </div>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="timezone">Timezone</Label>
                                    <Input id="timezone" defaultValue="UTC" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="language">Default Language</Label>
                                    <Input id="language" defaultValue="English" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Maintenance Mode</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Enable maintenance mode to restrict access
                                    </p>
                                </div>
                                <Switch />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Security Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                Security Settings
                            </CardTitle>
                            <CardDescription>
                                Configure security policies and access controls
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                                    <Input id="session-timeout" type="number" defaultValue="120" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="max-login-attempts">Max Login Attempts</Label>
                                    <Input id="max-login-attempts" type="number" defaultValue="5" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Two-Factor Authentication</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Require 2FA for all admin accounts
                                    </p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>IP Whitelist</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Restrict admin access to specific IP addresses
                                    </p>
                                </div>
                                <Switch />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Email Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Mail className="h-5 w-5" />
                                Email Settings
                            </CardTitle>
                            <CardDescription>
                                Configure email notifications and SMTP settings
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="smtp-host">SMTP Host</Label>
                                    <Input id="smtp-host" defaultValue="smtp.example.com" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="smtp-port">SMTP Port</Label>
                                    <Input id="smtp-port" type="number" defaultValue="587" />
                                </div>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="smtp-username">SMTP Username</Label>
                                    <Input id="smtp-username" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="smtp-password">SMTP Password</Label>
                                    <Input id="smtp-password" type="password" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Email Notifications</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Send email notifications for admin activities
                                    </p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                        </CardContent>
                    </Card>

                    {/* User Management */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                User Management
                            </CardTitle>
                            <CardDescription>
                                Configure user registration and management policies
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Allow User Registration</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Allow new users to register accounts
                                    </p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Email Verification Required</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Require email verification for new accounts
                                    </p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="default-user-role">Default User Role</Label>
                                    <Input id="default-user-role" defaultValue="user" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="max-users">Maximum Users</Label>
                                    <Input id="max-users" type="number" defaultValue="1000" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                    <Button className="flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        Save Settings
                    </Button>
                </div>
            </div>
        </AdminSidebarLayout>
    );
}
