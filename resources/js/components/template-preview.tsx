import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
    Play,
    Pause,
    RotateCcw,
    Volume2,
    VolumeX,
    Maximize,
    Download,
    Image as ImageIcon,
    Eye,
    X,
    Clock,
    User,
    Calendar,
    Tag as TagIcon,
    Share2,
    Edit,
    Copy,
    Type,
    Music,
    Shapes,
    Sticker
} from 'lucide-react';

interface TemplatePreviewProps {
    template: {
        id: number;
        name: string;
        slug: string;
        description?: string;
        json_layout: object;
        thumbnail_url?: string;
        category: string;
        tags?: string[];
        version: number;
        status: 'draft' | 'published' | 'archived';
        is_default: boolean;
        created_at: string;
        updated_at: string;
        admin?: {
            id: number;
            name: string;
        };
    };
    onClose?: () => void;
    isVisible: boolean;
    mode?: 'thumbnail' | 'interactive' | 'fullscreen';
}

const TemplatePreview: React.FC<TemplatePreviewProps> = ({
    template,
    onClose,
    isVisible,
    mode = 'interactive'
}) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(10);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const previewRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<number>();

    useEffect(() => {
        if (isPlaying) {
            const interval = setInterval(() => {
                setCurrentTime(prev => {
                    if (prev >= duration) {
                        setIsPlaying(false);
                        return 0;
                    }
                    return prev + 0.1;
                });
            }, 100);
            animationRef.current = interval;
        } else {
            if (animationRef.current) {
                clearInterval(animationRef.current);
            }
        }

        return () => {
            if (animationRef.current) {
                clearInterval(animationRef.current);
            }
        };
    }, [isPlaying, duration]);

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const handleRestart = () => {
        setCurrentTime(0);
        setIsPlaying(false);
    };

    const handleVolumeToggle = () => {
        setIsMuted(!isMuted);
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        setIsMuted(newVolume === 0);
    };

    const handleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'published':
                return <Badge variant="default" className="bg-green-100 text-green-800">Published</Badge>;
            case 'draft':
                return <Badge variant="secondary">Draft</Badge>;
            case 'archived':
                return <Badge variant="outline">Archived</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getCategoryColor = (category: string) => {
        const colors = {
            birthday: 'bg-pink-100 text-pink-800',
            wedding: 'bg-rose-100 text-rose-800',
            festival: 'bg-orange-100 text-orange-800',
            business: 'bg-blue-100 text-blue-800',
            quotes: 'bg-purple-100 text-purple-800',
            anniversary: 'bg-red-100 text-red-800',
            graduation: 'bg-green-100 text-green-800',
            holiday: 'bg-yellow-100 text-yellow-800',
            social: 'bg-indigo-100 text-indigo-800',
            general: 'bg-gray-100 text-gray-800'
        };
        return colors[category as keyof typeof colors] || colors.general;
    };

    if (mode === 'thumbnail') {
        return (
            <div className="relative group">
                <div
                    ref={previewRef}
                    className="relative bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
                    style={{
                        width: '100%',
                        height: '200px'
                    }}
                    onClick={() => {/* Open full preview */ }}
                >
                    {template.thumbnail_url ? (
                        <img
                            src={template.thumbnail_url}
                            alt={template.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                            <div className="text-center text-white">
                                <ImageIcon className="h-8 w-8 mx-auto mb-2" />
                                <p className="text-sm">{template.name}</p>
                            </div>
                        </div>
                    )}

                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Eye className="h-6 w-6 text-white" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <Dialog open={isVisible} onOpenChange={onClose}>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden p-0">
                <DialogHeader className="p-6 pb-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <DialogTitle className="text-xl font-semibold">{template.name}</DialogTitle>
                            {template.is_default && (
                                <Badge variant="outline">Default</Badge>
                            )}
                            {getStatusBadge(template.status)}
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={handleFullscreen}>
                                <Maximize className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                                <Download className="h-4 w-4" />
                            </Button>
                            {onClose && (
                                <Button variant="outline" size="sm" onClick={onClose}>
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                    {template.description && (
                        <DialogDescription className="mt-2">
                            {template.description}
                        </DialogDescription>
                    )}
                </DialogHeader>

                <div className="px-6 pb-6 flex gap-6">
                    {/* Main Preview */}
                    <div className="flex-1">
                        <Card>
                            <CardContent className="p-6">
                                <div
                                    ref={previewRef}
                                    className="relative bg-gray-100 rounded-lg overflow-hidden mx-auto"
                                    style={{
                                        width: '100%',
                                        height: '400px',
                                        maxWidth: '800px'
                                    }}
                                >
                                    {template.thumbnail_url ? (
                                        <img
                                            src={template.thumbnail_url}
                                            alt={template.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                                            <div className="text-center text-white">
                                                <ImageIcon className="h-16 w-16 mx-auto mb-4" />
                                                <h3 className="text-2xl font-bold mb-2">{template.name}</h3>
                                                <p className="text-lg opacity-90">Template Preview</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Animation Overlay */}
                                    {mode === 'interactive' && (
                                        <div className="absolute inset-0 pointer-events-none">
                                            <div
                                                className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm"
                                                style={{
                                                    transform: `translateY(${Math.sin(currentTime * 2) * 10}px)`,
                                                    opacity: Math.max(0, 1 - Math.abs(currentTime - 2) * 0.5)
                                                }}
                                            >
                                                Animated Text
                                            </div>
                                            <div
                                                className="absolute bottom-4 right-4 w-8 h-8 bg-secondary rounded-full"
                                                style={{
                                                    transform: `scale(${1 + Math.sin(currentTime * 3) * 0.2})`,
                                                    opacity: Math.max(0, 1 - Math.abs(currentTime - 5) * 0.3)
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Controls */}
                                {mode === 'interactive' && (
                                    <div className="mt-6 space-y-4">
                                        {/* Timeline */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span>{formatTime(currentTime)}</span>
                                                <span>{formatTime(duration)}</span>
                                            </div>
                                            <div className="relative">
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max={duration}
                                                    value={currentTime}
                                                    onChange={(e) => setCurrentTime(parseFloat(e.target.value))}
                                                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                                                />
                                                <div
                                                    className="absolute top-0 left-0 h-2 bg-primary rounded-lg pointer-events-none"
                                                    style={{ width: `${(currentTime / duration) * 100}%` }}
                                                />
                                            </div>
                                        </div>

                                        {/* Control Buttons */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Button variant="outline" size="sm" onClick={handlePlayPause}>
                                                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                                                </Button>
                                                <Button variant="outline" size="sm" onClick={handleRestart}>
                                                    <RotateCcw className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Button variant="outline" size="sm" onClick={handleVolumeToggle}>
                                                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                                                </Button>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="1"
                                                    step="0.1"
                                                    value={isMuted ? 0 : volume}
                                                    onChange={handleVolumeChange}
                                                    className="w-20 h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Template Details */}
                    <div className="w-80">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Template Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label className="text-sm font-medium text-gray-700">Category</Label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge className={getCategoryColor(template.category)}>
                                            {template.category}
                                        </Badge>
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-700">Version</Label>
                                    <p className="text-sm text-gray-600">v{template.version}</p>
                                </div>

                                {template.admin && (
                                    <div>
                                        <Label className="text-sm font-medium text-gray-700">Created by</Label>
                                        <div className="flex items-center gap-2 mt-1">
                                            <User className="h-4 w-4 text-gray-400" />
                                            <span className="text-sm text-gray-600">{template.admin.name}</span>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <Label className="text-sm font-medium text-gray-700">Created</Label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Calendar className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">{formatDate(template.created_at)}</span>
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-700">Last Updated</Label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Clock className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">{formatDate(template.updated_at)}</span>
                                    </div>
                                </div>

                                {template.tags && template.tags.length > 0 && (
                                    <div>
                                        <Label className="text-sm font-medium text-gray-700">Tags</Label>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {template.tags.map((tag, index) => (
                                                <Badge key={index} variant="secondary" className="text-xs">
                                                    <TagIcon className="h-3 w-3 mr-1" />
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="border-t pt-4">
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" className="flex-1">
                                            <Edit className="h-4 w-4 mr-2" />
                                            Edit
                                        </Button>
                                        <Button variant="outline" size="sm" className="flex-1">
                                            <Copy className="h-4 w-4 mr-2" />
                                            Duplicate
                                        </Button>
                                    </div>
                                    <Button variant="outline" size="sm" className="w-full mt-2">
                                        <Share2 className="h-4 w-4 mr-2" />
                                        Share
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default TemplatePreview;