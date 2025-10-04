import React, { useState, useRef, useEffect, useCallback } from 'react';
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
    FlipVertical
} from 'lucide-react';

interface CanvaEditorProps {
    initialData?: object;
    onSave?: (data: object) => void;
    onCancel?: () => void;
    mode?: 'create' | 'edit';
}

interface Scene {
    id: string;
    name: string;
    duration: number; // seconds
    elements: CanvasElement[];
    background: string;
    transition: string;
}

interface CanvasElement {
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
    zIndex: number;
    // Text specific
    text?: string;
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: string;
    color?: string;
    align?: 'left' | 'center' | 'right' | 'justify';
    // Image/Video specific
    src?: string;
    // Shape specific
    shapeType?: 'rectangle' | 'circle' | 'triangle' | 'star';
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    // Audio specific
    autoplay?: boolean;
    loop?: boolean;
}

const canvasPresets = [
    { name: 'Status (1080×1920)', width: 1080, height: 1920 },
    { name: 'Square (1080×1080)', width: 1080, height: 1080 },
    { name: 'Story (1080×1920)', width: 1080, height: 1920 },
    { name: 'Post (1080×1080)', width: 1080, height: 1080 },
    { name: 'Custom', width: 800, height: 600 }
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

const transitions = [
    'None', 'Fade', 'Slide Left', 'Slide Right', 'Slide Up', 'Slide Down',
    'Zoom In', 'Zoom Out', 'Rotate', 'Flip', 'Dissolve'
];

export default function CanvaEditor({
    initialData = null,
    onSave,
    onCancel,
    mode = 'create'
}: CanvaEditorProps) {
    const canvasRef = useRef<HTMLDivElement>(null);
    const [selectedTool, setSelectedTool] = useState('select');
    const [selectedElement, setSelectedElement] = useState<string | null>(null);
    const [scenes, setScenes] = useState<Scene[]>([]);
    const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
    const [canvasSize, setCanvasSize] = useState({ width: 1080, height: 1920 });
    const [zoom, setZoom] = useState(1);
    const [showGrid, setShowGrid] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [resizeHandle, setResizeHandle] = useState<string | null>(null);
    const [draggedSceneIndex, setDraggedSceneIndex] = useState<number | null>(null);
    const [editingSceneName, setEditingSceneName] = useState<number | null>(null);

    // Initialize with default scene
    useEffect(() => {
        if (scenes.length === 0) {
            const defaultScene: Scene = {
                id: 'scene-1',
                name: 'Scene 1',
                duration: 3,
                elements: [],
                background: '#ffffff',
                transition: 'Fade'
            };
            setScenes([defaultScene]);
        }
    }, [scenes.length]);

    const currentScene = scenes[currentSceneIndex];

    const addElement = (type: CanvasElement['type']) => {
        const newElement: CanvasElement = {
            id: `element-${Date.now()}`,
            type,
            x: canvasSize.width / 2 - 50,
            y: canvasSize.height / 2 - 50,
            width: type === 'text' ? 200 : 100,
            height: type === 'text' ? 50 : 100,
            rotation: 0,
            opacity: 1,
            visible: true,
            locked: false,
            zIndex: currentScene.elements.length,
            ...(type === 'text' && {
                text: 'Sample Text',
                fontSize: 24,
                fontFamily: 'Arial',
                fontWeight: 'normal',
                color: '#000000',
                align: 'left'
            }),
            ...(type === 'shape' && {
                shapeType: 'rectangle',
                fill: '#3b82f6',
                stroke: '#1e40af',
                strokeWidth: 2
            })
        };

        updateScene(currentSceneIndex, {
            elements: [...currentScene.elements, newElement]
        });
    };

    const updateScene = (sceneIndex: number, updates: Partial<Scene>) => {
        setScenes(prev => prev.map((scene, index) =>
            index === sceneIndex ? { ...scene, ...updates } : scene
        ));
    };

    const updateElement = (elementId: string, updates: Partial<CanvasElement>) => {
        const sceneIndex = currentSceneIndex;
        const updatedElements = currentScene.elements.map(el =>
            el.id === elementId ? { ...el, ...updates } : el
        );
        updateScene(sceneIndex, { elements: updatedElements });
    };

    const deleteElement = (elementId: string) => {
        const updatedElements = currentScene.elements.filter(el => el.id !== elementId);
        updateScene(currentSceneIndex, { elements: updatedElements });
        setSelectedElement(null);
    };

    const addScene = () => {
        const newScene: Scene = {
            id: `scene-${scenes.length + 1}`,
            name: `Scene ${scenes.length + 1}`,
            duration: 3,
            elements: [],
            background: '#ffffff',
            transition: 'Fade'
        };
        setScenes(prev => [...prev, newScene]);
        setCurrentSceneIndex(scenes.length);
    };

    const duplicateScene = (sceneIndex: number) => {
        const sceneToDuplicate = scenes[sceneIndex];
        const newScene: Scene = {
            ...sceneToDuplicate,
            id: `scene-${Date.now()}`,
            name: `${sceneToDuplicate.name} Copy`,
            elements: sceneToDuplicate.elements.map(el => ({
                ...el,
                id: `element-${Date.now()}-${Math.random()}`
            }))
        };
        setScenes(prev => [...prev, newScene]);
    };

    const deleteScene = (sceneIndex: number) => {
        if (scenes.length > 1) {
            setScenes(prev => prev.filter((_, index) => index !== sceneIndex));
            if (currentSceneIndex >= sceneIndex && currentSceneIndex > 0) {
                setCurrentSceneIndex(currentSceneIndex - 1);
            }
        }
    };

    const getSelectedElement = () => {
        return currentScene?.elements.find(el => el.id === selectedElement);
    };

    // Drag and drop handlers
    const handleMouseDown = useCallback((e: React.MouseEvent, elementId: string) => {
        if (selectedTool !== 'select') return;

        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        setSelectedElement(elementId);
        setIsDragging(true);
        setDragStart({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    }, [selectedTool]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!isDragging || !selectedElement) return;

        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        const deltaX = e.clientX - rect.left - dragStart.x;
        const deltaY = e.clientY - rect.top - dragStart.y;

        const element = getSelectedElement();
        if (element) {
            updateElement(selectedElement, {
                x: Math.max(0, Math.min(canvasSize.width - element.width, element.x + deltaX)),
                y: Math.max(0, Math.min(canvasSize.height - element.height, element.y + deltaY))
            });
        }

        setDragStart({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    }, [isDragging, selectedElement, dragStart, canvasSize, getSelectedElement]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
        setResizeHandle(null);
    }, []);

    // Zoom handlers
    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 3));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));
    const handleZoomReset = () => setZoom(1);
    const handleFitToScreen = () => setZoom(1);

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

        // Remove dragged scene
        newScenes.splice(draggedSceneIndex, 1);

        // Insert at new position
        newScenes.splice(targetIndex, 0, draggedScene);

        setScenes(newScenes);

        // Update current scene index if needed
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

    // Scene name editing handlers
    const handleSceneNameEdit = (sceneIndex: number) => {
        setEditingSceneName(sceneIndex);
    };

    const handleSceneNameSave = (sceneIndex: number, newName: string) => {
        if (newName.trim()) {
            updateScene(sceneIndex, { name: newName.trim() });
        }
        setEditingSceneName(null);
    };

    const handleSceneNameCancel = () => {
        setEditingSceneName(null);
    };

    // Scene preview handlers
    const handleScenePreview = (sceneIndex: number) => {
        // Switch to scene and play preview
        setCurrentSceneIndex(sceneIndex);
        setIsPlaying(true);

        // Auto-stop after scene duration
        setTimeout(() => {
            setIsPlaying(false);
        }, (scenes[sceneIndex]?.duration || 3) * 1000);
    };

    // Canvas size handlers
    const handleCanvasSizeChange = (preset: typeof canvasPresets[0]) => {
        if (preset.name === 'Custom') {
            // Keep current size for custom
            return;
        }
        setCanvasSize({ width: preset.width, height: preset.height });
    };

    // Preview handlers
    const handlePreview = () => {
        setIsPlaying(!isPlaying);
        // TODO: Implement actual preview with all scenes
    };

    const handleSave = () => {
        const templateData = {
            scenes,
            canvasSize,
            version: '1.0',
            createdAt: new Date().toISOString()
        };
        onSave?.(templateData);
    };

    const handleExportJSON = () => {
        const templateData = {
            scenes,
            canvasSize,
            version: '1.0',
            exportedAt: new Date().toISOString()
        };
        const blob = new Blob([JSON.stringify(templateData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `template-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between p-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <Sparkles className="h-4 w-4 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Canva Editor</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {mode === 'create' ? 'Creating New Template' : 'Editing Template'}
                            </p>
                        </div>
                    </div>
                    <Badge variant="outline" className="ml-2">
                        Scene {currentSceneIndex + 1} of {scenes.length}
                    </Badge>
                </div>

                <div className="flex items-center gap-2">
                    {/* Undo/Redo */}
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="h-6 w-px bg-slate-300 dark:bg-slate-600"></div>

                    {/* Zoom Controls */}
                    <div className="flex items-center gap-1 bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 px-2">
                        <Button variant="ghost" size="sm" onClick={handleZoomOut} className="h-8 w-8 p-0">
                            <ZoomOut className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-medium px-2 min-w-[3rem] text-center">
                            {Math.round(zoom * 100)}%
                        </span>
                        <Button variant="ghost" size="sm" onClick={handleZoomIn} className="h-8 w-8 p-0">
                            <ZoomIn className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={handleFitToScreen} className="h-8 w-8 p-0 text-xs">
                            Fit
                        </Button>
                    </div>

                    <div className="h-6 w-px bg-slate-300 dark:bg-slate-600"></div>

                    {/* Action Buttons */}
                    <Button variant="outline" size="sm" onClick={handlePreview} className={isPlaying ? "bg-red-500 text-white hover:bg-red-600" : ""}>
                        <Play className="h-4 w-4 mr-2" />
                        {isPlaying ? 'Stop' : 'Preview'}
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleExportJSON}>
                        <Download className="h-4 w-4 mr-2" />
                        Export JSON
                    </Button>
                    <Button variant="outline" size="sm" onClick={onCancel}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                    </Button>
                    <Button size="sm" onClick={handleSave} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                        <Save className="h-4 w-4 mr-2" />
                        Save
                    </Button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Left Sidebar - Tools */}
                <div className="w-64 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-r border-slate-200 dark:border-slate-700 flex flex-col">
                    {/* Tools */}
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Tools</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {tools.map((tool) => {
                                const Icon = tool.icon;
                                return (
                                    <Button
                                        key={tool.id}
                                        variant={selectedTool === tool.id ? "default" : "outline"}
                                        size="sm"
                                        className={`h-auto p-3 flex flex-col items-center gap-1 ${selectedTool === tool.id
                                            ? 'bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                                            : 'hover:bg-slate-50 dark:hover:bg-slate-700'
                                            }`}
                                        onClick={() => {
                                            if (tool.id === 'select') {
                                                setSelectedTool('select');
                                            } else {
                                                addElement(tool.id as CanvasElement['type']);
                                                setSelectedTool('select');
                                            }
                                        }}
                                        title={tool.description}
                                    >
                                        <Icon className="h-4 w-4" />
                                        <span className="text-xs">{tool.name}</span>
                                    </Button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Assets Library */}
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Assets</h3>
                        <div className="space-y-2">
                            <Button variant="outline" size="sm" className="w-full justify-start">
                                <ImageIcon className="h-4 w-4 mr-2" />
                                Upload Image
                            </Button>
                            <Button variant="outline" size="sm" className="w-full justify-start">
                                <Video className="h-4 w-4 mr-2" />
                                Upload Video
                            </Button>
                            <Button variant="outline" size="sm" className="w-full justify-start">
                                <Music className="h-4 w-4 mr-2" />
                                Upload Audio
                            </Button>
                            <Button variant="outline" size="sm" className="w-full justify-start">
                                <Sticker className="h-4 w-4 mr-2" />
                                Stickers
                            </Button>
                        </div>
                    </div>

                    {/* Effects */}
                    <div className="p-4 flex-1">
                        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Effects</h3>
                        <div className="space-y-2">
                            <Button variant="outline" size="sm" className="w-full justify-start">
                                <Filter className="h-4 w-4 mr-2" />
                                Filters
                            </Button>
                            <Button variant="outline" size="sm" className="w-full justify-start">
                                <Sparkles className="h-4 w-4 mr-2" />
                                Animations
                            </Button>
                            <Button variant="outline" size="sm" className="w-full justify-start">
                                <RotateCw className="h-4 w-4 mr-2" />
                                Transitions
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Center Area - Canvas */}
                <div className="flex-1 flex flex-col">
                    {/* Canvas Header */}
                    <div className="flex items-center justify-between p-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                                <Grid3X3 className="h-4 w-4 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-lg text-slate-900 dark:text-slate-100">
                                    {currentScene?.name || 'Scene 1'}
                                </CardTitle>
                                <CardDescription className="text-slate-500 dark:text-slate-400">
                                    {canvasSize.width} × {canvasSize.height}px • {currentScene?.duration}s
                                </CardDescription>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant={showGrid ? "default" : "outline"}
                                size="sm"
                                onClick={() => setShowGrid(!showGrid)}
                                className={showGrid ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700" : ""}
                            >
                                {showGrid ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
                                Grid
                            </Button>
                        </div>
                    </div>

                    {/* Canvas */}
                    <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 p-8 overflow-auto">
                        <Card className="shadow-2xl border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
                            <CardContent className="p-6">
                                <div
                                    ref={canvasRef}
                                    className="relative bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-600 rounded-xl overflow-hidden shadow-inner transition-all duration-300 hover:shadow-xl select-none"
                                    style={{
                                        width: canvasSize.width * zoom,
                                        height: canvasSize.height * zoom,
                                        background: currentScene?.background || '#ffffff',
                                        backgroundImage: showGrid ? `
                                            linear-gradient(to right, #e2e8f0 1px, transparent 1px),
                                            linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
                                        ` : 'none',
                                        backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
                                        transform: `scale(${zoom})`,
                                        transformOrigin: 'top left'
                                    }}
                                    onMouseMove={handleMouseMove}
                                    onMouseUp={handleMouseUp}
                                    onMouseLeave={handleMouseUp}
                                >
                                    {currentScene?.elements.map((element) => (
                                        <div
                                            key={element.id}
                                            className={`absolute border-2 transition-all duration-200 cursor-move group ${selectedElement === element.id
                                                ? 'border-blue-500 shadow-lg shadow-blue-500/25'
                                                : 'border-transparent hover:border-slate-400 hover:shadow-md'
                                                } ${!element.visible ? 'opacity-50' : ''}`}
                                            style={{
                                                left: element.x,
                                                top: element.y,
                                                width: element.width,
                                                height: element.height,
                                                transform: `rotate(${element.rotation}deg)`,
                                                opacity: element.opacity,
                                                zIndex: element.zIndex
                                            }}
                                            onMouseDown={(e) => handleMouseDown(e, element.id)}
                                            onClick={() => setSelectedElement(element.id)}
                                        >
                                            {/* Resize handles for selected element */}
                                            {selectedElement === element.id && (
                                                <>
                                                    <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-nw-resize"></div>
                                                    <div className="absolute -top-1 left-1/2 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-n-resize transform -translate-x-1/2"></div>
                                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-ne-resize"></div>
                                                    <div className="absolute -right-1 top-1/2 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-e-resize transform -translate-y-1/2"></div>
                                                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-se-resize"></div>
                                                    <div className="absolute -bottom-1 left-1/2 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-s-resize transform -translate-x-1/2"></div>
                                                    <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-sw-resize"></div>
                                                    <div className="absolute -left-1 top-1/2 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-w-resize transform -translate-y-1/2"></div>
                                                </>
                                            )}

                                            {/* Drag handle */}
                                            {selectedElement === element.id && (
                                                <div className="absolute -top-6 left-0 bg-blue-500 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                                                    <GripVertical className="h-3 w-3" />
                                                    {element.type}
                                                </div>
                                            )}

                                            {/* Element content */}
                                            {element.type === 'text' && (
                                                <div
                                                    className="w-full h-full flex items-center justify-center p-2"
                                                    style={{
                                                        fontSize: element.fontSize,
                                                        fontFamily: element.fontFamily,
                                                        fontWeight: element.fontWeight,
                                                        color: element.color,
                                                        textAlign: element.align as any
                                                    }}
                                                >
                                                    {element.text}
                                                </div>
                                            )}

                                            {element.type === 'image' && (
                                                <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded">
                                                    <ImageIcon className="h-8 w-8 text-slate-400" />
                                                </div>
                                            )}

                                            {element.type === 'shape' && (
                                                <div
                                                    className="w-full h-full border-2 rounded"
                                                    style={{
                                                        backgroundColor: element.fill,
                                                        borderColor: element.stroke,
                                                        borderWidth: element.strokeWidth
                                                    }}
                                                />
                                            )}

                                            {element.type === 'video' && (
                                                <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded">
                                                    <Video className="h-8 w-8 text-slate-400" />
                                                </div>
                                            )}

                                            {element.type === 'audio' && (
                                                <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded">
                                                    <Music className="h-8 w-8 text-slate-400" />
                                                </div>
                                            )}

                                            {element.type === 'sticker' && (
                                                <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded">
                                                    <Sticker className="h-8 w-8 text-slate-400" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Right Sidebar - Properties */}
                <div className="w-80 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-l border-slate-200 dark:border-slate-700 flex flex-col">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-gradient-to-br from-violet-500 to-purple-600 rounded-md flex items-center justify-center">
                                <Settings className="h-3 w-3 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Properties</h3>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-6">
                        {/* Canvas Settings */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Grid3X3 className="h-4 w-4 text-slate-500" />
                                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Canvas Settings
                                </Label>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 space-y-3">
                                <div>
                                    <Label className="text-xs text-slate-500 dark:text-slate-400 mb-2 block">Size Preset</Label>
                                    <Select value={canvasPresets.find(p => p.width === canvasSize.width && p.height === canvasSize.height)?.name || 'Custom'} onValueChange={(value) => {
                                        const preset = canvasPresets.find(p => p.name === value);
                                        if (preset) handleCanvasSizeChange(preset);
                                    }}>
                                        <SelectTrigger className="text-sm">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {canvasPresets.map((preset) => (
                                                <SelectItem key={preset.name} value={preset.name}>
                                                    {preset.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <Label className="text-xs text-slate-500 dark:text-slate-400">Width</Label>
                                        <Input
                                            type="number"
                                            value={canvasSize.width}
                                            onChange={(e) => setCanvasSize({ ...canvasSize, width: parseInt(e.target.value) || 800 })}
                                            className="text-sm"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs text-slate-500 dark:text-slate-400">Height</Label>
                                        <Input
                                            type="number"
                                            value={canvasSize.height}
                                            onChange={(e) => setCanvasSize({ ...canvasSize, height: parseInt(e.target.value) || 600 })}
                                            className="text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Scene Settings */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-slate-500" />
                                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Scene Settings
                                </Label>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 space-y-3">
                                <div>
                                    <Label className="text-xs text-slate-500 dark:text-slate-400 mb-2 block">Duration (seconds)</Label>
                                    <Input
                                        type="number"
                                        value={currentScene?.duration || 3}
                                        onChange={(e) => updateScene(currentSceneIndex, { duration: parseInt(e.target.value) || 3 })}
                                        className="text-sm"
                                        min="1"
                                        max="60"
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs text-slate-500 dark:text-slate-400 mb-2 block">Transition</Label>
                                    <Select value={currentScene?.transition || 'Fade'} onValueChange={(value) => updateScene(currentSceneIndex, { transition: value })}>
                                        <SelectTrigger className="text-sm">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {transitions.map((transition) => (
                                                <SelectItem key={transition} value={transition}>
                                                    {transition}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Background Settings */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Palette className="h-4 w-4 text-slate-500" />
                                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Background
                                </Label>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 space-y-3">
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <Label className="text-xs text-slate-500 dark:text-slate-400 mb-2 block">Color</Label>
                                        <Input
                                            type="color"
                                            value={currentScene?.background || '#ffffff'}
                                            onChange={(e) => updateScene(currentSceneIndex, { background: e.target.value })}
                                            className="w-full h-10"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs text-slate-500 dark:text-slate-400 mb-2 block">Hex</Label>
                                        <Input
                                            type="text"
                                            value={currentScene?.background || '#ffffff'}
                                            onChange={(e) => updateScene(currentSceneIndex, { background: e.target.value })}
                                            className="text-sm"
                                            placeholder="#ffffff"
                                        />
                                    </div>
                                </div>
                                {/* Preset Colors */}
                                <div>
                                    <Label className="text-xs text-slate-500 dark:text-slate-400 mb-2 block">Presets</Label>
                                    <div className="flex gap-1 flex-wrap">
                                        {['#ffffff', '#000000', '#f3f4f6', '#1f2937', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'].map((color) => (
                                            <button
                                                key={color}
                                                onClick={() => updateScene(currentSceneIndex, { background: color })}
                                                className={`w-6 h-6 rounded border-2 ${currentScene?.background === color ? 'border-blue-500' : 'border-slate-200 dark:border-slate-600'}`}
                                                style={{ backgroundColor: color }}
                                                title={color}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Element Properties */}
                        {selectedElement && getSelectedElement() && (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Layers className="h-4 w-4 text-slate-500" />
                                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Element Properties
                                    </Label>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Element Actions</span>
                                        <div className="flex gap-1">
                                            <Button variant="ghost" size="sm" onClick={() => deleteElement(selectedElement)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm">
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <Label className="text-xs text-slate-500 dark:text-slate-400">X Position</Label>
                                            <Input
                                                type="number"
                                                value={getSelectedElement()?.x || 0}
                                                onChange={(e) => updateElement(selectedElement, { x: parseInt(e.target.value) || 0 })}
                                                className="text-sm"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs text-slate-500 dark:text-slate-400">Y Position</Label>
                                            <Input
                                                type="number"
                                                value={getSelectedElement()?.y || 0}
                                                onChange={(e) => updateElement(selectedElement, { y: parseInt(e.target.value) || 0 })}
                                                className="text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <Label className="text-xs text-slate-500 dark:text-slate-400">Width</Label>
                                            <Input
                                                type="number"
                                                value={getSelectedElement()?.width || 100}
                                                onChange={(e) => updateElement(selectedElement, { width: parseInt(e.target.value) || 100 })}
                                                className="text-sm"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs text-slate-500 dark:text-slate-400">Height</Label>
                                            <Input
                                                type="number"
                                                value={getSelectedElement()?.height || 100}
                                                onChange={(e) => updateElement(selectedElement, { height: parseInt(e.target.value) || 100 })}
                                                className="text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="text-xs text-slate-500 dark:text-slate-400 mb-2 block">Opacity</Label>
                                        <Slider
                                            value={[getSelectedElement()?.opacity || 1]}
                                            onValueChange={([value]) => updateElement(selectedElement, { opacity: value })}
                                            max={1}
                                            min={0}
                                            step={0.1}
                                            className="w-full"
                                        />
                                    </div>

                                    <div>
                                        <Label className="text-xs text-slate-500 dark:text-slate-400 mb-2 block">Rotation</Label>
                                        <Input
                                            type="number"
                                            value={getSelectedElement()?.rotation || 0}
                                            onChange={(e) => updateElement(selectedElement, { rotation: parseInt(e.target.value) || 0 })}
                                            className="text-sm"
                                            min="-360"
                                            max="360"
                                        />
                                    </div>

                                    {/* Text-specific properties */}
                                    {getSelectedElement()?.type === 'text' && (
                                        <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-600">
                                            <div>
                                                <Label className="text-xs text-slate-500 dark:text-slate-400 mb-2 block">Text Content</Label>
                                                <Input
                                                    value={getSelectedElement()?.text || ''}
                                                    onChange={(e) => updateElement(selectedElement, { text: e.target.value })}
                                                    className="text-sm"
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-xs text-slate-500 dark:text-slate-400 mb-2 block">Font Size</Label>
                                                <Input
                                                    type="number"
                                                    value={getSelectedElement()?.fontSize || 24}
                                                    onChange={(e) => updateElement(selectedElement, { fontSize: parseInt(e.target.value) || 24 })}
                                                    className="text-sm"
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-xs text-slate-500 dark:text-slate-400 mb-2 block">Text Color</Label>
                                                <Input
                                                    type="color"
                                                    value={getSelectedElement()?.color || '#000000'}
                                                    onChange={(e) => updateElement(selectedElement, { color: e.target.value })}
                                                    className="w-full h-10"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Enhanced Scene Manager - Canva Style */}
            <div className="h-32 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-t border-slate-200 dark:border-slate-700">
                {/* Scene Manager Header */}
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

                {/* Scene Timeline */}
                <div className="flex items-center gap-3 p-3 h-full overflow-x-auto relative">
                    {/* Drop indicator */}
                    {draggedSceneIndex !== null && (
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-500 z-10 pointer-events-none"></div>
                    )}
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
                            {/* Scene Thumbnail Preview */}
                            <div className="relative h-16 bg-slate-100 dark:bg-slate-600 rounded-t-xl overflow-hidden">
                                <div
                                    className="w-full h-full"
                                    style={{
                                        background: scene.background,
                                        backgroundImage: `
                                            linear-gradient(to right, #e2e8f0 1px, transparent 1px),
                                            linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
                                        `,
                                        backgroundSize: '4px 4px'
                                    }}
                                >
                                    {/* Mini preview of elements */}
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
                                    {scene.elements.length > 3 && (
                                        <div className="absolute bottom-1 right-1 bg-black/50 text-white text-xs px-1 rounded">
                                            +{scene.elements.length - 3}
                                        </div>
                                    )}
                                </div>

                                {/* Scene Number Badge */}
                                <div className="absolute top-1 left-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                                    {index + 1}
                                </div>

                                {/* Preview Play Button */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-6 w-6 p-0 bg-white/90 hover:bg-white"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleScenePreview(index);
                                        }}
                                    >
                                        <Play className="h-3 w-3 text-slate-700" />
                                    </Button>
                                </div>

                                {/* Active Scene Indicator */}
                                {index === currentSceneIndex && (
                                    <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full border border-white"></div>
                                )}
                            </div>

                            {/* Scene Info */}
                            <div className="p-2 space-y-1">
                                {editingSceneName === index ? (
                                    <Input
                                        type="text"
                                        defaultValue={scene.name}
                                        className="text-xs h-6 p-1"
                                        autoFocus
                                        onBlur={(e) => handleSceneNameSave(index, e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleSceneNameSave(index, e.currentTarget.value);
                                            } else if (e.key === 'Escape') {
                                                handleSceneNameCancel();
                                            }
                                        }}
                                    />
                                ) : (
                                    <div
                                        className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 px-1 py-0.5 rounded"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleSceneNameEdit(index);
                                        }}
                                        title="Click to edit scene name"
                                    >
                                        {scene.name}
                                    </div>
                                )}
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                                        {scene.duration}s
                                    </span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                                        {scene.transition}
                                    </span>
                                </div>
                            </div>

                            {/* Scene Actions */}
                            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col gap-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 bg-white/90 hover:bg-white shadow-sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        duplicateScene(index);
                                    }}
                                    title="Duplicate Scene"
                                >
                                    <Copy className="h-3 w-3 text-slate-700" />
                                </Button>
                                {scenes.length > 1 && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0 bg-red-500/90 hover:bg-red-500 text-white shadow-sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteScene(index);
                                        }}
                                        title="Delete Scene"
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                )}
                            </div>

                            {/* Drag Handle */}
                            <div className="absolute bottom-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <div className="w-4 h-4 flex items-center justify-center cursor-move">
                                    <GripVertical className="h-3 w-3 text-slate-400" />
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Add Scene Button at End */}
                    <div
                        className="flex-shrink-0 w-32 h-24 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl flex items-center justify-center cursor-pointer hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-200"
                        onClick={addScene}
                    >
                        <div className="text-center">
                            <div className="w-8 h-8 bg-slate-200 dark:bg-slate-600 rounded-full flex items-center justify-center mx-auto mb-1">
                                <Plus className="h-4 w-4 text-slate-500" />
                            </div>
                            <span className="text-xs text-slate-500 dark:text-slate-400">Add Scene</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
