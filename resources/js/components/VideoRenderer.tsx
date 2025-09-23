import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface VideoRendererProps {
    template: any;
    customizations: Record<string, any>;
    width?: number;
    height?: number;
    isPlaying?: boolean;
    currentTime?: number;
    onTimeUpdate?: (time: number) => void;
}

export default function VideoRenderer({ 
    template, 
    customizations, 
    width = 540, 
    height = 960,
    isPlaying = false,
    currentTime = 0,
    onTimeUpdate
}: VideoRendererProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>();
    const [isRendering, setIsRendering] = useState(false);

    const renderFrame = (time: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Render background
        if (template.json_config.background) {
            const bg = template.json_config.background;
            if (bg.type === 'gradient') {
                const gradient = ctx.createLinearGradient(0, 0, 0, height);
                bg.colors.forEach((color: string, index: number) => {
                    gradient.addColorStop(index / (bg.colors.length - 1), color);
                });
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, width, height);
            } else if (bg.type === 'image' && bg.src) {
                // For now, just show a placeholder
                ctx.fillStyle = '#1a1a2e';
                ctx.fillRect(0, 0, width, height);
            } else {
                ctx.fillStyle = '#000000';
                ctx.fillRect(0, 0, width, height);
            }
        }

        // Render layers
        template.json_config.layers?.forEach((layer: any, index: number) => {
            const customization = customizations[`${layer.type}_${index}`] || {};
            
            switch (layer.type) {
                case 'text':
                    renderTextLayer(ctx, layer, customization, time);
                    break;
                case 'image':
                    renderImageLayer(ctx, layer, customization, time);
                    break;
                case 'lottie':
                    renderLottieLayer(ctx, layer, customization, time);
                    break;
            }
        });

        // Continue animation if playing
        if (isPlaying) {
            animationRef.current = requestAnimationFrame((newTime) => {
                renderFrame(newTime);
                if (onTimeUpdate) {
                    onTimeUpdate(newTime / 1000);
                }
            });
        }
    };

    const renderTextLayer = (ctx: CanvasRenderingContext2D, layer: any, customization: any, time: number) => {
        const content = customization.content || layer.content || '';
        const fontSize = customization.fontSize || layer.fontSize || 24;
        const color = customization.color || layer.color || '#FFFFFF';
        const fontFamily = customization.fontFamily || layer.fontFamily || 'Arial';
        const textAlign = customization.textAlign || layer.textAlign || 'center';
        const position = layer.position || [width / 2, height / 2];

        ctx.font = `${fontSize}px ${fontFamily}`;
        ctx.fillStyle = color;
        ctx.textAlign = textAlign as CanvasTextAlign;
        ctx.textBaseline = 'middle';

        // Apply animations
        let x = position[0];
        let y = position[1];
        let alpha = 1;

        if (layer.animation) {
            switch (layer.animation) {
                case 'fadeIn':
                    alpha = Math.min(time / 2, 1);
                    break;
                case 'fadeInUp':
                    alpha = Math.min(time / 2, 1);
                    y = position[1] - (1 - alpha) * 50;
                    break;
                case 'bounce':
                    const bounceTime = (time % 2) / 2;
                    const bounceScale = Math.sin(bounceTime * Math.PI);
                    ctx.scale(1 + bounceScale * 0.1, 1 + bounceScale * 0.1);
                    break;
                case 'glow':
                    ctx.shadowColor = color;
                    ctx.shadowBlur = 20;
                    break;
                case 'typewriter':
                    const typewriterSpeed = 0.1;
                    const visibleChars = Math.min(Math.floor(time / typewriterSpeed), content.length);
                    const visibleContent = content.substring(0, visibleChars);
                    ctx.fillText(visibleContent, x, y);
                    return;
            }
        }

        ctx.globalAlpha = alpha;
        ctx.fillText(content, x, y);
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
    };

    const renderImageLayer = (ctx: CanvasRenderingContext2D, layer: any, customization: any, time: number) => {
        const position = layer.position || [width / 2, height / 2];
        const size = customization.size || layer.size || [100, 100];
        const shape = layer.shape || 'rectangle';

        // For now, just render a placeholder
        ctx.fillStyle = '#4A90E2';
        ctx.globalAlpha = 0.8;

        if (shape === 'circle') {
            ctx.beginPath();
            ctx.arc(position[0], position[1], size[0] / 2, 0, 2 * Math.PI);
            ctx.fill();
        } else {
            ctx.fillRect(
                position[0] - size[0] / 2,
                position[1] - size[1] / 2,
                size[0],
                size[1]
            );
        }

        ctx.globalAlpha = 1;
    };

    const renderLottieLayer = (ctx: CanvasRenderingContext2D, layer: any, customization: any, time: number) => {
        // Placeholder for Lottie animation
        const position = layer.position || [width / 2, height / 2];
        const size = layer.size || [200, 200];

        ctx.fillStyle = '#FFD93D';
        ctx.globalAlpha = 0.6;
        
        // Simple animated circle as placeholder
        const radius = size[0] / 2;
        const pulse = Math.sin(time * 2) * 0.2 + 0.8;
        
        ctx.beginPath();
        ctx.arc(position[0], position[1], radius * pulse, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.globalAlpha = 1;
    };

    useEffect(() => {
        if (isPlaying) {
            renderFrame(0);
        } else {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            renderFrame(currentTime * 1000);
        }

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isPlaying, currentTime, customizations, template]);

    const handleExport = async () => {
        setIsRendering(true);
        
        try {
            // Create a video from canvas frames
            const canvas = canvasRef.current;
            if (!canvas) return;

            // For now, just download the current frame as PNG
            const link = document.createElement('a');
            link.download = `${template.name}-frame.png`;
            link.href = canvas.toDataURL();
            link.click();
        } catch (error) {
            console.error('Export failed:', error);
        } finally {
            setIsRendering(false);
        }
    };

    return (
        <div className="relative">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative bg-black rounded-lg overflow-hidden shadow-2xl"
            >
                <canvas
                    ref={canvasRef}
                    width={width}
                    height={height}
                    className="w-full h-auto"
                    style={{ aspectRatio: `${width}/${height}` }}
                />
                
                {/* Loading overlay */}
                {isRendering && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="text-white text-center">
                            <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-2"></div>
                            <p>Rendering video...</p>
                        </div>
                    </div>
                )}
            </motion.div>
            
            {/* Export button */}
            <div className="mt-4 text-center">
                <button
                    onClick={handleExport}
                    disabled={isRendering}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isRendering ? 'Rendering...' : 'Export Frame'}
                </button>
            </div>
        </div>
    );
}
