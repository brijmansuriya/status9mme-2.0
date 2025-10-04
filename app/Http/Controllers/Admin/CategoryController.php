<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CategoryRequest;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $admin = auth()->guard('admin')->user();

        // Debug: Log the request
        \Log::info('CategoryController@index called', [
            'user'    => $admin ? $admin->name : 'Not authenticated',
            'request' => $request->all(),
        ]);

        $query = Category::query();

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Status filter
        if ($request->filled('status')) {
            $query->where('status', $request->get('status'));
        }

        // Sort by
        $sortBy    = $request->get('sort_by', 'sort_order');
        $sortOrder = $request->get('sort_order', 'asc');
        $query->orderBy($sortBy, $sortOrder);

        $categories = $query->paginate(10)->withQueryString();

        return Inertia::render('admin/categories/index', [
            'admin'      => $admin,
            'auth'       => [
                'user' => $admin,
            ],
            'categories' => $categories,
            'filters'    => $request->only(['search', 'status', 'sort_by', 'sort_order']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $admin = auth()->guard('admin')->user();

        return Inertia::render('admin/categories/create', [
            'admin' => $admin,
            'auth'  => [
                'user' => $admin,
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CategoryRequest $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->validated();

            // Generate unique slug
            $data['slug'] = $this->generateUniqueSlug($data['name']);

            Category::create($data);

            DB::commit();

            return redirect()->route('admin.categories.index')
                ->with('success', 'Category created successfully.');
        } catch (\Exception $e) {
            DB::rollback();

            return back()->withInput()
                ->with('error', 'Failed to create category. Please try again.');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        $admin = auth()->guard('admin')->user();

        return Inertia::render('admin/categories/show', [
            'admin'    => $admin,
            'auth'     => [
                'user' => $admin,
            ],
            'category' => $category,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $category)
    {
        $admin = auth()->guard('admin')->user();

        return Inertia::render('admin/categories/edit', [
            'admin'    => $admin,
            'auth'     => [
                'user' => $admin,
            ],
            'category' => $category,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CategoryRequest $request, Category $category)
    {
        DB::beginTransaction();
        try {
            $data = $request->validated();

            // Generate unique slug if name changed
            if ($data['name'] !== $category->name) {
                $data['slug'] = $this->generateUniqueSlug($data['name'], $category->id);
            }

            $category->update($data);

            DB::commit();

            return redirect()->route('admin.categories.index')
                ->with('success', 'Category updated successfully.');
        } catch (\Exception $e) {
            DB::rollback();

            return back()->withInput()
                ->with('error', 'Failed to update category. Please try again.');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        DB::beginTransaction();
        try {
            \Log::info('CategoryController@destroy called', [
                'category_id'   => $category->id,
                'category_name' => $category->name,
            ]);

            $categoryName = $category->name;
            $category->delete();

            DB::commit();

            return redirect()->route('admin.categories.index')
                ->with('success', "Category '{$categoryName}' deleted successfully.");
        } catch (\Exception $e) {
            DB::rollback();

            \Log::error('CategoryController@destroy error', [
                'error'       => $e->getMessage(),
                'category_id' => $category->id,
            ]);

            return back()->with('error', 'Failed to delete category. Please try again.');
        }
    }

    /**
     * Toggle category status.
     */
    public function toggleStatus(Category $category)
    {
        DB::beginTransaction();
        try {
            \Log::info('CategoryController@toggleStatus called', [
                'category_id'    => $category->id,
                'category_name'  => $category->name,
                'current_status' => $category->status,
            ]);

            $category->update([
                'status' => $category->status === 'active' ? 'inactive' : 'active',
            ]);

            DB::commit();

            $status = $category->status === 'active' ? 'activated' : 'deactivated';

            return back()->with('success', "Category '{$category->name}' has been {$status}.");
        } catch (\Exception $e) {
            DB::rollback();

            \Log::error('CategoryController@toggleStatus error', [
                'error'       => $e->getMessage(),
                'category_id' => $category->id,
            ]);

            return back()->with('error', 'Failed to update category status. Please try again.');
        }
    }

    /**
     * Generate unique slug for category.
     */
    private function generateUniqueSlug(string $name, ?int $excludeId = null): string
    {
        $slug         = Str::slug($name);
        $originalSlug = $slug;
        $counter      = 1;

        while (true) {
            $query = Category::where('slug', $slug);

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
}
