<?php

namespace App\Http\Controllers\Home;

use App\Http\Controllers\Controller;
use App\Http\Resources\Posts\PostResource;
use App\Http\Resources\Users\UserResource;
use App\Models\Posts\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
	/**
	 * Show the home page.
	 */
	public function index(Request $request): Response
	{
		$user = Auth::id();

		$posts = Post::with([
			'user.avatar',
			'attachments',
			'comments.user.avatar',
		])
			->withCount(['likes', 'comments'])
			->withExists([
				'likes as is_liked' => fn($q) => $q->where('user_id', $user),
				'saves as is_saved' => fn($q) => $q->where('user_id', $user),
			])
			->orderBy('created_at', 'desc')->get();

		return Inertia::render('dashboard', [
			'user' => new UserResource(
				$request->user()->load(['avatar', 'background'])
			),
			'posts' => PostResource::collection($posts)->resolve(),
		]);
	}
}
