import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, Palette, Wand2, Eye, Download, Play } from 'lucide-react';

export function DemoShowcase() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <Sparkles className="h-6 w-6 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">
                            Enhanced Template Editor
                        </h1>
                    </div>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Experience the power of modern UI design with shadcn/ui components, Tailwind CSS, and advanced canvas interactions
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-300">
                        <CardHeader className="text-center">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <Palette className="h-6 w-6 text-white" />
                            </div>
                            <CardTitle className="text-slate-900 dark:text-slate-100">Modern Theme Colors</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <CardDescription className="text-slate-600 dark:text-slate-400">
                                Beautiful gradient backgrounds, glass morphism effects, and carefully crafted color schemes
                            </CardDescription>
                            <div className="flex gap-2 flex-wrap">
                                <Badge className="bg-blue-500 text-white">Blue</Badge>
                                <Badge className="bg-purple-500 text-white">Purple</Badge>
                                <Badge className="bg-green-500 text-white">Green</Badge>
                                <Badge className="bg-orange-500 text-white">Orange</Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-300">
                        <CardHeader className="text-center">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <Wand2 className="h-6 w-6 text-white" />
                            </div>
                            <CardTitle className="text-slate-900 dark:text-slate-100">Drag & Drop Canvas</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <CardDescription className="text-slate-600 dark:text-slate-400">
                                Intuitive drag and drop functionality with resize handles, zoom controls, and smooth animations
                            </CardDescription>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span>Move elements with mouse</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <span>Resize with corner handles</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                    <span>Zoom in/out controls</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-300">
                        <CardHeader className="text-center">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <Eye className="h-6 w-6 text-white" />
                            </div>
                            <CardTitle className="text-slate-900 dark:text-slate-100">Enhanced UI Components</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <CardDescription className="text-slate-600 dark:text-slate-400">
                                Premium shadcn/ui components with custom styling, hover effects, and smooth transitions
                            </CardDescription>
                            <div className="flex gap-2">
                                <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                                    <Play className="h-3 w-3 mr-1" />
                                    Preview
                                </Button>
                                <Button variant="outline" size="sm">
                                    <Download className="h-3 w-3 mr-1" />
                                    Export
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Interactive Demo */}
                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-center text-slate-900 dark:text-slate-100">Interactive Features</CardTitle>
                        <CardDescription className="text-center text-slate-600 dark:text-slate-400">
                            Try out the enhanced template editor with all the new features
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-8 border-2 border-dashed border-slate-300 dark:border-slate-600">
                            <div className="text-slate-500 dark:text-slate-400 mb-4">
                                <Sparkles className="h-12 w-12 mx-auto mb-4" />
                                <h3 className="text-lg font-medium mb-2">Template Editor</h3>
                                <p className="text-sm">Click to open the enhanced editor</p>
                            </div>
                            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                                <Wand2 className="h-4 w-4 mr-2" />
                                Open Editor
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
