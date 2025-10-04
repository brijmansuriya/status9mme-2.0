import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    Upload,
    Image as ImageIcon,
    Music,
    FileText,
    Search,
    X,
    Plus,
    Folder,
    Download,
    Trash2,
    Edit,
    Eye,
    Filter,
    Grid3X3,
    List,
    Calendar,
    Tag as TagIcon,
    User,
    Clock,
    HardDrive
} from 'lucide-react';

interface Asset {
    id: number;
    name: string;
    slug: string;
    type: 'image' | 'audio' | 'video' | 'sticker' | 'font';
    file_path: string;
    file_size: number;
    mime_type: string;
    metadata: Record<string, any>;
    category: string;
    tags: string[];
    uploaded_by: number;
    is_public: boolean;
    usage_count: number;
    created_at: string;
    updated_at: string;
}

interface AssetLibraryProps {
    onSelectAsset?: (asset: Asset) => void;
    onClose?: () => void;
    isVisible: boolean;
    assetType?: 'image' | 'audio' | 'video' | 'sticker' | 'font' | 'all';
    mode?: 'select' | 'manage';
}

const AssetLibrary: React.FC<AssetLibraryProps> = ({
    onSelectAsset,
    onClose,
    isVisible,
    assetType = 'all',
    mode = 'select'
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedType, setSelectedType] = useState(assetType);
    const [showUpload, setShowUpload] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState<'name' | 'date' | 'size' | 'usage'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [selectedAssets, setSelectedAssets] = useState<number[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Helper functions
    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'image':
                return <ImageIcon className="h-5 w-5" />;
            case 'audio':
                return <Music className="h-5 w-5" />;
            case 'video':
                return <FileText className="h-5 w-5" />;
            case 'sticker':
                return <TagIcon className="h-5 w-5" />;
            case 'font':
                return <FileText className="h-5 w-5" />;
            default:
                return <FileText className="h-5 w-5" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'image':
                return 'bg-green-100 text-green-800';
            case 'audio':
                return 'bg-blue-100 text-blue-800';
            case 'video':
                return 'bg-purple-100 text-purple-800';
            case 'sticker':
                return 'bg-yellow-100 text-yellow-800';
            case 'font':
                return 'bg-indigo-100 text-indigo-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Mock data - in real app, this would come from API
    const mockAssets: Asset[] = [
        {
            id: 1,
            name: 'Birthday Balloons',
            slug: 'birthday-balloons',
            type: 'image',
            file_path: 'assets/images/balloons.jpg',
            file_size: 250880,
            mime_type: 'image/jpeg',
            metadata: { width: 800, height: 600 },
            category: 'birthday',
            tags: ['celebration', 'colorful'],
            uploaded_by: 1,
            is_public: true,
            usage_count: 15,
            created_at: '2024-01-15T10:30:00Z',
            updated_at: '2024-01-15T10:30:00Z'
        },
        {
            id: 2,
            name: 'Happy Birthday Song',
            slug: 'happy-birthday-song',
            type: 'audio',
            file_path: 'assets/audio/birthday.mp3',
            file_size: 2201600,
            mime_type: 'audio/mpeg',
            metadata: { duration: 180 },
            category: 'birthday',
            tags: ['music', 'celebration'],
            uploaded_by: 1,
            is_public: true,
            usage_count: 8,
            created_at: '2024-01-16T14:20:00Z',
            updated_at: '2024-01-16T14:20:00Z'
        },
        {
            id: 3,
            name: 'Heart Sticker',
            slug: 'heart-sticker',
            type: 'sticker',
            file_path: 'assets/stickers/heart.svg',
            file_size: 12288,
            mime_type: 'image/svg+xml',
            metadata: { width: 100, height: 100 },
            category: 'wedding',
            tags: ['love', 'romance'],
            uploaded_by: 1,
            is_public: true,
            usage_count: 23,
            created_at: '2024-01-17T09:15:00Z',
            updated_at: '2024-01-17T09:15:00Z'
        },
        {
            id: 4,
            name: 'Wedding Music',
            slug: 'wedding-music',
            type: 'audio',
            file_path: 'assets/audio/wedding.mp3',
            file_size: 3200000,
            mime_type: 'audio/mpeg',
            metadata: { duration: 240 },
            category: 'wedding',
            tags: ['romantic', 'classical'],
            uploaded_by: 1,
            is_public: true,
            usage_count: 12,
            created_at: '2024-01-18T16:45:00Z',
            updated_at: '2024-01-18T16:45:00Z'
        },
        {
            id: 5,
            name: 'Business Logo',
            slug: 'business-logo',
            type: 'image',
            file_path: 'assets/images/logo.png',
            file_size: 150000,
            mime_type: 'image/png',
            metadata: { width: 400, height: 200 },
            category: 'business',
            tags: ['corporate', 'professional'],
            uploaded_by: 1,
            is_public: true,
            usage_count: 5,
            created_at: '2024-01-19T11:00:00Z',
            updated_at: '2024-01-19T11:00:00Z'
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
        { value: 'video', label: 'Videos', icon: FileText },
        { value: 'sticker', label: 'Stickers', icon: TagIcon },
        { value: 'font', label: 'Fonts', icon: FileText }
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

    const handleSelectAsset = (asset: Asset) => {
        if (mode === 'select' && onSelectAsset) {
            onSelectAsset(asset);
        } else if (mode === 'manage') {
            // Toggle selection for bulk operations
            setSelectedAssets(prev =>
                prev.includes(asset.id)
                    ? prev.filter(id => id !== asset.id)
                    : [...prev, asset.id]
            );
        }
    };

    const handleBulkDelete = () => {
        if (selectedAssets.length > 0) {
            // In a real app, this would delete from the server
            console.log('Deleting assets:', selectedAssets);
            setSelectedAssets([]);
        }
    };

    if (!isVisible) {
        return null;
    }

    return (
        <Dialog open={isVisible} onOpenChange={onClose}>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden p-0">
                <DialogHeader className="p-6 pb-0">
                    <div className="flex items-center justify-between">
                        <div>
                            <DialogTitle className="text-xl font-semibold">Asset Library</DialogTitle>
                            <DialogDescription className="mt-1">
                                {mode === 'select' ? 'Select an asset to use in your template' : 'Manage your uploaded assets'}
                            </DialogDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            {mode === 'manage' && selectedAssets.length > 0 && (
                                <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete ({selectedAssets.length})
                                </Button>
                            )}
                            <Button variant="outline" size="sm" onClick={onClose}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </DialogHeader>

                {/* Filters */}
                <div className="px-6 pb-6 space-y-4">
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
                        <Select value={selectedType} onValueChange={setSelectedType}>
                            <SelectTrigger className="w-40">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {types.map(type => {
                                    const Icon = type.icon;
                                    return (
                                        <SelectItem key={type.value} value={type.value}>
                                            <div className="flex items-center gap-2">
                                                <Icon className="h-4 w-4" />
                                                {type.label}
                                            </div>
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>

                        {/* Category Filter */}
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="w-40">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map(category => (
                                    <SelectItem key={category.value} value={category.value}>
                                        {category.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* View Mode Toggle */}
                        <div className="flex items-center gap-1 border rounded-md">
                            <Button
                                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setViewMode('grid')}
                            >
                                <Grid3X3 className="h-4 w-4" />
                            </Button>
                            <Button
                                variant={viewMode === 'list' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setViewMode('list')}
                            >
                                <List className="h-4 w-4" />
                            </Button>
                        </div>

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

                {/* Asset Grid/List */}
                <div className="px-6 pb-6 overflow-y-auto">
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
                    ) : viewMode === 'grid' ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {filteredAssets.map((asset) => (
                                <Card
                                    key={asset.id}
                                    className={`cursor-pointer hover:shadow-md transition-shadow relative ${selectedAssets.includes(asset.id) ? 'ring-2 ring-primary' : ''
                                        }`}
                                    onClick={() => handleSelectAsset(asset)}
                                >
                                    <CardContent className="p-4">
                                        {/* Asset Preview */}
                                        <div className="aspect-square bg-muted rounded-md mb-3 flex items-center justify-center relative">
                                            {asset.type === 'image' ? (
                                                <img
                                                    src={asset.file_path}
                                                    alt={asset.name}
                                                    className="w-full h-full object-cover rounded-md"
                                                />
                                            ) : (
                                                <div className="text-center">
                                                    {getTypeIcon(asset.type)}
                                                    <p className="text-xs text-muted-foreground mt-1">{asset.type}</p>
                                                </div>
                                            )}

                                            {/* Selection indicator */}
                                            {selectedAssets.includes(asset.id) && (
                                                <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                                    <div className="w-2 h-2 bg-white rounded-full" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Asset Info */}
                                        <div className="space-y-2">
                                            <h4 className="font-medium text-sm line-clamp-1">{asset.name}</h4>

                                            <div className="flex items-center gap-1">
                                                <Badge className={getTypeColor(asset.type)}>
                                                    {asset.type}
                                                </Badge>
                                                <Badge variant="outline" className="text-xs">
                                                    {formatFileSize(asset.file_size)}
                                                </Badge>
                                            </div>

                                            {/* Tags */}
                                            {asset.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-1">
                                                    {asset.tags.slice(0, 2).map((tag, index) => (
                                                        <Badge key={index} variant="secondary" className="text-xs">
                                                            <TagIcon className="h-3 w-3 mr-1" />
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

                                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                <span>Used {asset.usage_count} times</span>
                                                <span>{formatDate(asset.created_at)}</span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        {mode === 'select' && onSelectAsset && (
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
                    ) : (
                        <div className="space-y-2">
                            {filteredAssets.map((asset) => (
                                <Card
                                    key={asset.id}
                                    className={`cursor-pointer hover:shadow-md transition-shadow ${selectedAssets.includes(asset.id) ? 'ring-2 ring-primary' : ''
                                        }`}
                                    onClick={() => handleSelectAsset(asset)}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-4">
                                            {/* Asset Preview */}
                                            <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center flex-shrink-0">
                                                {asset.type === 'image' ? (
                                                    <img
                                                        src={asset.file_path}
                                                        alt={asset.name}
                                                        className="w-full h-full object-cover rounded-md"
                                                    />
                                                ) : (
                                                    <div className="text-center">
                                                        {getTypeIcon(asset.type)}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Asset Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-medium text-sm truncate">{asset.name}</h4>
                                                    <Badge className={getTypeColor(asset.type)}>
                                                        {asset.type}
                                                    </Badge>
                                                </div>

                                                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                                    <span>{formatFileSize(asset.file_size)}</span>
                                                    <span>•</span>
                                                    <span>Used {asset.usage_count} times</span>
                                                    <span>•</span>
                                                    <span>{formatDate(asset.created_at)}</span>
                                                </div>

                                                {/* Tags */}
                                                {asset.tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-1">
                                                        {asset.tags.map((tag, index) => (
                                                            <Badge key={index} variant="secondary" className="text-xs">
                                                                <TagIcon className="h-3 w-3 mr-1" />
                                                                {tag}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2">
                                                {mode === 'select' && onSelectAsset && (
                                                    <Button
                                                        size="sm"
                                                        onClick={() => onSelectAsset(asset)}
                                                    >
                                                        <Plus className="h-4 w-4 mr-2" />
                                                        Use
                                                    </Button>
                                                )}
                                                {mode === 'manage' && (
                                                    <div className="flex items-center gap-1">
                                                        <Button variant="outline" size="sm">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="outline" size="sm">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="outline" size="sm">
                                                            <Download className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AssetLibrary;
