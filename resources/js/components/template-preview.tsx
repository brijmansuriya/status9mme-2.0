import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    X
} from 'lucide-react';

interface TemplatePreviewProps {
    template: {
        id: number;
        name: string;
        json_layout: object;
        thumbnail_url?: string;
        category: string;
        status: string;
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
    const [duration, setDuration] = useState(10); // Mock duration
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const previewRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<number>();

    // Mock animation timeline
    const mockTimeline = [
        { time: 0, opacity: 0, scale: 0.8 },
        { time: 1, opacity: 1, scale: 1 },
        { time: 3, opacity: 1, scale: 1.1 },
        { time: 5, opacity: 1, scale: 1 },
        { time: 8, opacity: 0.8, scale: 1 },
        { time: 10, opacity: 1, scale: 1 }
    ];

    useEffect(() => {
        if (isPlaying) {
            const animate = () => {
                setCurrentTime(prev => {
                    const nextTime = prev + 0.1;
                    if (nextTime >= duration) {
                        setIsPlaying(false);
                        return 0;
                    }
                    return nextTime;
                });
                animationRef.current = requestAnimationFrame(animate);
            };
            animationRef.current = requestAnimationFrame(animate);
        } else {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        }

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isPlaying, duration]);

    useEffect(() => {
        if (isFullscreen && previewRef.current) {
            if (previewRef.current.requestFullscreen) {
                previewRef.current.requestFullscreen();
            }
        }
    }, [isFullscreen]);

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const handleRestart = () => {
        setCurrentTime(0);
        setIsPlaying(true);
    };

    const handleVolumeToggle = () => {
        setIsMuted(!isMuted);
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVolume(parseFloat(e.target.value));
        setIsMuted(parseFloat(e.target.value) === 0);
    };

    const handleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    const getCurrentAnimationState = () => {
        const currentState = mockTimeline.find(
            frame => frame.time <= currentTime
        ) || mockTimeline[mockTimeline.length - 1];

        const nextState = mockTimeline.find(
            frame => frame.time > currentTime
        );

        if (!nextState) return currentState;

        const progress = (currentTime - currentState.time) / (nextState.time - currentState.time);

        return {
            opacity: currentState.opacity + (nextState.opacity - currentState.opacity) * progress,
            scale: currentState.scale + (nextState.scale - currentState.scale) * progress
        };
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            birthday: 'bg-pink-100 text-pink-800',
            wedding: 'bg-rose-100 text-rose-800',
            festival: 'bg-yellow-100 text-yellow-800',
            business: 'bg-blue-100 text-blue-800',
            general: 'bg-gray-100 text-gray-800'
        };
        return colors[category] || colors.general;
    };

    if (!isVisible) {
        return null;
    }

    if (mode === 'thumbnail') {
        return (
            <div className="relative group">
                <div className="aspect-video bg-muted rounded-md overflow-hidden">
                    {template.thumbnail_url ? (
                        <img
                            src={template.thumbnail_url}
                            alt={template.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                    )}
                </div>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button size="sm" variant="secondary">
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div
                ref={previewRef}
                className={`bg-background rounded-lg shadow-lg ${isFullscreen ? 'w-full h-full' : 'w-full max-w-4xl max-h-[80vh]'
                    } flex flex-col`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <div className="flex items-center gap-4">
                        <h2 className="text-lg font-semibold">{template.name}</h2>
                        <Badge className={getCategoryColor(template.category)}>
                            {template.category}
                        </Badge>
                        <Badge variant="outline">{template.status}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={handleFullscreen}>
                            <Maximize className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => {/* Download logic */ }}>
                            <Download className="h-4 w-4" />
                        </Button>
                        {onClose && (
                            <Button variant="ghost" size="sm" onClick={onClose}>
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>

                {/* Preview Area */}
                <div className="flex-1 p-6 flex flex-col">
                    <div className="flex-1 bg-muted/30 rounded-lg relative overflow-hidden">
                        {/* Template Canvas */}
                        <div
                            className="w-full h-full flex items-center justify-center"
                            style={{
                                transform: `scale(${getCurrentAnimationState().scale})`,
                                opacity: getCurrentAnimationState().opacity,
                                transition: isPlaying ? 'none' : 'all 0.3s ease'
                            }}
                        >
                            {template.thumbnail_url ? (
                                <img
                                    src={template.thumbnail_url}
                                    alt={template.name}
                                    className="max-w-full max-h-full object-contain"
                                />
                            ) : (
                                <div className="text-center">
                                    <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-muted-foreground">Template Preview</p>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        JSON Layout: {JSON.stringify(template.json_layout).length} characters
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Animation Overlay */}
                        {mode === 'interactive' && (
                            <div className="absolute inset-0 pointer-events-none">
                                {/* Mock animated elements */}
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
                </div>
            </div>
        </div>
    );
};

export default TemplatePreview;
