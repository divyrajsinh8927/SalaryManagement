<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = \App\Models\User::first() ?? \App\Models\User::factory()->create();
Auth::login($user);

$salaries = collect();
$latestSalary = null;
$errors = new \Illuminate\Support\MessageBag();
View::share('errors', $errors);

$view = view('salaries.index', compact('salaries', 'latestSalary'))->render();
file_put_contents('test_view.html', $view);
echo "View rendered successfully!";
