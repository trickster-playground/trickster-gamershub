<?php

use App\Http\Controllers\Settings\AvatarController;
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\TwoFactorAuthenticationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {
	// Redirect to profile settings as default
	Route::redirect('settings', '/settings/profile');
	Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
	Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
	Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

	// Avatar Settings
	Route::get('settings/avatar', [AvatarController::class, 'edit'])->name('avatar.edit');
	Route::patch('/settings/avatar', [AvatarController::class, 'update'])->name('avatar.update');

	// Password Settings
	Route::get('settings/password', [PasswordController::class, 'edit'])->name('user-password.edit');
	Route::put('settings/password', [PasswordController::class, 'update'])
		->middleware('throttle:6,1')
		->name('user-password.update');

	// Appearance Settings
	Route::get('settings/appearance', function () {
		return Inertia::render('settings/appearance');
	})->name('appearance.edit');

	// Two-Factor Authentication Settings
	Route::get('settings/two-factor', [TwoFactorAuthenticationController::class, 'show'])
		->name('two-factor.show');
});
