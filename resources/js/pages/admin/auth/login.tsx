import AdminAuthLayout from '@/layouts/auth/admin-auth-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import InputError from '@/components/input-error';
import SuccessMessage from '@/components/success-message';
import TextLink from '@/components/text-link';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Shield, LoaderCircle } from 'lucide-react';
import { login } from '@/routes';
import { Head } from '@inertiajs/react';

interface AdminLoginProps {
    success?: string;
}

export default function AdminLogin({ success }: AdminLoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/admin/login');
    };

    return (
        <AdminAuthLayout
            title="Admin Login"
            description="Enter your admin credentials to access the admin panel"
        >
            <Head title="Admin Login" />

            {success && (
                <SuccessMessage message={success} className="mb-4" />
            )}

            <form onSubmit={submit} className="flex flex-col gap-6">
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="email"
                            placeholder="admin@example.com"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            placeholder="Password"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="flex items-center space-x-3">
                        <Checkbox
                            id="remember"
                            name="remember"
                            checked={data.remember}
                            onCheckedChange={(checked) => setData('remember', checked as boolean)}
                            tabIndex={3}
                        />
                        <Label htmlFor="remember">Remember me</Label>
                    </div>

                    <Button
                        type="submit"
                        className="mt-4 w-full"
                        tabIndex={4}
                        disabled={processing}
                        data-test="admin-login-button"
                    >
                        {processing && (
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                        )}
                        Admin Sign In
                    </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                    Regular user?{' '}
                    <TextLink href={login().url} tabIndex={5}>
                        Sign in here
                    </TextLink>
                </div>
            </form>
        </AdminAuthLayout>
    );
}
