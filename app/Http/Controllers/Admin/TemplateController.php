<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\TemplateRequest;
use App\Models\Template;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class TemplateController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $admin = auth()->guard('admin')->user();

        $query = Template::with('admin');

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhereJsonContains('tags', $search);
            });
        }

        // Status filter
        if ($request->filled('status')) {
            $query->where('status', $request->get('status'));
        }

        // Category filter
        if ($request->filled('category')) {
            $query->where('category', $request->get('category'));
        }

        // Sort by
        $sortBy    = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $templates = $query->paginate(12)->withQueryString();

        // Get available categories for filter
        $categories = [
            'birthday'    => 'Birthday',
            'wedding'     => 'Wedding',
            'festival'    => 'Festival',
            'quotes'      => 'Quotes',
            'anniversary' => 'Anniversary',
            'graduation'  => 'Graduation',
            'holiday'     => 'Holiday',
            'business'    => 'Business',
            'social'      => 'Social',
            'general'     => 'General',
        ];

        return Inertia::render('admin/templates/index', [
            'admin'      => $admin,
            'auth'       => [
                'user' => $admin,
            ],
            'templates'  => $templates,
            'categories' => $categories,
            'filters'    => $request->only(['search', 'status', 'category', 'sort_by', 'sort_order']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $admin = auth()->guard('admin')->user();

        $categories = [
            ['id' => 1, 'name' => 'Birthday', 'slug' => 'birthday'],
            ['id' => 2, 'name' => 'Wedding', 'slug' => 'wedding'],
            ['id' => 3, 'name' => 'Festival', 'slug' => 'festival'],
            ['id' => 4, 'name' => 'Quotes', 'slug' => 'quotes'],
            ['id' => 5, 'name' => 'Anniversary', 'slug' => 'anniversary'],
            ['id' => 6, 'name' => 'Graduation', 'slug' => 'graduation'],
            ['id' => 7, 'name' => 'Holiday', 'slug' => 'holiday'],
            ['id' => 8, 'name' => 'Business', 'slug' => 'business'],
            ['id' => 9, 'name' => 'Social', 'slug' => 'social'],
            ['id' => 10, 'name' => 'General', 'slug' => 'general'],
        ];

        return Inertia::render('admin/templates/create', [
            'admin'      => $admin,
            'auth'       => [
                'user' => $admin,
            ],
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(TemplateRequest $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->validated();

            // Generate unique slug
            $data['slug'] = $this->generateUniqueSlug($data['name']);

            // Generate thumbnail if not provided
            if (empty($data['thumbnail_url'])) {
                $data['thumbnail_url'] = $this->generateThumbnail($data['json_layout']);
            }

            $template = Template::create($data);

            DB::commit();

            return redirect()->route('admin.templates.index')
                ->with('success', 'Template created successfully.');
        } catch (\Exception $e) {
            DB::rollback();

            \Log::error('TemplateController@store error', [
                'error' => $e->getMessage(),
                'data'  => $request->all(),
            ]);

            return back()->withInput()
                ->with('error', 'Failed to create template. Please try again.');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Template $template)
    {
        $admin = auth()->guard('admin')->user();

        return Inertia::render('admin/templates/show', [
            'admin'    => $admin,
            'auth'     => [
                'user' => $admin,
            ],
            'template' => $template->load('admin'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Template $template)
    {
        $admin = auth()->guard('admin')->user();

        $categories = [
            'birthday'    => 'Birthday',
            'wedding'     => 'Wedding',
            'festival'    => 'Festival',
            'quotes'      => 'Quotes',
            'anniversary' => 'Anniversary',
            'graduation'  => 'Graduation',
            'holiday'     => 'Holiday',
            'business'    => 'Business',
            'social'      => 'Social',
            'general'     => 'General',
        ];

        return Inertia::render('admin/templates/edit', [
            'admin'      => $admin,
            'auth'       => [
                'user' => $admin,
            ],
            'template'   => $template,
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(TemplateRequest $request, Template $template)
    {
        DB::beginTransaction();
        try {
            $data = $request->validated();

            // Generate unique slug if name changed
            if ($data['name'] !== $template->name) {
                $data['slug'] = $this->generateUniqueSlug($data['name'], $template->id);
            }

            // Increment version if JSON layout changed
            if ($data['json_layout'] !== $template->json_layout) {
                $data['version'] = $template->version + 1;

                // Generate new thumbnail if layout changed
                if (empty($data['thumbnail_url'])) {
                    $data['thumbnail_url'] = $this->generateThumbnail($data['json_layout']);
                }
            }

            $template->update($data);

            DB::commit();

            return redirect()->route('admin.templates.index')
                ->with('success', 'Template updated successfully.');
        } catch (\Exception $e) {
            DB::rollback();

            \Log::error('TemplateController@update error', [
                'error'       => $e->getMessage(),
                'template_id' => $template->id,
                'data'        => $request->all(),
            ]);

            return back()->withInput()
                ->with('error', 'Failed to update template. Please try again.');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Template $template)
    {
        DB::beginTransaction();
        try {
            $templateName = $template->name;

            // Delete thumbnail file if it exists
            if ($template->thumbnail_url && Storage::disk('public')->exists($template->thumbnail_url)) {
                Storage::disk('public')->delete($template->thumbnail_url);
            }

            $template->delete();

            DB::commit();

            return redirect()->route('admin.templates.index')
                ->with('success', "Template '{$templateName}' deleted successfully.");
        } catch (\Exception $e) {
            DB::rollback();

            \Log::error('TemplateController@destroy error', [
                'error'       => $e->getMessage(),
                'template_id' => $template->id,
            ]);

            return back()->with('error', 'Failed to delete template. Please try again.');
        }
    }

    /**
     * Toggle template status.
     */
    public function toggleStatus(Template $template)
    {
        DB::beginTransaction();
        try {
            $newStatus = match ($template->status) {
                'draft' => 'published',
                'published' => 'archived',
                'archived' => 'draft',
                default => 'draft'
            };

            $template->update(['status' => $newStatus]);

            DB::commit();

            return back()->with('success', "Template '{$template->name}' status updated to {$newStatus}.");
        } catch (\Exception $e) {
            DB::rollback();

            \Log::error('TemplateController@toggleStatus error', [
                'error'       => $e->getMessage(),
                'template_id' => $template->id,
            ]);

            return back()->with('error', 'Failed to update template status. Please try again.');
        }
    }

    /**
     * Duplicate a template.
     */
    public function duplicate(Template $template)
    {
        DB::beginTransaction();
        try {
            $newTemplate = $template->replicate([
                'thumbnail_url' => null,
            ]);

            $newTemplate->name       = $template->name . ' (Copy)';
            $newTemplate->slug       = $this->generateUniqueSlug($newTemplate->name);
            $newTemplate->status     = 'draft';
            $newTemplate->version    = 1;
            $newTemplate->created_by = auth()->guard('admin')->id();
            $newTemplate->save();

            DB::commit();

            return redirect()->route('admin.templates.edit', $newTemplate)
                ->with('success', 'Template duplicated successfully.');
        } catch (\Exception $e) {
            DB::rollback();

            \Log::error('TemplateController@duplicate error', [
                'error'       => $e->getMessage(),
                'template_id' => $template->id,
            ]);

            return back()->with('error', 'Failed to duplicate template. Please try again.');
        }
    }

    /**
     * Generate unique slug for template.
     */
    private function generateUniqueSlug(string $name, ?int $excludeId = null): string
    {
        $slug         = Str::slug($name);
        $originalSlug = $slug;
        $counter      = 1;

        while (true) {
            $query = Template::where('slug', $slug);

            if ($excludeId) {
                $query->where('id', '!=', $excludeId);
            }

            if (! $query->exists()) {
                break;
            }

            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }

    /**
     * Show the Canva editor page.
     */
    public function canvaEditor()
    {
        $admin = auth()->guard('admin')->user();

        $categories = [
            ['id' => 1, 'name' => 'Birthday', 'slug' => 'birthday'],
            ['id' => 2, 'name' => 'Wedding', 'slug' => 'wedding'],
            ['id' => 3, 'name' => 'Festival', 'slug' => 'festival'],
            ['id' => 4, 'name' => 'Quotes', 'slug' => 'quotes'],
            ['id' => 5, 'name' => 'Anniversary', 'slug' => 'anniversary'],
            ['id' => 6, 'name' => 'Graduation', 'slug' => 'graduation'],
            ['id' => 7, 'name' => 'Holiday', 'slug' => 'holiday'],
            ['id' => 8, 'name' => 'Business', 'slug' => 'business'],
            ['id' => 9, 'name' => 'Social', 'slug' => 'social'],
            ['id' => 10, 'name' => 'General', 'slug' => 'general'],
        ];

        return Inertia::render('admin/templates/canva-editor', [
            'admin'      => $admin,
            'auth'       => [
                'user' => $admin,
            ],
            'categories' => $categories,
        ]);
    }

    /**
     * Generate thumbnail from JSON layout.
     */
    private function generateThumbnail(array $jsonLayout): ?string
    {
        // This would integrate with a thumbnail generation service
        // For now, return null to use the default placeholder
        return null;
    }
}
