<?php

/**
 * Laravel - A PHP Framework For Web Artisans
 *
 * @package  Laravel
 * @author   Taylor Otwell <taylor@laravel.com>
 */

// Ensure Vercel /tmp storage directories exist
if (isset($_ENV['VERCEL']) || getenv('VERCEL')) {
    $storage = '/tmp/storage';
    $dirs = [
        $storage.'/framework/cache/data',
        $storage.'/framework/views',
        $storage.'/framework/sessions',
        $storage.'/logs',
    ];
    foreach ($dirs as $dir) {
        if (!is_dir($dir)) mkdir($dir, 0777, true);
    }
}

require __DIR__ . '/../public/index.php';
