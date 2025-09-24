<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\TemplateRequest;
use App\Models\Template;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TemplateController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $templates = Template::with('category')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('Admin/Templates/Index', [
            'templates' => $templates,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = Category::where('is_active', true)
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/Templates/Create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(TemplateRequest $request)
    {
        $data = $request->validated();

        // Handle file uploads
        if ($request->hasFile('thumbnail')) {
            $data['thumbnail'] = $request->file('thumbnail')->store('templates/thumbnails', 'public');
        }

        if ($request->hasFile('preview_video')) {
            $data['preview_video'] = $request->file('preview_video')->store('templates/videos', 'public');
        }

        $template = Template::create($data);

        return redirect()->route('admin.templates.index')
            ->with('success', 'Template created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Template $template)
    {
        $template->load('category', 'assets');
        
        return Inertia::render('Admin/Templates/Show', [
            'template' => $template,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Template $template)
    {
        $categories = Category::where('is_active', true)
            ->orderBy('name')
            ->get();

        $template->load('category', 'assets');

        return Inertia::render('Admin/Templates/Edit', [
            'template' => $template,
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(TemplateRequest $request, Template $template)
    {
        $data = $request->validated();

        // Handle file uploads
        if ($request->hasFile('thumbnail')) {
            // Delete old thumbnail
            if ($template->thumbnail) {
                Storage::disk('public')->delete($template->thumbnail);
            }
            $data['thumbnail'] = $request->file('thumbnail')->store('templates/thumbnails', 'public');
        }

        if ($request->hasFile('preview_video')) {
            // Delete old video
            if ($template->preview_video) {
                Storage::disk('public')->delete($template->preview_video);
            }
            $data['preview_video'] = $request->file('preview_video')->store('templates/videos', 'public');
        }

        $template->update($data);

        return redirect()->route('admin.templates.index')
            ->with('success', 'Template updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Template $template)
    {
        // Delete associated files
        if ($template->thumbnail) {
            Storage::disk('public')->delete($template->thumbnail);
        }
        if ($template->preview_video) {
            Storage::disk('public')->delete($template->preview_video);
        }

        $template->delete();

        return redirect()->route('admin.templates.index')
            ->with('success', 'Template deleted successfully.');
    }
}
