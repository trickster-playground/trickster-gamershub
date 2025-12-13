<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\Tournaments\TournamentCategoryController;
use Illuminate\Support\Facades\Route;

// Administrator - Dashboard Route
Route::middleware(['auth', 'role:administrator'])->group(function () {
	Route::get('/administrator/dashboard', [DashboardController::class, 'index'])->name('admin.dashboard');
});

// Administrator - Tournament Category Route
Route::middleware(['auth', 'role:administrator'])->group(function () {
	Route::get('/administrator/category', [TournamentCategoryController::class, 'index'])->name('admin.category');
	Route::get('/administrator/category/create', [TournamentCategoryController::class, 'create'])->name('admin.category.create');

	Route::post('/administrator/category/create', [TournamentCategoryController::class, 'store'])->name('admin.category.store');

	Route::get('/administrator/category/{slug}/edit', [TournamentCategoryController::class, 'edit'])->name('admin.category.edit');
	Route::patch('/administrator/category/{slug}/edit', [TournamentCategoryController::class, 'update'])->name('admin.category.update');

	Route::delete('/administrator/category/{slug}', [TournamentCategoryController::class, 'destroy'])->name('admin.category.destroy');
});
