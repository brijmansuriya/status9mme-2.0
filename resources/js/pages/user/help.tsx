import { UserSidebarLayout } from '@/layouts/user/user-sidebar-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { HelpCircle, BookOpen, MessageCircle, Mail, Phone } from 'lucide-react';

export default function UserHelp() {
    const faqs = [
        {
            question: 'How do I view my data?',
            answer: 'Navigate to the Data section in the sidebar to view all available data. You can search and filter the information as needed.',
        },
        {
            question: 'Can I download reports?',
            answer: 'Yes, you can download available reports from the Reports section. Look for the download button on each report card.',
        },
        {
            question: 'How do I access analytics?',
            answer: 'Go to the Analytics section to view charts, metrics, and performance data. All analytics are read-only.',
        },
        {
            question: 'Who can I contact for support?',
            answer: 'For technical support or questions about your account, please contact the system administrator.',
        },
    ];

    const helpSections = [
        {
            title: 'Getting Started',
            description: 'Learn the basics of using the user portal',
            icon: BookOpen,
            items: [
                'How to navigate the dashboard',
                'Understanding your permissions',
                'Viewing and filtering data',
                'Downloading reports',
            ],
        },
        {
            title: 'Data Management',
            description: 'Working with data and reports',
            icon: HelpCircle,
            items: [
                'Searching through data',
                'Understanding data formats',
                'Exporting information',
                'Report generation',
            ],
        },
        {
            title: 'Account & Settings',
            description: 'Managing your account and preferences',
            icon: MessageCircle,
            items: [
                'Updating your profile',
                'Changing password',
                'Notification settings',
                'Privacy preferences',
            ],
        },
    ];

    return (
        <UserSidebarLayout>
            <div className="space-y-6 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Help & Support</h1>
                        <p className="text-muted-foreground">
                            Get help and support for using the user portal
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                            <HelpCircle className="h-3 w-3" />
                            User Portal
                        </Badge>
                    </div>
                </div>

                {/* Quick Help Sections */}
                <div className="grid gap-4 md:grid-cols-3">
                    {helpSections.map((section) => (
                        <Card key={section.title} className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <section.icon className="h-5 w-5" />
                                    {section.title}
                                </CardTitle>
                                <CardDescription>{section.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {section.items.map((item, index) => (
                                        <li key={index} className="text-sm text-muted-foreground">
                                            • {item}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* FAQ Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Frequently Asked Questions</CardTitle>
                        <CardDescription>
                            Common questions and answers about using the user portal
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <div key={index} className="border-b pb-4 last:border-b-0">
                                    <h3 className="font-semibold mb-2">{faq.question}</h3>
                                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Contact Support */}
                <Card className="border-chart-2/20 bg-chart-2/5">
                    <CardHeader>
                        <CardTitle className="text-chart-2">Need More Help?</CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Contact our support team for additional assistance
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-chart-2" />
                                <div>
                                    <p className="font-medium">Email Support</p>
                                    <p className="text-sm text-muted-foreground">support@example.com</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-chart-2" />
                                <div>
                                    <p className="font-medium">Phone Support</p>
                                    <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <MessageCircle className="h-5 w-5 text-chart-2" />
                                <div>
                                    <p className="font-medium">Live Chat</p>
                                    <p className="text-sm text-muted-foreground">Available 9 AM - 5 PM</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </UserSidebarLayout>
    );
}
