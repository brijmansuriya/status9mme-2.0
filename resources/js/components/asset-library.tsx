import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Upload,
    Image as ImageIcon,
    Music,
    FileText,
    Search,
    X,
    Plus,
    Folder
} from 'lucide-react';

interface Asset {
    id: number;
    name: string;
    type: string;
    file_path: string;
    url: string;
    category: string;
    tags: string[];
    usage_count: number;
    formatted_size: string;
}

interface AssetLibraryProps {
    onSelectAsset?: (asset: Asset) => void;
    onClose?: () => void;
    isVisible: boolean;
    assetType?: 'image' | 'audio' | 'sticker' | 'all';
}

const AssetLibrary: React.FC<AssetLibraryProps> = ({
    onSelectAsset,
    onClose,
    isVisible,
    assetType = 'all'
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedType, setSelectedType] = useState(assetType);
    const [showUpload, setShowUpload] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Mock data - in real app, this would come from API
    const mockAssets: Asset[] = [
        {
            id: 1,
            name: 'Birthday Balloons',
            type: 'image',
            file_path: 'assets/images/balloons.jpg',
            url: '/images/placeholder.jpg',
            category: 'birthday',
            tags: ['celebration', 'colorful'],
            usage_count: 15,
            formatted_size: '245 KB'
        },
        {
            id: 2,
            name: 'Happy Birthday Song',
            type: 'audio',
            file_path: 'assets/audio/birthday.mp3',
            url: '/audio/placeholder.mp3',
            category: 'birthday',
            tags: ['music', 'celebration'],
            usage_count: 8,
            formatted_size: '2.1 MB'
        },
        {
            id: 3,
            name: 'Heart Sticker',
            type: 'sticker',
            file_path: 'assets/stickers/heart.svg',
            url: '/stickers/heart.svg',
            category: 'wedding',
            tags: ['love', 'romance'],
            usage_count: 23,
            formatted_size: '12 KB'
        }
    ];

    const categories = [
        { value: 'all', label: 'All Categories' },
        { value: 'birthday', label: 'Birthday' },
        { value: 'wedding', label: 'Wedding' },
        { value: 'festival', label: 'Festival' },
        { value: 'business', label: 'Business' },
        { value: 'general', label: 'General' }
    ];

    const types = [
        { value: 'all', label: 'All Types', icon: Folder },
        { value: 'image', label: 'Images', icon: ImageIcon },
        { value: 'audio', label: 'Audio', icon: Music },
        { value: 'sticker', label: 'Stickers', icon: FileText }
    ];

    const filteredAssets = mockAssets.filter(asset => {
        const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            asset.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = selectedCategory === 'all' || asset.category === selectedCategory;
        const matchesType = selectedType === 'all' || asset.type === selectedType;

        return matchesSearch && matchesCategory && matchesType;
    });

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            // In a real app, this would upload to the server
            console.log('Files to upload:', files);
            setShowUpload(false);
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'image':
                return <ImageIcon className="h-6 w-6" />;
            case 'audio':
                return <Music className="h-6 w-6" />;
            case 'sticker':
                return <FileText className="h-6 w-6" />;
            default:
                return <FileText className="h-6 w-6" />;
        }
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background rounded-lg shadow-lg w-full max-w-4xl max-h-[80vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-lg font-semibold">Asset Library</h2>
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {/* Filters */}
                <div className="p-6 border-b space-y-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search assets..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9"
                            />
                        </div>

                        {/* Type Filter */}
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="px-3 py-2 border border-input rounded-md bg-background text-sm"
                        >
                            {types.map(type => (
                                <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                        </select>

                        {/* Category Filter */}
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-3 py-2 border border-input rounded-md bg-background text-sm"
                        >
                            {categories.map(category => (
                                <option key={category.value} value={category.value}>{category.label}</option>
                            ))}
                        </select>

                        {/* Upload Button */}
                        <Button onClick={() => setShowUpload(!showUpload)}>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload
                        </Button>
                    </div>

                    {/* Upload Area */}
                    {showUpload && (
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                            <div className="text-center">
                                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
                                <p className="text-muted-foreground mb-4">Upload new assets</p>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    accept="image/*,audio/*,.svg,.png,.jpg,.jpeg,.mp3,.wav"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                                <Button onClick={() => fileInputRef.current?.click()}>
                                    Choose Files
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Asset Grid */}
                <div className="flex-1 p-6 overflow-y-auto">
                    {filteredAssets.length === 0 ? (
                        <div className="text-center py-8">
                            <Folder className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-foreground mb-2">No assets found</h3>
                            <p className="text-muted-foreground">
                                {searchTerm || selectedCategory !== 'all' || selectedType !== 'all'
                                    ? 'Try adjusting your filters'
                                    : 'Upload some assets to get started'
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {filteredAssets.map((asset) => (
                                <Card key={asset.id} className="cursor-pointer hover:shadow-md transition-shadow">
                                    <CardContent className="p-4">
                                        {/* Asset Preview */}
                                        <div className="aspect-square bg-muted rounded-md mb-3 flex items-center justify-center">
                                            {asset.type === 'image' ? (
                                                <img
                                                    src={asset.url}
                                                    alt={asset.name}
                                                    className="w-full h-full object-cover rounded-md"
                                                />
                                            ) : (
                                                <div className="text-center">
                                                    {getTypeIcon(asset.type)}
                                                    <p className="text-xs text-muted-foreground mt-1">{asset.type}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Asset Info */}
                                        <div className="space-y-2">
                                            <h4 className="font-medium text-sm line-clamp-1">{asset.name}</h4>

                                            <div className="flex items-center gap-1">
                                                <Badge variant="outline" className="text-xs">
                                                    {asset.category}
                                                </Badge>
                                                <Badge variant="secondary" className="text-xs">
                                                    {asset.formatted_size}
                                                </Badge>
                                            </div>

                                            {/* Tags */}
                                            {asset.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-1">
                                                    {asset.tags.slice(0, 2).map((tag, index) => (
                                                        <Badge key={index} variant="secondary" className="text-xs">
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                    {asset.tags.length > 2 && (
                                                        <Badge variant="secondary" className="text-xs">
                                                            +{asset.tags.length - 2}
                                                        </Badge>
                                                    )}
                                                </div>
                                            )}

                                            <div className="text-xs text-muted-foreground">
                                                Used {asset.usage_count} times
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        {onSelectAsset && (
                                            <div className="pt-3 mt-3 border-t">
                                                <Button
                                                    size="sm"
                                                    className="w-full"
                                                    onClick={() => onSelectAsset(asset)}
                                                >
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Use Asset
                                                </Button>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AssetLibrary;
