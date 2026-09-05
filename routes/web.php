<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    $latestSalary = Auth::user()->salaries()->latest()->first();
    return view('dashboard', compact('latestSalary'));
})->middleware(['auth', 'verified'])->name('dashboard');

use App\Http\Controllers\ThemeController;
use App\Http\Controllers\SalaryController;

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    Route::post('/theme', [ThemeController::class, 'update'])->name('theme.update');

    Route::resource('salaries', SalaryController::class)->only(['index', 'store', 'update', 'destroy']);
});

require __DIR__.'/auth.php';
