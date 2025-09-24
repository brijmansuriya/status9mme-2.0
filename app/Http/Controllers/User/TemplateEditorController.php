<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\TemplatePreviewRequest;
use App\Http\Requests\User\TemplateExportRequest;
use App\Models\Template;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TemplateEditorController extends Controller
{
    /**
     * Show the template editor for user customization
     */
    public function show(Template $template)
    {
        $template->load('category', 'assets');
        
        return Inertia::render('Templates/Editor', [
            'template' => $template,
        ]);
    }

    /**
     * Generate preview with customizations
     */
    public function preview(TemplatePreviewRequest $request, Template $template)
    {
        $customizations = $request->validated()['customizations'];
        
        // Apply customizations to template config
        $config = $template->json_config;
        
        if (isset($config['layers'])) {
            foreach ($config['layers'] as $index => &$layer) {
                $key = $layer['type'] . '_' . $index;
                
                if (isset($customizations[$key])) {
                    $customization = $customizations[$key];
                    
                    switch ($layer['type']) {
                        case 'text':
                            if (isset($customization['content'])) {
                                $layer['content'] = $customization['content'];
                            }
                            if (isset($customization['fontSize'])) {
                                $layer['fontSize'] = $customization['fontSize'];
                            }
                            if (isset($customization['color'])) {
                                $layer['color'] = $customization['color'];
                            }
                            if (isset($customization['fontFamily'])) {
                                $layer['fontFamily'] = $customization['fontFamily'];
                            }
                            if (isset($customization['textAlign'])) {
                                $layer['textAlign'] = $customization['textAlign'];
                            }
                            break;
                            
                        case 'image':
                            if (isset($customization['src'])) {
                                $layer['src'] = $customization['src'];
                            }
                            if (isset($customization['size'])) {
                                $layer['size'] = $customization['size'];
                            }
                            if (isset($customization['position'])) {
                                $layer['position'] = $customization['position'];
                            }
                            break;
                    }
                }
            }
        }

        return response()->json([
            'config' => $config,
            'preview_url' => $this->generatePreviewUrl($config),
        ]);
    }

    /**
     * Export video with customizations
     */
    public function export(TemplateExportRequest $request, Template $template)
    {
        $validated = $request->validated();
        $customizations = $validated['customizations'];
        $format = $validated['format'];
        $quality = $validated['quality'];
        
        // Apply customizations to template config
        $config = $this->applyCustomizations($template->json_config, $customizations);
        
        // Generate export job (this would integrate with DiffusionStudio/core)
        $exportJob = $this->createExportJob($config, $format, $quality);
        
        return response()->json([
            'job_id' => $exportJob['id'],
            'status' => 'processing',
            'download_url' => null, // Will be available when processing is complete
        ]);
    }

    /**
     * Check export status
     */
    public function exportStatus(Request $request, $jobId)
    {
        // This would check the actual export job status
        // For now, we'll simulate it
        return response()->json([
            'job_id' => $jobId,
            'status' => 'completed', // or 'processing', 'failed'
            'download_url' => '/exports/' . $jobId . '.mp4',
            'progress' => 100,
        ]);
    }

    /**
     * Apply customizations to template config
     */
    private function applyCustomizations($config, $customizations)
    {
        if (isset($config['layers'])) {
            foreach ($config['layers'] as $index => &$layer) {
                $key = $layer['type'] . '_' . $index;
                
                if (isset($customizations[$key])) {
                    $customization = $customizations[$key];
                    
                    switch ($layer['type']) {
                        case 'text':
                            if (isset($customization['content'])) {
                                $layer['content'] = $customization['content'];
                            }
                            if (isset($customization['fontSize'])) {
                                $layer['fontSize'] = $customization['fontSize'];
                            }
                            if (isset($customization['color'])) {
                                $layer['color'] = $customization['color'];
                            }
                            if (isset($customization['fontFamily'])) {
                                $layer['fontFamily'] = $customization['fontFamily'];
                            }
                            if (isset($customization['textAlign'])) {
                                $layer['textAlign'] = $customization['textAlign'];
                            }
                            break;
                            
                        case 'image':
                            if (isset($customization['src'])) {
                                $layer['src'] = $customization['src'];
                            }
                            if (isset($customization['size'])) {
                                $layer['size'] = $customization['size'];
                            }
                            if (isset($customization['position'])) {
                                $layer['position'] = $customization['position'];
                            }
                            break;
                    }
                }
            }
        }

        return $config;
    }

    /**
     * Generate preview URL (would integrate with DiffusionStudio/core)
     */
    private function generatePreviewUrl($config)
    {
        // This would call DiffusionStudio/core to generate a preview
        // For now, return a placeholder
        return '/api/preview/' . base64_encode(json_encode($config));
    }

    /**
     * Create export job (would integrate with DiffusionStudio/core)
     */
    private function createExportJob($config, $format, $quality)
    {
        // This would create an actual export job with DiffusionStudio/core
        // For now, return a mock job
        return [
            'id' => 'export_' . time() . '_' . rand(1000, 9999),
            'config' => $config,
            'format' => $format,
            'quality' => $quality,
            'status' => 'queued',
        ];
    }
}
