<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use App\Http\Resources\Users\UserResource;
use App\Models\Users\UserSocialLink;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
	/**
	 * Show the user's profile settings page.
	 */
	public function edit(Request $request): Response
	{
		return Inertia::render('settings/profile', [
			'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
			'status' => $request->session()->get('status'),
			'user' => new UserResource(
				$request->user()->load(['socialLinks','avatar','background'])
			),
		]);
	}

	/**
	 * Update the user's profile settings.
	 */
	public function update(ProfileUpdateRequest $request): RedirectResponse
	{
		$request->user()->fill($request->validated());

		foreach ($request->input('socialLinks', []) as $link) {
			$request->user()->socialLinks()->updateOrCreate(
				['platform' => $link['platform']],
				['url' => $link['url']]
			);
		}

		if ($request->user()->isDirty('email')) {
			$request->user()->email_verified_at = null;
		}

		$request->user()->save();

		return to_route('profile.edit');
	}

	/**
	 * Delete the user's account.
	 */
	public function destroy(Request $request): RedirectResponse
	{
		$request->validate([
			'password' => ['required', 'current_password'],
		]);

		$user = $request->user();

		Auth::logout();

		$user->delete();

		$request->session()->invalidate();
		$request->session()->regenerateToken();

		return redirect('/');
	}

	/**
	 * Delete the user's social link.
	 *
	 * @param int $id
	 * @return \Illuminate\Http\RedirectResponse
	 */
	public function destroySocialLink($id)
	{
		$socialLink = UserSocialLink::findOrFail($id);

		if ($socialLink->user_id !== Auth::id()) {
			abort(403, 'Unauthorized action.');
		}

		$socialLink->delete();

		return back();
	}
}
