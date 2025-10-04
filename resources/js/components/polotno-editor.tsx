import React, { useState } from 'react';

interface PolotnoEditorProps {
    initialData?: object;
    onSave: (data: object) => void;
    onCancel: () => void;
    isVisible: boolean;
}

const PolotnoEditor: React.FC<PolotnoEditorProps> = ({
    initialData,
    onSave,
    onCancel,
    isVisible
}) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = () => {
        // Mock JSON data for now
        const mockJsonData = initialData || {
            version: "5.3.0",
            objects: [
                {
                    type: "text",
                    text: "Sample Text",
                    fontSize: 48,
                    fontFamily: "Arial",
                    fill: "#000000",
                    x: 100,
                    y: 100,
                    width: 300,
                    height: 60
                }
            ],
            background: {
                type: "color",
                color: "#ffffff"
            }
        };
        onSave(mockJsonData);
    };

    const handleCancel = () => {
        onCancel();
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div className="h-full w-full">
            {/* Placeholder Editor */}
            <div className="flex-1 bg-muted/30 rounded-lg p-8 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium mb-2">Drag & Drop Editor</h3>
                    <p className="text-muted-foreground mb-4">
                        Polotno editor integration will be implemented here
                    </p>
                    <div className="text-sm text-muted-foreground">
                        <p>• Add text, images, and shapes</p>
                        <p>• Customize colors, fonts, and effects</p>
                        <p>• Real-time preview and editing</p>
                    </div>
                </div>
            </div>

            {/* Editor Actions */}
            <div className="flex items-center justify-between p-4 border-t bg-background">
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleCancel}
                        className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Cancel
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => {
                            const jsonData = initialData || {
                                version: "5.3.0",
                                objects: [
                                    {
                                        type: "text",
                                        text: "Sample Text",
                                        fontSize: 48,
                                        fontFamily: "Arial",
                                        fill: "#000000",
                                        x: 100,
                                        y: 100,
                                        width: 300,
                                        height: 60
                                    }
                                ],
                                background: {
                                    type: "color",
                                    color: "#ffffff"
                                }
                            };
                            const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
                                type: 'application/json'
                            });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = 'template.json';
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                        }}
                        className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Export JSON
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                        Save Template
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PolotnoEditor;
