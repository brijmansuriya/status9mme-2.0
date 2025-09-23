import React, { useState, useRef, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Download, Upload, Palette, Type, Image, Music, Settings, RotateCcw } from 'lucide-react';
import { ChromePicker } from 'react-color';

interface Template {
    id: number;
    name: string;
    slug: string;
    description: string;
    json_config: any;
    thumbnail?: string;
    preview_video?: string;
    is_premium: boolean;
    duration: number;
    category: {
        name: string;
        color: string;
        icon: string;
    };
}

interface VideoEditorProps {
    template: Template;
}

export default function VideoEditor({ template }: VideoEditorProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [customizations, setCustomizations] = useState<Record<string, any>>({});
    const [showColorPicker, setShowColorPicker] = useState<string | null>(null);
    const [previewData, setPreviewData] = useState<any>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Initialize customizations from template
    useEffect(() => {
        const initialCustomizations: Record<string, any> = {};
        template.json_config.layers?.forEach((layer: any, index: number) => {
            if (layer.type === 'text') {
                initialCustomizations[`text_${index}`] = {
                    content: layer.content.replace(/{{(.*?)}}/g, ''),
                    fontSize: layer.fontSize,
                    color: layer.color,
                    fontFamily: layer.fontFamily,
                    textAlign: layer.textAlign,
                };
            } else if (layer.type === 'image') {
                initialCustomizations[`image_${index}`] = {
                    src: '',
                    size: layer.size,
                    position: layer.position,
                };
            }
        });
        setCustomizations(initialCustomizations);
    }, [template]);

    const handlePlayPause = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
        }
    };

    const handleSeek = (value: number[]) => {
        if (videoRef.current) {
            videoRef.current.currentTime = value[0];
            setCurrentTime(value[0]);
        }
    };

    const updateCustomization = (key: string, field: string, value: any) => {
        setCustomizations(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                [field]: value,
            },
        }));
    };

    const renderPreview = () => {
        // This would integrate with DiffusionStudio/core for actual video rendering
        return (
            <div className="relative bg-black rounded-lg overflow-hidden">
                <div className="aspect-[9/16] bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    {template.preview_video ? (
                        <video
                            ref={videoRef}
                            src={template.preview_video}
                            className="w-full h-full object-cover"
                            onTimeUpdate={handleTimeUpdate}
                            onEnded={() => setIsPlaying(false)}
                        />
                    ) : (
                        <div className="text-center text-white">
                            <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p className="text-lg">Preview will appear here</p>
                        </div>
                    )}
                </div>
                
                {/* Play/Pause Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <Button
                        size="lg"
                        className="bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                        onClick={handlePlayPause}
                    >
                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                    </Button>
                </div>

                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                        <Slider
                            value={[currentTime]}
                            max={template.duration}
                            step={0.1}
                            onValueChange={handleSeek}
                            className="w-full"
                        />
                        <div className="flex justify-between text-white text-sm mt-2">
                            <span>{Math.floor(currentTime)}s</span>
                            <span>{template.duration}s</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderTextEditor = () => {
        return (
            <div className="space-y-6">
                {template.json_config.layers?.map((layer: any, index: number) => {
                    if (layer.type !== 'text') return null;
                    
                    const key = `text_${index}`;
                    const customization = customizations[key] || {};
                    
                    return (
                        <Card key={index}>
                            <CardHeader>
                                <CardTitle className="text-lg">Text Layer {index + 1}</CardTitle>
                                <CardDescription>
                                    Original: {layer.content}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor={`content_${index}`}>Text Content</Label>
                                    <Input
                                        id={`content_${index}`}
                                        value={customization.content || ''}
                                        onChange={(e) => updateCustomization(key, 'content', e.target.value)}
                                        placeholder="Enter your text..."
                                    />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor={`fontSize_${index}`}>Font Size</Label>
                                        <Input
                                            id={`fontSize_${index}`}
                                            type="number"
                                            value={customization.fontSize || layer.fontSize}
                                            onChange={(e) => updateCustomization(key, 'fontSize', parseInt(e.target.value))}
                                        />
                                    </div>
                                    
                                    <div>
                                        <Label htmlFor={`fontFamily_${index}`}>Font Family</Label>
                                        <Select
                                            value={customization.fontFamily || layer.fontFamily}
                                            onValueChange={(value) => updateCustomization(key, 'fontFamily', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Arial">Arial</SelectItem>
                                                <SelectItem value="Helvetica">Helvetica</SelectItem>
                                                <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                                                <SelectItem value="Georgia">Georgia</SelectItem>
                                                <SelectItem value="serif">Serif</SelectItem>
                                                <SelectItem value="sans-serif">Sans Serif</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor={`textAlign_${index}`}>Text Alignment</Label>
                                        <Select
                                            value={customization.textAlign || layer.textAlign}
                                            onValueChange={(value) => updateCustomization(key, 'textAlign', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="left">Left</SelectItem>
                                                <SelectItem value="center">Center</SelectItem>
                                                <SelectItem value="right">Right</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    
                                    <div>
                                        <Label>Text Color</Label>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setShowColorPicker(showColorPicker === key ? null : key)}
                                                className="w-full justify-start"
                                            >
                                                <div 
                                                    className="w-4 h-4 rounded mr-2"
                                                    style={{ backgroundColor: customization.color || layer.color }}
                                                />
                                                {customization.color || layer.color}
                                            </Button>
                                        </div>
                                        {showColorPicker === key && (
                                            <div className="absolute z-10 mt-2">
                                                <ChromePicker
                                                    color={customization.color || layer.color}
                                                    onChange={(color) => updateCustomization(key, 'color', color.hex)}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        );
    };

    const renderImageEditor = () => {
        return (
            <div className="space-y-6">
                {template.json_config.layers?.map((layer: any, index: number) => {
                    if (layer.type !== 'image') return null;
                    
                    const key = `image_${index}`;
                    const customization = customizations[key] || {};
                    
                    return (
                        <Card key={index}>
                            <CardHeader>
                                <CardTitle className="text-lg">Image Layer {index + 1}</CardTitle>
                                <CardDescription>
                                    {layer.placeholder}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor={`image_${index}`}>Upload Image</Label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                        <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                                        <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                        <Input
                                            id={`image_${index}`}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                        />
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor={`width_${index}`}>Width</Label>
                                        <Input
                                            id={`width_${index}`}
                                            type="number"
                                            value={customization.size?.[0] || layer.size[0]}
                                            onChange={(e) => updateCustomization(key, 'size', [
                                                parseInt(e.target.value),
                                                customization.size?.[1] || layer.size[1]
                                            ])}
                                        />
                                    </div>
                                    
                                    <div>
                                        <Label htmlFor={`height_${index}`}>Height</Label>
                                        <Input
                                            id={`height_${index}`}
                                            type="number"
                                            value={customization.size?.[1] || layer.size[1]}
                                            onChange={(e) => updateCustomization(key, 'size', [
                                                customization.size?.[0] || layer.size[0],
                                                parseInt(e.target.value)
                                            ])}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        );
    };

    const renderAudioEditor = () => {
        return (
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Background Music</CardTitle>
                        <CardDescription>
                            Add background music to your video
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="audio">Upload Audio</Label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                <Music className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                <p className="text-gray-600 mb-2">Click to upload audio file</p>
                                <p className="text-sm text-gray-500">MP3, WAV, M4A up to 50MB</p>
                                <Input
                                    id="audio"
                                    type="file"
                                    accept="audio/*"
                                    className="hidden"
                                />
                            </div>
                        </div>
                        
                        <div>
                            <Label htmlFor="volume">Volume</Label>
                            <Slider
                                id="volume"
                                defaultValue={[50]}
                                max={100}
                                step={1}
                                className="w-full"
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    };

    const handleExport = () => {
        // This would integrate with DiffusionStudio/core for actual video export
        console.log('Exporting video with customizations:', customizations);
    };

    return (
        <>
            <Head title={`Edit ${template.name} - Video Editor`} />
            
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white border-b sticky top-0 z-10">
                    <div className="max-w-7xl mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{template.name}</h1>
                                <p className="text-gray-600">{template.category.name} • {template.duration}s</p>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                <Button variant="outline" onClick={() => window.history.back()}>
                                    <RotateCcw className="w-4 h-4 mr-2" />
                                    Back
                                </Button>
                                <Button onClick={handleExport} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                                    <Download className="w-4 h-4 mr-2" />
                                    Export Video
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Preview Panel */}
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Preview</CardTitle>
                                    <CardDescription>
                                        See how your video looks in real-time
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {renderPreview()}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Editor Panel */}
                        <div className="space-y-6">
                            <Tabs defaultValue="text" className="w-full">
                                <TabsList className="grid w-full grid-cols-4">
                                    <TabsTrigger value="text">
                                        <Type className="w-4 h-4 mr-2" />
                                        Text
                                    </TabsTrigger>
                                    <TabsTrigger value="images">
                                        <Image className="w-4 h-4 mr-2" />
                                        Images
                                    </TabsTrigger>
                                    <TabsTrigger value="audio">
                                        <Music className="w-4 h-4 mr-2" />
                                        Audio
                                    </TabsTrigger>
                                    <TabsTrigger value="settings">
                                        <Settings className="w-4 h-4 mr-2" />
                                        Settings
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="text" className="mt-6">
                                    {renderTextEditor()}
                                </TabsContent>

                                <TabsContent value="images" className="mt-6">
                                    {renderImageEditor()}
                                </TabsContent>

                                <TabsContent value="audio" className="mt-6">
                                    {renderAudioEditor()}
                                </TabsContent>

                                <TabsContent value="settings" className="mt-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Video Settings</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div>
                                                <Label htmlFor="duration">Duration (seconds)</Label>
                                                <Input
                                                    id="duration"
                                                    type="number"
                                                    value={template.duration}
                                                    disabled
                                                />
                                            </div>
                                            
                                            <div>
                                                <Label htmlFor="resolution">Resolution</Label>
                                                <Input
                                                    id="resolution"
                                                    value={template.json_config.resolution}
                                                    disabled
                                                />
                                            </div>
                                            
                                            <div>
                                                <Label htmlFor="quality">Export Quality</Label>
                                                <Select defaultValue="high">
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="low">Low (480p)</SelectItem>
                                                        <SelectItem value="medium">Medium (720p)</SelectItem>
                                                        <SelectItem value="high">High (1080p)</SelectItem>
                                                        <SelectItem value="ultra">Ultra (4K)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
