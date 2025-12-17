<?php

namespace App\Http\Controllers\Admin\Tournaments;

use App\Http\Controllers\Controller;
use App\Http\Resources\Tournaments\TournamentPostResource;
use App\Http\Resources\Users\UserResource;
use App\Models\Tournaments\Tournament;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TournamentPostController extends Controller
{
	/**
	 * Display a listing of the resource.
	 */
	public function index(Request $request)
	{
		$tournamentPosts = TournamentPostResource::collection(
			Tournament::orderBy('id', 'desc')->get()
		)->toArray($request);

		return Inertia::render('admin/tournaments/posts/index', [
			'user' => new UserResource(
				$request->user()->load(['avatar', 'background'])
			),
			'tournamentPosts' => $tournamentPosts,
		]);
	}
}
