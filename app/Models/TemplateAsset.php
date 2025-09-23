<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TemplateAsset extends Model
{
    use HasFactory;

    protected $fillable = [
        'template_id',
        'asset_id',
        'layer_name',
        'layer_config',
        'sort_order',
    ];

    protected $casts = [
        'layer_config' => 'array',
    ];

    public function template(): BelongsTo
    {
        return $this->belongsTo(Template::class);
    }

    public function asset(): BelongsTo
    {
        return $this->belongsTo(Asset::class);
    }
}
