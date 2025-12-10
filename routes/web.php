<?php

use App\Http\Controllers\Admin\Tournaments\TournamentCategoryController;
use App\Http\Controllers\Home\DashboardController;
use App\Http\Controllers\Posts\PostCommentController;
use App\Http\Controllers\Posts\PostController;
use App\Http\Controllers\Posts\PostInteractionController;
use App\Http\Controllers\Users\UserProfileController;
use App\Http\Controllers\Users\UserRelationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
	return Inertia::render('welcome', [
		'canRegister' => Features::enabled(Features::registration()),
	]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
	Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
});

// Users Route
Route::get('/user/{username}', [UserProfileController::class, 'show'])->name('user.profile');

// User Relation Route
Route::middleware('auth')->group(function () {
	Route::post('/users/{user}/follow', [UserRelationController::class, 'follow'])->name('follow');
	Route::delete('/users/{user}/unfollow', [UserRelationController::class, 'unfollow'])->name('unfollow');

	Route::get('/users/{user}/followers', [UserRelationController::class, 'followers'])->name('followers');
	Route::get('/users/{user}/followings', [UserRelationController::class, 'followings'])->name('followings');
});

// Posts Route
Route::middleware(['auth'])->group(function () {
	Route::get('/posts/create', [PostController::class, 'create'])->name('post.create');
	Route::post('/posts/create', [PostController::class, 'store'])->name('post.store');

	Route::get('/posts/{slug}/edit', [PostController::class, 'edit'])->name('post.edit');
	Route::patch('/posts/{slug}/edit', [PostController::class, 'update'])->name('post.update');

	Route::get('/posts/{username}/{slug}', [PostController::class, 'show'])->name('post.show');
	Route::delete('/posts/{slug}/delete', [PostController::class, 'destroy'])->middleware('auth')->name('posts.destroy');

	Route::post('/post/{id}/like', [PostInteractionController::class, 'likePost'])->name('post.like');
	Route::post('/post/{id}/save', [PostInteractionController::class, 'savePost'])->name('post.save');

	Route::post('/post/comment/store', [PostCommentController::class, 'store'])->middleware('auth')->name('comment.store');
	Route::patch('/post/comment/{id}/update', [PostCommentController::class, 'update'])->middleware('auth')->name('comment.update');
	Route::post('/post/comment/{id}/delete', [PostCommentController::class, 'destroy'])->middleware('auth')->name('comment.destroy');
});

// Tournament Category Route
Route::middleware(['auth'])->group(function () {
	Route::get('/administrator/category', [TournamentCategoryController::class, 'index'])->name('admin.category');
	Route::get('/administrator/category/create', [TournamentCategoryController::class, 'create'])->name('admin.category.create');

	Route::post('/administrator/category/create', [TournamentCategoryController::class, 'store'])->name('admin.category.store');
});



require __DIR__ . '/settings.php';
