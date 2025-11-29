<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Resources\Users\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AvatarController extends Controller
{
	/**
	 * Show the user's avatar & background settings page.
	 */
	public function edit(Request $request): Response
	{
		return Inertia::render('settings/avatar', [
			'user' => new UserResource(
				$request->user()->load(['avatar', 'background'])
			),
		]);
	}


	/**
	 * Update the user's avatar.
	 */
	public function update(Request $request)
	{
		$request->validate([
			'avatar' => 'nullable|image|max:2048',     // avatar
			'background' => 'nullable|image|max:4096', // background
		]);

		$user = Auth::user();

		// Handle Avatar Upload
		if ($request->hasFile('avatar')) {

			// Search for old avatars
			$oldAvatar = $user->attachments()->where('type', 'avatar')->first();

			// Delete old files (not folders)
			if ($oldAvatar) {
				Storage::disk('public')->delete($oldAvatar->path);
			}

			// Upload new file (folder remains unchanged)
			$path = $request->file('avatar')->store("attachments/{$user->id}/avatar", 'public');

			$user->attachments()->updateOrCreate(
				['type' => 'avatar'],
				['path' => $path]
			);
		}


		// Handle Background Upload
		if ($request->hasFile('background')) {
			// Search for old backgrounds
			$oldBackground = $user->attachments()->where('type', 'background')->first();

			// Delete old files (not folders)
			if ($oldBackground) {
				Storage::disk('public')->delete($oldBackground->path);
			}
			// Upload new file (folder remains unchanged)
			$path = $request->file('background')->store("attachments/{$user->id}/background", 'public');

			$user->attachments()->updateOrCreate(
				['type' => 'background'],
				['path' => $path]
			);
		}

		return back()->with('success', 'Updated successfully!');
	}
}
