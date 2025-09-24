import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Heart, Download, Star } from 'lucide-react';

interface Template {
    id: number;
    name: string;
    slug: string;
    description: string;
    thumbnail?: string;
    preview_video?: string;
    is_premium: boolean;
    duration: number;
    downloads_count: number;
    views_count: number;
    rating: number | null;
    ratings_count: number;
    category: {
        name: string;
        color: string;
        icon: string;
    };
}

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string;
    color: string;
    icon: string;
    templates_count: number;
}

interface HomeProps {
    templates: Template[];
    categories: Category[];
    featuredTemplates: Template[];
}

export default function Home({ templates, categories, featuredTemplates }: HomeProps) {
    return (
        <>
            <Head title="Video Status Maker - Create Amazing Status Videos" />
            
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
                {/* Hero Section */}
                <section className="relative py-20 px-4">
                    <div className="max-w-7xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
                                Create Stunning
                                <br />
                                Status Videos
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                                Transform your moments into beautiful, shareable videos with our AI-powered template editor.
                                Perfect for WhatsApp, Instagram, and more!
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href={route('templates')}>
                                    <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                                        <Play className="w-5 h-5 mr-2" />
                                        Start Creating
                                    </Button>
                                </Link>
                                <Link href={route('templates')}>
                                    <Button size="lg" variant="outline">
                                        <Download className="w-5 h-5 mr-2" />
                                        View Templates
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Categories Section */}
                <section className="py-16 px-4">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="text-center mb-12"
                        >
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Style</h2>
                            <p className="text-xl text-gray-600">Browse our curated collection of video templates</p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {categories.map((category, index) => (
                                <motion.div
                                    key={category.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-white/80 backdrop-blur-sm">
                                        <CardHeader className="text-center">
                                            <div 
                                                className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-white text-2xl mb-4"
                                                style={{ backgroundColor: category.color }}
                                            >
                                                {category.icon}
                                            </div>
                                            <CardTitle className="text-xl">{category.name}</CardTitle>
                                            <CardDescription>{category.description}</CardDescription>
                                        </CardHeader>
                                        <CardContent className="text-center">
                                            <Badge variant="secondary" className="mb-4">
                                                {category.templates_count} templates
                                            </Badge>
                                            <Link href={route('templates')}>
                                                <Button 
                                                    variant="outline" 
                                                    className="w-full group-hover:bg-gray-50"
                                                    style={{ borderColor: category.color, color: category.color }}
                                                >
                                                    Explore
                                                </Button>
                                            </Link>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Featured Templates Section */}
                <section className="py-16 px-4 bg-white/50">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="text-center mb-12"
                        >
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Templates</h2>
                            <p className="text-xl text-gray-600">Most popular and trending video templates</p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {featuredTemplates.map((template, index) => (
                                <motion.div
                                    key={template.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden">
                                        <div className="relative">
                                            <div className="aspect-[9/16] bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                                {template.thumbnail ? (
                                                    <img 
                                                        src={template.thumbnail} 
                                                        alt={template.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <Play className="w-12 h-12 text-gray-400" />
                                                )}
                                            </div>
                                            {template.is_premium && (
                                                <Badge className="absolute top-2 right-2 bg-yellow-500">
                                                    Premium
                                                </Badge>
                                            )}
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                <Link href={route('templates.editor', template.slug)}>
                                                    <Button size="sm" className="bg-white text-black hover:bg-gray-100">
                                                        <Play className="w-4 h-4 mr-2" />
                                                        Customize
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <Badge 
                                                    variant="secondary" 
                                                    style={{ backgroundColor: template.category.color + '20', color: template.category.color }}
                                                >
                                                    {template.category.name}
                                                </Badge>
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                                                    {template.rating ? Number(template.rating).toFixed(1) : '0.0'}
                                                </div>
                                            </div>
                                            <h3 className="font-semibold text-lg mb-2 line-clamp-2">{template.name}</h3>
                                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{template.description}</p>
                                            <div className="flex items-center justify-between text-sm text-gray-500">
                                                <span>{template.duration}s</span>
                                                <div className="flex items-center gap-3">
                                                    <span className="flex items-center">
                                                        <Heart className="w-4 h-4 mr-1" />
                                                        {template.views_count}
                                                    </span>
                                                    <span className="flex items-center">
                                                        <Download className="w-4 h-4 mr-1" />
                                                        {template.downloads_count}
                                                    </span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl font-bold text-gray-900 mb-6">
                                Ready to Create Your First Video?
                            </h2>
                            <p className="text-xl text-gray-600 mb-8">
                                Join thousands of creators who are already making amazing status videos
                            </p>
                            <Link href={route('templates')}>
                                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                                    Get Started Now
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                </section>
            </div>
        </>
    );
}
