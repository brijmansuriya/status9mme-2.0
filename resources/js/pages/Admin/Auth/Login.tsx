import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { route } from '@/utils/routes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Lock, Mail, Shield } from 'lucide-react';

export default function AdminLogin() {
    const [showPassword, setShowPassword] = useState(false);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Admin Login - Video Status Maker" />
            
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md"
                >
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-2xl">
                        <CardHeader className="text-center space-y-4">
                            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                                <Shield className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-bold text-white">Admin Portal</CardTitle>
                                <CardDescription className="text-white/80">
                                    Sign in to manage your video templates
                                </CardDescription>
                            </div>
                        </CardHeader>
                        
                        <CardContent className="space-y-6">
                            {errors.email && (
                                <Alert className="bg-red-500/20 border-red-500/50">
                                    <AlertDescription className="text-red-200">
                                        {errors.email}
                                    </AlertDescription>
                                </Alert>
                            )}
                            
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-white/90">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="pl-10 bg-white/10 border-white/20 text-white placeholder-white/60 focus:border-purple-400 focus:ring-purple-400"
                                            placeholder="admin@example.com"
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-white/90">Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
                                        <Input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder-white/60 focus:border-purple-400 focus:ring-purple-400"
                                            placeholder="Enter your password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="remember"
                                        checked={data.remember}
                                        onCheckedChange={(checked) => setData('remember', checked as boolean)}
                                        className="border-white/20 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                                    />
                                    <Label htmlFor="remember" className="text-white/90 text-sm">
                                        Remember me
                                    </Label>
                                </div>
                                
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-2.5"
                                >
                                    {processing ? 'Signing in...' : 'Sign In'}
                                </Button>
                            </form>
                            
                            <div className="text-center">
                                <Link
                                    href={route('home')}
                                    className="text-white/80 hover:text-white text-sm underline"
                                >
                                    ← Back to main site
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <div className="mt-6 text-center">
                        <p className="text-white/60 text-sm">
                            Secure admin access for Video Status Maker
                        </p>
                    </div>
                </motion.div>
            </div>
        </>
    );
}
