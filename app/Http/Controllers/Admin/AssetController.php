<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Asset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AssetController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = Asset::with('media');

        // Filter by file type
        if ($request->filled('file_type')) {
            $query->where('file_type', $request->file_type);
        }

        // Filter by public/private
        if ($request->filled('is_public')) {
            $query->where('is_public', $request->boolean('is_public'));
        }

        // Search by name
        if ($request->filled('search')) {
            $query->search($request->search);
        }

        // Order by creation date
        $query->orderByCreated($request->get('order', 'desc'));

        $assets = $query->paginate(20);

        return Inertia::render('Admin/Assets', [
            'assets' => $assets,
            'filters' => $request->only(['file_type', 'is_public', 'search', 'order']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Assets/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'file' => 'required|file|max:102400', // 100MB max
            'file_type' => 'required|in:image,video,audio,lottie',
            'is_public' => 'boolean',
        ]);

        $asset = Asset::create([
            'name' => $request->name,
            'original_name' => $request->file('file')->getClientOriginalName(),
            'file_type' => $request->file_type,
            'mime_type' => $request->file('file')->getMimeType(),
            'file_size' => $request->file('file')->getSize(),
            'is_public' => $request->boolean('is_public', true),
            'metadata' => $this->extractMetadata($request->file('file'), $request->file_type),
        ]);

        // Upload file to media library
        $media = $asset->addMediaFromRequest('file')
            ->toMediaCollection('files');

        // Generate thumbnail for videos
        if ($request->file_type === 'video') {
            $asset->addMediaConversion('video_thumb')
                ->extractVideoFrameAtSecond(1)
                ->toMediaCollection('thumbnails');
        }

        return redirect()->route('admin.assets.index')
            ->with('success', 'Asset uploaded successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Asset $asset): Response
    {
        $asset->load('media', 'templates');
        
        return Inertia::render('Admin/Assets/Show', [
            'asset' => $asset,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Asset $asset): Response
    {
        $asset->load('media');
        
        return Inertia::render('Admin/Assets/Edit', [
            'asset' => $asset,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Asset $asset)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'is_public' => 'boolean',
        ]);

        $asset->update([
            'name' => $request->name,
            'is_public' => $request->boolean('is_public'),
        ]);

        return redirect()->route('admin.assets.index')
            ->with('success', 'Asset updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Asset $asset)
    {
        // Delete all media files
        $asset->clearMediaCollection('files');
        $asset->clearMediaCollection('thumbnails');
        
        // Delete the asset record
        $asset->delete();

        return redirect()->route('admin.assets.index')
            ->with('success', 'Asset deleted successfully.');
    }

    /**
     * Upload a new file for an existing asset
     */
    public function uploadFile(Request $request, Asset $asset)
    {
        $request->validate([
            'file' => 'required|file|max:102400',
        ]);

        // Clear existing media
        $asset->clearMediaCollection('files');
        $asset->clearMediaCollection('thumbnails');

        // Upload new file
        $media = $asset->addMediaFromRequest('file')
            ->toMediaCollection('files');

        // Update asset metadata
        $asset->update([
            'original_name' => $request->file('file')->getClientOriginalName(),
            'mime_type' => $request->file('file')->getMimeType(),
            'file_size' => $request->file('file')->getSize(),
            'metadata' => $this->extractMetadata($request->file('file'), $asset->file_type),
        ]);

        // Generate thumbnail for videos
        if ($asset->file_type === 'video') {
            $asset->addMediaConversion('video_thumb')
                ->extractVideoFrameAtSecond(1)
                ->toMediaCollection('thumbnails');
        }

        return redirect()->back()
            ->with('success', 'File uploaded successfully.');
    }

    /**
     * Download the asset file
     */
    public function download(Asset $asset)
    {
        $media = $asset->getMainFile();
        
        if (!$media) {
            abort(404, 'File not found');
        }

        return $media;
    }

    /**
     * Get asset URL with conversion
     */
    public function url(Asset $asset, string $conversion = '')
    {
        $url = $asset->getFileUrl($conversion);
        
        if (!$url) {
            abort(404, 'File not found');
        }

        return redirect($url);
    }

    /**
     * Extract metadata from uploaded file
     */
    private function extractMetadata($file, string $fileType): array
    {
        $metadata = [];

        if ($fileType === 'image') {
            $imageInfo = getimagesize($file->getPathname());
            if ($imageInfo) {
                $metadata = [
                    'width' => $imageInfo[0],
                    'height' => $imageInfo[1],
                    'format' => $imageInfo['mime'],
                ];
            }
        } elseif ($fileType === 'video') {
            // For video metadata, you might want to use FFmpeg
            $metadata = [
                'duration' => 0, // Would need FFmpeg to extract
                'width' => 0,
                'height' => 0,
            ];
        } elseif ($fileType === 'audio') {
            $metadata = [
                'duration' => 0, // Would need audio processing library
                'bitrate' => 0,
            ];
        }

        return $metadata;
    }
}
