<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default Filesystem Disk
    |--------------------------------------------------------------------------
    |
    | Here you may specify the default filesystem disk that should be used
    | by the media library. The "local" disk, as well as a variety of cloud
    | based disks are available to your application. Just store away!
    |
    */

    'disk_name' => env('MEDIA_DISK', 'public'),

    /*
    |--------------------------------------------------------------------------
    | Maximum File Size
    |--------------------------------------------------------------------------
    |
    | The maximum file size of an item in bytes. Adding a larger file will result
    | in an exception.
    |
    */

    'max_file_size' => 1024 * 1024 * 100, // 100MB

    /*
    |--------------------------------------------------------------------------
    | Allowed File Types
    |--------------------------------------------------------------------------
    |
    | The file types that are allowed to be uploaded.
    |
    */

    'allowed_file_types' => [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'video/mp4',
        'video/webm',
        'video/quicktime',
        'audio/mpeg',
        'audio/wav',
        'audio/mp4',
        'application/json', // For Lottie files
    ],

    /*
    |--------------------------------------------------------------------------
    | Image Conversions
    |--------------------------------------------------------------------------
    |
    | Define the image conversions that should be performed on upload.
    |
    */

    'image_conversions' => [
        'thumb' => [
            'width' => 300,
            'height' => 300,
            'sharpen' => 10,
        ],
        'small' => [
            'width' => 600,
            'height' => 600,
            'sharpen' => 10,
        ],
        'medium' => [
            'width' => 1200,
            'height' => 1200,
            'sharpen' => 10,
        ],
        'large' => [
            'width' => 1920,
            'height' => 1920,
            'sharpen' => 10,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Video Conversions
    |--------------------------------------------------------------------------
    |
    | Define the video conversions that should be performed on upload.
    |
    */

    'video_conversions' => [
        'video_thumb' => [
            'width' => 400,
            'height' => 400,
            'extract_video_frame_at_second' => 1,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Media Collections
    |--------------------------------------------------------------------------
    |
    | Define the media collections that can be used to organize files.
    |
    */

    'collections' => [
        'files' => [
            'accepts_mime_types' => [
                'image/jpeg',
                'image/png',
                'image/gif',
                'image/webp',
                'video/mp4',
                'video/webm',
                'video/quicktime',
                'audio/mpeg',
                'audio/wav',
                'audio/mp4',
                'application/json',
            ],
            'single_file' => true,
        ],
        'thumbnails' => [
            'accepts_mime_types' => [
                'image/jpeg',
                'image/png',
                'image/webp',
            ],
            'single_file' => true,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Queue Configuration
    |--------------------------------------------------------------------------
    |
    | Configure the queue settings for media processing.
    |
    */

    'queue' => [
        'enabled' => env('MEDIA_QUEUE_ENABLED', false),
        'queue_name' => env('MEDIA_QUEUE_NAME', 'default'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Temporary Files
    |--------------------------------------------------------------------------
    |
    | Configure temporary file handling.
    |
    */

    'temporary_files' => [
        'disk' => env('MEDIA_TEMP_DISK', 'local'),
        'expiration' => 60 * 60 * 24, // 24 hours
    ],

    /*
    |--------------------------------------------------------------------------
    | Responsive Images
    |--------------------------------------------------------------------------
    |
    | Configure responsive image generation.
    |
    */

    'responsive_images' => [
        'enabled' => env('MEDIA_RESPONSIVE_IMAGES', true),
        'breakpoints' => [320, 640, 768, 1024, 1280, 1920],
    ],

];
