import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import {
    Save,
    X,
    Play,
    Download,
    Settings,
    Type,
    Image as ImageIcon,
    Music,
    Shapes,
    Sticker,
    Sparkles,
    Move,
    RotateCw,
    Trash2,
    Copy,
    Layers,
    Eye,
    EyeOff,
    ZoomIn,
    ZoomOut,
    RotateCcw,
    Grid3X3,
    Palette,
    Wand2,
    GripVertical,
    Plus,
    Clock,
    Scissors,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Bold,
    Italic,
    Underline,
    Filter,
    Volume2,
    Video,
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
    Lock,
    Unlock,
    Group,
    Ungroup,
    AlignHorizontalJustifyCenter,
    AlignVerticalJustifyCenter,
    FlipHorizontal,
    FlipVertical,
    Square,
    Circle,
    Triangle,
    Star,
    Heart,
    ArrowRight,
    ArrowLeft,
    ArrowUp,
    ArrowDown
} from 'lucide-react';

interface Element {
    id: string;
    type: 'text' | 'image' | 'shape' | 'audio' | 'video' | 'sticker';
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    opacity: number;
    visible: boolean;
    locked: boolean;
    // Text properties
    text?: string;
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    textAlign?: string;
    color?: string;
    // Shape properties
    shapeType?: string;
    fillColor?: string;
    strokeColor?: string;
    strokeWidth?: number;
    // Media properties
    src?: string;
    alt?: string;
    // Animation properties
    animation?: string;
    duration?: number;
}

interface Scene {
    id: string;
    name: string;
    duration: number;
    transition: string;
    background: string;
    elements: Element[];
}

interface CanvasSize {
    width: number;
    height: number;
}

const canvasPresets = [
    { name: 'Instagram Story', width: 1080, height: 1920 },
    { name: 'Instagram Post', width: 1080, height: 1080 },
    { name: 'Facebook Post', width: 1200, height: 630 },
    { name: 'YouTube Thumbnail', width: 1280, height: 720 },
    { name: 'Twitter Post', width: 1200, height: 675 },
    { name: 'LinkedIn Post', width: 1200, height: 628 },
    { name: 'Pinterest Pin', width: 1000, height: 1500 },
    { name: 'Custom', width: 1080, height: 1080 }
];

const tools = [
    { id: 'select', name: 'Select', icon: Move, description: 'Select and move elements' },
    { id: 'text', name: 'Text', icon: Type, description: 'Add text elements' },
    { id: 'image', name: 'Image', icon: ImageIcon, description: 'Add images' },
    { id: 'shape', name: 'Shapes', icon: Shapes, description: 'Add shapes' },
    { id: 'audio', name: 'Audio', icon: Music, description: 'Add audio' },
    { id: 'video', name: 'Video', icon: Video, description: 'Add videos' },
    { id: 'background', name: 'Background', icon: Palette, description: 'Change background' },
    { id: 'sticker', name: 'Stickers', icon: Sticker, description: 'Add stickers' }
];

const shapes = [
    { id: 'rectangle', name: 'Rectangle', icon: Square },
    { id: 'circle', name: 'Circle', icon: Circle },
    { id: 'triangle', name: 'Triangle', icon: Triangle },
    { id: 'star', name: 'Star', icon: Star },
    { id: 'heart', name: 'Heart', icon: Heart },
    { id: 'arrow-right', name: 'Arrow Right', icon: ArrowRight },
    { id: 'arrow-left', name: 'Arrow Left', icon: ArrowLeft },
    { id: 'arrow-up', name: 'Arrow Up', icon: ArrowUp },
    { id: 'arrow-down', name: 'Arrow Down', icon: ArrowDown }
];

const transitions = [
    'None', 'Fade', 'Slide Left', 'Slide Right', 'Slide Up', 'Slide Down',
    'Zoom In', 'Zoom Out', 'Rotate', 'Flip', 'Blur', 'Glow'
];

const themeColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD',
    '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA',
    '#F1948A', '#85C1E9', '#D7BDE2', '#AED6F1', '#A9DFBF', '#F9E79F',
    '#000000', '#FFFFFF', '#808080', '#FF0000', '#00FF00', '#0000FF'
];

interface CanvaEditorProps {
    initialData?: any;
    onSave?: (data: any) => void;
    onCancel?: () => void;
    mode: 'create' | 'edit';
}

export default function FullscreenCanvaEditor({ initialData, onSave, onCancel, mode }: CanvaEditorProps) {
    const [scenes, setScenes] = useState<Scene[]>([]);
    const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
    const [selectedTool, setSelectedTool] = useState('select');
    const [selectedElement, setSelectedElement] = useState<string | null>(null);
    const [canvasSize, setCanvasSize] = useState<CanvasSize>({ width: 1080, height: 1920 });
    const [zoom, setZoom] = useState(100);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showGrid, setShowGrid] = useState(true);
    const [showRulers, setShowRulers] = useState(true);
    const [draggedElement, setDraggedElement] = useState<string | null>(null);
    const [draggedSceneIndex, setDraggedSceneIndex] = useState<number | null>(null);
    const [editingSceneName, setEditingSceneName] = useState<number | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    const canvasRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initialize with default scene
    useEffect(() => {
        if (scenes.length === 0) {
            const defaultScene: Scene = {
                id: 'scene-1',
                name: 'Scene 1',
                duration: 3,
                transition: 'None',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                elements: []
            };
            setScenes([defaultScene]);
        }
    }, [scenes.length]);

    const currentScene = scenes[currentSceneIndex];

    // Scene management
    const addScene = () => {
        const newScene: Scene = {
            id: `scene-${Date.now()}`,
            name: `Scene ${scenes.length + 1}`,
            duration: 3,
            transition: 'None',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            elements: []
        };
        setScenes([...scenes, newScene]);
        setCurrentSceneIndex(scenes.length);
    };

    const deleteScene = (index: number) => {
        if (scenes.length > 1) {
            const newScenes = scenes.filter((_, i) => i !== index);
            setScenes(newScenes);
            if (currentSceneIndex >= index) {
                setCurrentSceneIndex(Math.max(0, currentSceneIndex - 1));
            }
        }
    };

    const duplicateScene = (index: number) => {
        const scene = scenes[index];
        const newScene: Scene = {
            ...scene,
            id: `scene-${Date.now()}`,
            name: `${scene.name} Copy`,
            elements: scene.elements.map(el => ({ ...el, id: `${el.id}-copy-${Date.now()}` }))
        };
        const newScenes = [...scenes];
        newScenes.splice(index + 1, 0, newScene);
        setScenes(newScenes);
    };

    const updateScene = (index: number, updates: Partial<Scene>) => {
        const newScenes = [...scenes];
        newScenes[index] = { ...newScenes[index], ...updates };
        setScenes(newScenes);
    };

    // Element management
    const addElement = (type: string, properties: Partial<Element> = {}) => {
        if (!currentScene) return;

        const newElement: Element = {
            id: `element-${Date.now()}`,
            type: type as Element['type'],
            x: 100,
            y: 100,
            width: 200,
            height: 100,
            rotation: 0,
            opacity: 1,
            visible: true,
            locked: false,
            text: type === 'text' ? 'Your text here' : '',
            fontSize: 24,
            fontFamily: 'Arial',
            fontWeight: 'normal',
            fontStyle: 'normal',
            textAlign: 'left',
            color: '#000000',
            shapeType: type === 'shape' ? 'rectangle' : undefined,
            fillColor: '#FF6B6B',
            strokeColor: '#000000',
            strokeWidth: 2,
            animation: 'none',
            duration: 1,
            ...properties
        };

        const newScenes = [...scenes];
        newScenes[currentSceneIndex].elements.push(newElement);
        setScenes(newScenes);
        setSelectedElement(newElement.id);
    };

    const updateElement = (elementId: string, updates: Partial<Element>) => {
        const newScenes = [...scenes];
        const elementIndex = newScenes[currentSceneIndex].elements.findIndex(el => el.id === elementId);
        if (elementIndex !== -1) {
            newScenes[currentSceneIndex].elements[elementIndex] = {
                ...newScenes[currentSceneIndex].elements[elementIndex],
                ...updates
            };
            setScenes(newScenes);
        }
    };

    const deleteElement = (elementId: string) => {
        const newScenes = [...scenes];
        newScenes[currentSceneIndex].elements = newScenes[currentSceneIndex].elements.filter(el => el.id !== elementId);
        setScenes(newScenes);
        if (selectedElement === elementId) {
            setSelectedElement(null);
        }
    };

    const duplicateElement = (elementId: string) => {
        const element = currentScene?.elements.find(el => el.id === elementId);
        if (element) {
            addElement(element.type, {
                ...element,
                id: `element-${Date.now()}`,
                x: element.x + 20,
                y: element.y + 20
            });
        }
    };

    // Drag and drop handlers
    const handleMouseDown = (e: React.MouseEvent, elementId: string) => {
        if (selectedElement !== elementId) {
            setSelectedElement(elementId);
        }

        const element = currentScene?.elements.find(el => el.id === elementId);
        if (!element) return;

        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        const elementRect = {
            x: (element.x / canvasSize.width) * rect.width,
            y: (element.y / canvasSize.height) * rect.height
        };

        setDragOffset({
            x: e.clientX - elementRect.x,
            y: e.clientY - elementRect.y
        });
        setIsDragging(true);
        setDraggedElement(elementId);
    };

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging || !draggedElement || !canvasRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = ((e.clientX - dragOffset.x - rect.left) / rect.width) * canvasSize.width;
        const y = ((e.clientY - dragOffset.y - rect.top) / rect.height) * canvasSize.height;

        updateElement(draggedElement, {
            x: Math.max(0, Math.min(x, canvasSize.width)),
            y: Math.max(0, Math.min(y, canvasSize.height))
        });
    }, [isDragging, draggedElement, dragOffset, canvasSize]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
        setDraggedElement(null);
    }, []);

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    // Scene reordering handlers
    const handleSceneDragStart = (e: React.DragEvent, sceneIndex: number) => {
        setDraggedSceneIndex(sceneIndex);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleSceneDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleSceneDrop = (e: React.DragEvent, targetIndex: number) => {
        e.preventDefault();

        if (draggedSceneIndex === null || draggedSceneIndex === targetIndex) {
            setDraggedSceneIndex(null);
            return;
        }

        const newScenes = [...scenes];
        const draggedScene = newScenes[draggedSceneIndex];
        newScenes.splice(draggedSceneIndex, 1);
        newScenes.splice(targetIndex, 0, draggedScene);
        setScenes(newScenes);

        if (currentSceneIndex === draggedSceneIndex) {
            setCurrentSceneIndex(targetIndex);
        } else if (draggedSceneIndex < currentSceneIndex && targetIndex >= currentSceneIndex) {
            setCurrentSceneIndex(currentSceneIndex - 1);
        } else if (draggedSceneIndex > currentSceneIndex && targetIndex <= currentSceneIndex) {
            setCurrentSceneIndex(currentSceneIndex + 1);
        }

        setDraggedSceneIndex(null);
    };

    const handleSceneDragEnd = () => {
        setDraggedSceneIndex(null);
    };

    // File upload handler
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const src = event.target?.result as string;
                addElement('image', {
                    src,
                    alt: file.name,
                    width: 200,
                    height: 200
                });
            };
            reader.readAsDataURL(file);
        }
    };

    // Save handler
    const handleSave = () => {
        const templateData = {
            name: `Template ${Date.now()}`,
            description: 'Created with Canva Editor',
            category: 'general',
            tags: ['canva', 'editor'],
            json_layout: {
                version: '1.0',
                scenes: scenes,
                canvasSize,
                created_at: new Date().toISOString()
            },
            status: 'draft'
        };

        if (onSave) {
            onSave(templateData);
        } else {
            // Navigate back to templates list
            router.post('/admin/templates', templateData);
        }
    };

    // Zoom handlers
    const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 200));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 25));
    const handleZoomReset = () => setZoom(100);

    const selectedElementData = currentScene?.elements.find(el => el.id === selectedElement);

    return (
        <div className="h-screen bg-slate-50 dark:bg-slate-900 flex flex-col overflow-hidden">
            <Head title="Canva Editor - Create Template" />

            {/* Top Toolbar */}
            <div className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                            <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">Canva Editor</h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={handleZoomOut}>
                            <ZoomOut className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400 w-12 text-center">
                            {zoom}%
                        </span>
                        <Button variant="ghost" size="sm" onClick={handleZoomIn}>
                            <ZoomIn className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={handleZoomReset}>
                            <Grid3X3 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" onClick={() => setIsPlaying(!isPlaying)}>
                        {isPlaying ? <X className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                        {isPlaying ? 'Stop' : 'Preview'}
                    </Button>

                    <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </Button>

                    <Button onClick={handleSave} className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700">
                        <Save className="h-4 w-4 mr-2" />
                        Save Template
                    </Button>

                    {onCancel && (
                        <Button variant="ghost" size="sm" onClick={onCancel}>
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Left Toolbar */}
                <div className="w-16 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col items-center py-4 gap-2">
                    {tools.map((tool) => (
                        <Button
                            key={tool.id}
                            variant={selectedTool === tool.id ? 'default' : 'ghost'}
                            size="sm"
                            className={`w-12 h-12 p-0 ${selectedTool === tool.id ? 'bg-purple-500 text-white' : ''}`}
                            onClick={() => setSelectedTool(tool.id)}
                            title={tool.description}
                        >
                            <tool.icon className="h-5 w-5" />
                        </Button>
                    ))}
                </div>

                {/* Main Canvas Area */}
                <div className="flex-1 flex flex-col">
                    {/* Canvas */}
                    <div className="flex-1 flex items-center justify-center p-8 bg-slate-100 dark:bg-slate-800 relative overflow-auto">
                        <div
                            ref={canvasRef}
                            className="relative bg-white dark:bg-slate-700 shadow-2xl border border-slate-200 dark:border-slate-600"
                            style={{
                                width: (canvasSize.width * zoom) / 100,
                                height: (canvasSize.height * zoom) / 100,
                                background: currentScene?.background || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                backgroundImage: showGrid ? `
                                    linear-gradient(to right, #e2e8f0 1px, transparent 1px),
                                    linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
                                ` : 'none',
                                backgroundSize: showGrid ? '20px 20px' : 'auto'
                            }}
                        >
                            {/* Scene Elements */}
                            {currentScene?.elements.map((element) => (
                                <div
                                    key={element.id}
                                    className={`absolute cursor-move transition-all duration-200 ${selectedElement === element.id ? 'ring-2 ring-purple-500 ring-offset-2' : ''
                                        } ${!element.visible ? 'opacity-0' : ''}`}
                                    style={{
                                        left: `${(element.x / canvasSize.width) * 100}%`,
                                        top: `${(element.y / canvasSize.height) * 100}%`,
                                        width: `${(element.width / canvasSize.width) * 100}%`,
                                        height: `${(element.height / canvasSize.height) * 100}%`,
                                        transform: `rotate(${element.rotation}deg)`,
                                        opacity: element.opacity,
                                        pointerEvents: element.locked ? 'none' : 'auto'
                                    }}
                                    onMouseDown={(e) => handleMouseDown(e, element.id)}
                                >
                                    {element.type === 'text' && (
                                        <div
                                            className="w-full h-full flex items-center justify-center text-center p-2"
                                            style={{
                                                fontSize: `${(element.fontSize || 24) * (zoom / 100)}px`,
                                                fontFamily: element.fontFamily || 'Arial',
                                                fontWeight: element.fontWeight || 'normal',
                                                fontStyle: element.fontStyle || 'normal',
                                                color: element.color || '#000000',
                                                textAlign: element.textAlign as any || 'center'
                                            }}
                                        >
                                            {element.text || 'Your text here'}
                                        </div>
                                    )}

                                    {element.type === 'image' && (
                                        <img
                                            src={element.src}
                                            alt={element.alt}
                                            className="w-full h-full object-cover rounded"
                                        />
                                    )}

                                    {element.type === 'shape' && (
                                        <div
                                            className="w-full h-full border-2 rounded"
                                            style={{
                                                backgroundColor: element.fillColor || '#FF6B6B',
                                                borderColor: element.strokeColor || '#000000',
                                                borderWidth: `${element.strokeWidth || 2}px`
                                            }}
                                        />
                                    )}

                                    {element.type === 'sticker' && (
                                        <div className="w-full h-full flex items-center justify-center text-4xl">
                                            🎉
                                        </div>
                                    )}

                                    {/* Element Controls */}
                                    {selectedElement === element.id && (
                                        <>
                                            {/* Resize Handles */}
                                            <div className="absolute -top-1 -left-1 w-3 h-3 bg-purple-500 border border-white rounded-full cursor-nw-resize" />
                                            <div className="absolute -top-1 right-0 w-3 h-3 bg-purple-500 border border-white rounded-full cursor-ne-resize" />
                                            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-purple-500 border border-white rounded-full cursor-sw-resize" />
                                            <div className="absolute -bottom-1 right-0 w-3 h-3 bg-purple-500 border border-white rounded-full cursor-se-resize" />

                                            {/* Rotation Handle */}
                                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-purple-500 border border-white rounded-full cursor-grab flex items-center justify-center">
                                                <RotateCw className="h-3 w-3 text-white" />
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Scene Manager */}
                    <div className="h-32 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-700">
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-md flex items-center justify-center">
                                    <Scissors className="h-3 w-3 text-white" />
                                </div>
                                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">Scene Manager</h3>
                                <Badge variant="outline" className="text-xs">
                                    {scenes.length} scenes
                                </Badge>
                            </div>
                            <Button size="sm" onClick={addScene} className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Scene
                            </Button>
                        </div>

                        <div className="flex items-center gap-3 p-3 h-full overflow-x-auto">
                            {scenes.map((scene, index) => (
                                <div
                                    key={scene.id}
                                    draggable
                                    onDragStart={(e) => handleSceneDragStart(e, index)}
                                    onDragOver={handleSceneDragOver}
                                    onDrop={(e) => handleSceneDrop(e, index)}
                                    onDragEnd={handleSceneDragEnd}
                                    className={`group relative flex-shrink-0 w-32 bg-white dark:bg-slate-700 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-lg ${index === currentSceneIndex
                                        ? 'border-blue-500 shadow-lg shadow-blue-500/25'
                                        : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                                        } ${draggedSceneIndex === index ? 'opacity-50 scale-95' : ''}`}
                                    onClick={() => setCurrentSceneIndex(index)}
                                >
                                    <div className="relative h-16 bg-slate-100 dark:bg-slate-600 rounded-t-xl overflow-hidden">
                                        <div
                                            className="w-full h-full"
                                            style={{ background: scene.background }}
                                        >
                                            {scene.elements.slice(0, 3).map((element, elIndex) => (
                                                <div
                                                    key={element.id}
                                                    className="absolute bg-blue-500/50 rounded-sm"
                                                    style={{
                                                        left: `${(element.x / canvasSize.width) * 100}%`,
                                                        top: `${(element.y / canvasSize.height) * 100}%`,
                                                        width: `${(element.width / canvasSize.width) * 100}%`,
                                                        height: `${(element.height / canvasSize.height) * 100}%`
                                                    }}
                                                />
                                            ))}
                                        </div>
                                        <div className="absolute top-1 left-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                                            {index + 1}
                                        </div>
                                        {index === currentSceneIndex && (
                                            <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full border border-white"></div>
                                        )}
                                    </div>
                                    <div className="p-2 space-y-1">
                                        <div className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate">
                                            {scene.name}
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                                {scene.duration}s
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Properties Panel */}
                <div className="w-80 bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 flex flex-col">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Properties</h3>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-6">
                        {/* Canvas Settings */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Settings className="h-4 w-4 text-slate-500" />
                                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Canvas Settings
                                </Label>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <Label className="text-xs text-slate-600 dark:text-slate-400">Size</Label>
                                    <Select
                                        value={`${canvasSize.width}x${canvasSize.height}`}
                                        onValueChange={(value) => {
                                            const preset = canvasPresets.find(p => `${p.width}x${p.height}` === value);
                                            if (preset) {
                                                setCanvasSize({ width: preset.width, height: preset.height });
                                            }
                                        }}
                                    >
                                        <SelectTrigger className="h-8">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {canvasPresets.map((preset) => (
                                                <SelectItem key={`${preset.width}x${preset.height}`} value={`${preset.width}x${preset.height}`}>
                                                    {preset.name} ({preset.width}×{preset.height})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label className="text-xs text-slate-600 dark:text-slate-400">Background</Label>
                                    <div className="grid grid-cols-6 gap-2 mt-2">
                                        {themeColors.slice(0, 12).map((color) => (
                                            <button
                                                key={color}
                                                className="w-8 h-8 rounded border-2 border-slate-200 dark:border-slate-600 hover:scale-110 transition-transform"
                                                style={{ backgroundColor: color }}
                                                onClick={() => updateScene(currentSceneIndex, { background: color })}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Element Properties */}
                        {selectedElementData && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Layers className="h-4 w-4 text-slate-500" />
                                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Element Properties
                                    </Label>
                                </div>

                                <div className="space-y-3">
                                    {selectedElementData.type === 'text' && (
                                        <>
                                            <div>
                                                <Label className="text-xs text-slate-600 dark:text-slate-400">Text</Label>
                                                <Input
                                                    value={selectedElementData.text || ''}
                                                    onChange={(e) => updateElement(selectedElementData.id, { text: e.target.value })}
                                                    className="h-8"
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-xs text-slate-600 dark:text-slate-400">Font Size</Label>
                                                <Slider
                                                    value={[selectedElementData.fontSize || 24]}
                                                    onValueChange={(value) => updateElement(selectedElementData.id, { fontSize: value[0] })}
                                                    max={100}
                                                    min={8}
                                                    step={1}
                                                    className="mt-2"
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-xs text-slate-600 dark:text-slate-400">Color</Label>
                                                <div className="grid grid-cols-6 gap-2 mt-2">
                                                    {themeColors.map((color) => (
                                                        <button
                                                            key={color}
                                                            className="w-6 h-6 rounded border border-slate-200 dark:border-slate-600 hover:scale-110 transition-transform"
                                                            style={{ backgroundColor: color }}
                                                            onClick={() => updateElement(selectedElementData.id, { color })}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    <div>
                                        <Label className="text-xs text-slate-600 dark:text-slate-400">Opacity</Label>
                                        <Slider
                                            value={[selectedElementData.opacity * 100]}
                                            onValueChange={(value) => updateElement(selectedElementData.id, { opacity: value[0] / 100 })}
                                            max={100}
                                            min={0}
                                            step={1}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div>
                                        <Label className="text-xs text-slate-600 dark:text-slate-400">Rotation</Label>
                                        <Slider
                                            value={[selectedElementData.rotation]}
                                            onValueChange={(value) => updateElement(selectedElementData.id, { rotation: value[0] })}
                                            max={360}
                                            min={0}
                                            step={1}
                                            className="mt-2"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tool Options */}
                        {selectedTool === 'text' && (
                            <div className="space-y-4">
                                <Button
                                    onClick={() => addElement('text')}
                                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                                >
                                    <Type className="h-4 w-4 mr-2" />
                                    Add Text
                                </Button>
                            </div>
                        )}

                        {selectedTool === 'image' && (
                            <div className="space-y-4">
                                <Button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                                >
                                    <ImageIcon className="h-4 w-4 mr-2" />
                                    Upload Image
                                </Button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                            </div>
                        )}

                        {selectedTool === 'shape' && (
                            <div className="space-y-4">
                                <Label className="text-xs text-slate-600 dark:text-slate-400">Shapes</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {shapes.map((shape) => (
                                        <Button
                                            key={shape.id}
                                            variant="outline"
                                            size="sm"
                                            onClick={() => addElement('shape', { shapeType: shape.id })}
                                            className="flex flex-col items-center gap-1 h-16"
                                        >
                                            <shape.icon className="h-4 w-4" />
                                            <span className="text-xs">{shape.name}</span>
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {selectedTool === 'sticker' && (
                            <div className="space-y-4">
                                <Button
                                    onClick={() => addElement('sticker')}
                                    className="w-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700"
                                >
                                    <Sticker className="h-4 w-4 mr-2" />
                                    Add Sticker
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
