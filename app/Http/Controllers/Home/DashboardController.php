<?php

namespace App\Http\Controllers\Home;

use App\Http\Controllers\Controller;
use App\Http\Resources\Posts\PostResource;
use App\Http\Resources\Users\UserResource;
use App\Models\Posts\Post;
use Illuminate\Http\Request;

use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
	/**
	 * Show the home page.
	 */
	public function index(Request $request): Response
	{

		$posts = Post::with([
			'user.avatar',
			'attachments',
		])->orderBy('created_at', 'desc')->get();

		return Inertia::render('dashboard', [
			'user' => new UserResource(
				$request->user()->load(['avatar', 'background'])
			),
			'posts' => PostResource::collection($posts)->resolve(),
		]);
	}
}
