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
    GripVertical
} from 'lucide-react';

interface PolotnoEditorProps {
    initialData?: object;
    onSave?: (data: object) => void;
    onCancel?: () => void;
    mode?: 'create' | 'edit';
}

interface CanvasElement {
    id: string;
    type: 'text' | 'image' | 'audio' | 'shape' | 'sticker';
    x: number;
    y: number;
    width: number;
    height: number;
    text?: string;
    fontSize?: number;
    fontFamily?: string;
    fill?: string;
    src?: string;
    visible: boolean;
    locked: boolean;
}

export default function PolotnoEditor({
    initialData = null,
    onSave,
    onCancel,
    mode = 'create'
}: PolotnoEditorProps) {
    const canvasRef = useRef<HTMLDivElement>(null);
    const [selectedTool, setSelectedTool] = useState('select');
    const [selectedElement, setSelectedElement] = useState<string | null>(null);
    const [elements, setElements] = useState<CanvasElement[]>([]);
    const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
    const [background, setBackground] = useState('#ffffff');
    const [isPlaying, setIsPlaying] = useState(false);
    const [showGrid, setShowGrid] = useState(true);
    const [zoom, setZoom] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [resizeHandle, setResizeHandle] = useState<string | null>(null);
    const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });

    // Initialize with sample data if in create mode
    useEffect(() => {
        if (mode === 'create' && elements.length === 0) {
            const sampleElements: CanvasElement[] = [
                {
                    id: 'text-1',
                    type: 'text',
                    x: 100,
                    y: 100,
                    width: 300,
                    height: 60,
                    text: 'Sample Text',
                    fontSize: 32,
                    fontFamily: 'Arial',
                    fill: '#000000',
                    visible: true,
                    locked: false
                }
            ];
            setElements(sampleElements);
        }
    }, [mode, elements.length]);

    const tools = [
        { id: 'select', icon: Move, label: 'Select', description: 'Select and move elements' },
        { id: 'text', icon: Type, label: 'Text', description: 'Add text elements' },
        { id: 'image', icon: ImageIcon, label: 'Image', description: 'Add images and photos' },
        { id: 'audio', icon: Music, label: 'Audio', description: 'Add audio and music' },
        { id: 'shapes', icon: Shapes, label: 'Shapes', description: 'Add geometric shapes' },
        { id: 'sticker', icon: Sticker, label: 'Stickers', description: 'Add decorative stickers' }
    ];

    const handleSave = () => {
        const templateData = {
            version: "5.3.0",
            objects: elements.map(element => ({
                id: element.id,
                type: element.type,
                x: element.x,
                y: element.y,
                width: element.width,
                height: element.height,
                text: element.text,
                fontSize: element.fontSize,
                fontFamily: element.fontFamily,
                fill: element.fill,
                src: element.src,
                visible: element.visible,
                locked: element.locked
            })),
            background: {
                type: "color",
                color: background
            },
            canvas: {
                width: canvasSize.width,
                height: canvasSize.height
            }
        };

        if (onSave) {
            onSave(templateData);
        }
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        }
    };

    const handleExportJSON = () => {
        const templateData = {
            version: "5.3.0",
            objects: elements.map(element => ({
                id: element.id,
                type: element.type,
                x: element.x,
                y: element.y,
                width: element.width,
                height: element.height,
                text: element.text,
                fontSize: element.fontSize,
                fontFamily: element.fontFamily,
                fill: element.fill,
                src: element.src,
                visible: element.visible,
                locked: element.locked
            })),
            background: {
                type: "color",
                color: background
            },
            canvas: {
                width: canvasSize.width,
                height: canvasSize.height
            }
        };

        const dataStr = JSON.stringify(templateData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const exportFileDefaultName = `template-${Date.now()}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    const addElement = (type: CanvasElement['type']) => {
        const newElement: CanvasElement = {
            id: `${type}-${Date.now()}`,
            type,
            x: 50,
            y: 50,
            width: type === 'text' ? 200 : 100,
            height: type === 'text' ? 40 : 100,
            text: type === 'text' ? 'New Text' : undefined,
            fontSize: type === 'text' ? 24 : undefined,
            fontFamily: type === 'text' ? 'Arial' : undefined,
            fill: type === 'text' ? '#000000' : undefined,
            visible: true,
            locked: false
        };

        setElements([...elements, newElement]);
        setSelectedElement(newElement.id);
    };

    const deleteElement = (id: string) => {
        setElements(elements.filter(el => el.id !== id));
        if (selectedElement === id) {
            setSelectedElement(null);
        }
    };

    const duplicateElement = (id: string) => {
        const element = elements.find(el => el.id === id);
        if (element) {
            const newElement = {
                ...element,
                id: `${element.type}-${Date.now()}`,
                x: element.x + 20,
                y: element.y + 20
            };
            setElements([...elements, newElement]);
        }
    };

    const updateElement = (id: string, updates: Partial<CanvasElement>) => {
        setElements(elements.map(el =>
            el.id === id ? { ...el, ...updates } : el
        ));
    };

    const getSelectedElement = () => {
        return elements.find(el => el.id === selectedElement);
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

        updateElement(selectedElement, {
            x: Math.max(0, Math.min(canvasSize.width - 100, elements.find(el => el.id === selectedElement)?.x || 0 + deltaX)),
            y: Math.max(0, Math.min(canvasSize.height - 100, elements.find(el => el.id === selectedElement)?.y || 0 + deltaY))
        });

        setDragStart({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    }, [isDragging, selectedElement, dragStart, canvasSize, elements]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
        setResizeHandle(null);
    }, []);

    // Zoom handlers
    const handleZoomIn = () => {
        setZoom(prev => Math.min(prev + 0.1, 3));
    };

    const handleZoomOut = () => {
        setZoom(prev => Math.max(prev - 0.1, 0.5));
    };

    const handleZoomReset = () => {
        setZoom(1);
    };

    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <Sparkles className="h-4 w-4 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Template Editor</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {mode === 'create' ? 'Creating New Template' : 'Editing Template'}
                            </p>
                        </div>
                    </div>
                    <Badge variant="outline" className="ml-2">
                        {elements.length} Elements
                    </Badge>
                </div>
                <div className="flex items-center gap-2">
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
                        <Button variant="ghost" size="sm" onClick={handleZoomReset} className="h-8 w-8 p-0 text-xs">
                            1:1
                        </Button>
                    </div>

                    <div className="h-6 w-px bg-slate-300 dark:bg-slate-600"></div>

                    <Button variant="outline" size="sm" onClick={handleExportJSON} className="hover:bg-slate-100 dark:hover:bg-slate-700">
                        <Download className="h-4 w-4 mr-2" />
                        Export JSON
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleCancel} className="hover:bg-slate-100 dark:hover:bg-slate-700">
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
                {/* Toolbar */}
                <div className="w-16 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-r border-slate-200 dark:border-slate-700 flex flex-col items-center py-4 gap-3">
                    <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Tools</div>
                    {tools.map((tool) => {
                        const Icon = tool.icon;
                        return (
                            <button
                                key={tool.id}
                                onClick={() => {
                                    if (tool.id === 'select') {
                                        setSelectedTool('select');
                                    } else {
                                        addElement(tool.id as CanvasElement['type']);
                                        setSelectedTool('select');
                                    }
                                }}
                                className={`group relative w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200 ${selectedTool === tool.id
                                    ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg scale-105'
                                    : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 hover:scale-105 hover:shadow-md'
                                    }`}
                                title={tool.description}
                            >
                                <Icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                                {selectedTool === tool.id && (
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white dark:border-slate-800"></div>
                                )}
                            </button>
                        );
                    })}

                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-600 w-full">
                        <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">View</div>
                        <button
                            onClick={() => setShowGrid(!showGrid)}
                            className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200 ${showGrid
                                ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg'
                                : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600'
                                }`}
                            title="Toggle Grid"
                        >
                            <Eye className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Canvas Area */}
                <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 p-8">
                    <Card className="shadow-2xl border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
                        <CardHeader className="pb-4 border-b border-slate-200 dark:border-slate-700">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                                        <Shapes className="h-4 w-4 text-white" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg text-slate-900 dark:text-slate-100">Canvas</CardTitle>
                                        <CardDescription className="text-slate-500 dark:text-slate-400">
                                            {canvasSize.width} × {canvasSize.height}px
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
                                    <Button
                                        variant={isPlaying ? "destructive" : "outline"}
                                        size="sm"
                                        onClick={() => setIsPlaying(!isPlaying)}
                                        className={isPlaying ? "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700" : ""}
                                    >
                                        {isPlaying ? (
                                            <>
                                                <X className="h-4 w-4 mr-2" />
                                                Stop
                                            </>
                                        ) : (
                                            <>
                                                <Play className="h-4 w-4 mr-2" />
                                                Preview
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div
                                ref={canvasRef}
                                className="relative bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-600 rounded-xl overflow-hidden shadow-inner transition-all duration-300 hover:shadow-xl select-none"
                                style={{
                                    width: canvasSize.width * zoom,
                                    height: canvasSize.height * zoom,
                                    background: background,
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
                                {elements.map((element) => (
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
                                        {element.type === 'text' && (
                                            <div
                                                className="w-full h-full flex items-center justify-center"
                                                style={{
                                                    fontSize: element.fontSize,
                                                    fontFamily: element.fontFamily,
                                                    color: element.fill
                                                }}
                                            >
                                                {element.text}
                                            </div>
                                        )}
                                        {element.type === 'image' && (
                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                <ImageIcon className="h-8 w-8 text-gray-400" />
                                            </div>
                                        )}
                                        {element.type === 'audio' && (
                                            <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                                                <Music className="h-8 w-8 text-blue-400" />
                                            </div>
                                        )}
                                        {element.type === 'shape' && (
                                            <div className="w-full h-full bg-purple-100 flex items-center justify-center">
                                                <Shapes className="h-8 w-8 text-purple-400" />
                                            </div>
                                        )}
                                        {element.type === 'sticker' && (
                                            <div className="w-full h-full bg-yellow-100 flex items-center justify-center">
                                                <Sticker className="h-8 w-8 text-yellow-400" />
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {elements.length === 0 && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center">
                                            <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                Start Creating
                                            </h3>
                                            <p className="text-gray-600">
                                                Click on the tools to add elements to your template
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Properties Panel */}
                <div className="w-80 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-l border-slate-200 dark:border-slate-700 p-4 overflow-y-auto">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 bg-gradient-to-br from-violet-500 to-purple-600 rounded-md flex items-center justify-center">
                            <Settings className="h-3 w-3 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Properties</h3>
                    </div>

                    <div className="space-y-6">
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
                                    <Label className="text-xs text-slate-500 dark:text-slate-400 mb-2 block">Canvas Size</Label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <Label className="text-xs text-slate-500 dark:text-slate-400">Width</Label>
                                            <Input
                                                type="number"
                                                value={canvasSize.width}
                                                onChange={(e) => setCanvasSize({ ...canvasSize, width: parseInt(e.target.value) || 800 })}
                                                className="text-sm border-slate-200 dark:border-slate-600"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs text-slate-500 dark:text-slate-400">Height</Label>
                                            <Input
                                                type="number"
                                                value={canvasSize.height}
                                                onChange={(e) => setCanvasSize({ ...canvasSize, height: parseInt(e.target.value) || 600 })}
                                                className="text-sm border-slate-200 dark:border-slate-600"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

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
                                            value={background}
                                            onChange={(e) => setBackground(e.target.value)}
                                            className="w-full h-10 border-slate-200 dark:border-slate-600"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs text-slate-500 dark:text-slate-400 mb-2 block">Hex</Label>
                                        <Input
                                            type="text"
                                            value={background}
                                            onChange={(e) => setBackground(e.target.value)}
                                            className="text-sm border-slate-200 dark:border-slate-600"
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
                                                onClick={() => setBackground(color)}
                                                className={`w-6 h-6 rounded border-2 ${background === color ? 'border-blue-500' : 'border-slate-200 dark:border-slate-600'}`}
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
                            <>
                                <div className="border-t pt-4">
                                    <Label className="block text-sm font-medium text-gray-700 mb-2">
                                        Element Properties
                                    </Label>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => deleteElement(selectedElement)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => duplicateElement(selectedElement)}
                                            >
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => updateElement(selectedElement, { visible: !getSelectedElement()?.visible })}
                                            >
                                                {getSelectedElement()?.visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </Button>
                                        </div>

                                        {getSelectedElement()?.type === 'text' && (
                                            <>
                                                <div>
                                                    <Label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Text
                                                    </Label>
                                                    <Input
                                                        value={getSelectedElement()?.text || ''}
                                                        onChange={(e) => updateElement(selectedElement, { text: e.target.value })}
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Font Size
                                                    </Label>
                                                    <Input
                                                        type="number"
                                                        value={getSelectedElement()?.fontSize || 24}
                                                        onChange={(e) => updateElement(selectedElement, { fontSize: parseInt(e.target.value) || 24 })}
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Font Family
                                                    </Label>
                                                    <Select
                                                        value={getSelectedElement()?.fontFamily || 'Arial'}
                                                        onValueChange={(value) => updateElement(selectedElement, { fontFamily: value })}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Arial">Arial</SelectItem>
                                                            <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                                                            <SelectItem value="Helvetica">Helvetica</SelectItem>
                                                            <SelectItem value="Georgia">Georgia</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <Label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Color
                                                    </Label>
                                                    <Input
                                                        type="color"
                                                        value={getSelectedElement()?.fill || '#000000'}
                                                        onChange={(e) => updateElement(selectedElement, { fill: e.target.value })}
                                                        className="w-full h-10"
                                                    />
                                                </div>
                                            </>
                                        )}

                                        <div>
                                            <Label className="block text-sm font-medium text-gray-700 mb-1">
                                                Position
                                            </Label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <Input
                                                    type="number"
                                                    placeholder="X"
                                                    value={getSelectedElement()?.x || 0}
                                                    onChange={(e) => updateElement(selectedElement, { x: parseInt(e.target.value) || 0 })}
                                                />
                                                <Input
                                                    type="number"
                                                    placeholder="Y"
                                                    value={getSelectedElement()?.y || 0}
                                                    onChange={(e) => updateElement(selectedElement, { y: parseInt(e.target.value) || 0 })}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label className="block text-sm font-medium text-gray-700 mb-1">
                                                Size
                                            </Label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <Input
                                                    type="number"
                                                    placeholder="Width"
                                                    value={getSelectedElement()?.width || 0}
                                                    onChange={(e) => updateElement(selectedElement, { width: parseInt(e.target.value) || 0 })}
                                                />
                                                <Input
                                                    type="number"
                                                    placeholder="Height"
                                                    value={getSelectedElement()?.height || 0}
                                                    onChange={(e) => updateElement(selectedElement, { height: parseInt(e.target.value) || 0 })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Layers */}
                        <div className="border-t pt-4">
                            <Label className="block text-sm font-medium text-gray-700 mb-2">
                                Layers ({elements.length})
                            </Label>
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                {elements.map((element, index) => (
                                    <div
                                        key={element.id}
                                        className={`flex items-center gap-2 p-2 rounded border cursor-pointer ${selectedElement === element.id
                                            ? 'bg-blue-50 border-blue-200'
                                            : 'bg-gray-50 border-gray-200'
                                            }`}
                                        onClick={() => setSelectedElement(element.id)}
                                    >
                                        <Layers className="h-4 w-4" />
                                        <span className="flex-1 text-sm">
                                            {element.type} {index + 1}
                                        </span>
                                        {!element.visible && <EyeOff className="h-4 w-4 text-gray-400" />}
                                        {element.locked && <Settings className="h-4 w-4 text-gray-400" />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}