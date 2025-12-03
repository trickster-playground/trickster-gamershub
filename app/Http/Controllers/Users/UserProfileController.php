<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use App\Http\Resources\Users\UserProfileResource;
use App\Http\Resources\Users\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;

class UserProfileController extends Controller
{
	/**
	 * Show the user's profile page.
	 */
	public function show(Request $request, $username): Response
	{
		$currentUser = Auth::id();

		// All relations for page profile
		$withRelations = [
			'avatar',
			'background',

			'posts' => fn($q) => $q->latest()
				->with(
					'user.avatar',
					'attachments',
					'comments.user.avatar',
				)
				->withCount(['likes', 'comments'])
				->withExists([
					'likes as is_liked' => fn($q) => $q->where('user_id', $currentUser),
					'saves as is_saved' => fn($q) => $q->where('user_id', $currentUser),
				]),

			'likedPosts' => fn($q) => $q->latest()
				->with(
					'user.avatar',
					'attachments',
					'comments.user.avatar',
				)
				->withCount(['likes', 'comments'])
				->withExists([
					'likes as is_liked' => fn($q) => $q->where('user_id', $currentUser),
					'saves as is_saved' => fn($q) => $q->where('user_id', $currentUser),
				]),

			'savedPosts' => fn($q) => $q->latest()
				->with(
					'user.avatar',
					'attachments',
					'comments.user.avatar',
				)
				->withCount(['likes', 'comments'])
				->withExists([
					'likes as is_liked' => fn($q) => $q->where('user_id', $currentUser),
					'saves as is_saved' => fn($q) => $q->where('user_id', $currentUser),
				]),
		];

		// Get user based on username + relation
		$userProfile = User::with($withRelations)
			->where('username', $username)
			->firstOrFail();

		return Inertia::render('users/profile', [
			// Target user profile → use UserProfileResource
			'userProfile' => new UserProfileResource($userProfile),

			// User login → still use UserResource
			'user' => new UserResource(
				$request->user()?->load(['avatar', 'background'])
			),

			// Is this page a logged in user profile?
			'currentUser' => Auth::check() && Auth::id() === $userProfile->id,
		]);
	}
}
