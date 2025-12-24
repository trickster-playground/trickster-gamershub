<?php

namespace App\Http\Controllers\Tournaments;

use App\Http\Controllers\Controller;
use App\Http\Resources\Tournaments\TournamentCategoryResource;
use App\Http\Resources\Tournaments\TournamentPostResource;
use App\Http\Resources\Users\UserResource;
use App\Models\Tournaments\Tournament;
use App\Models\Tournaments\TournamentCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TournamentController extends Controller
{
	/**
	 * Display a listing of the resource.
	 */
	public function index(Request $request)
	{
		$tournamentCategories = TournamentCategoryResource::collection(
			TournamentCategory::orderBy('id', 'desc')->get()
		)->toArray($request);

		$featured = Tournament::query()
			->with([
				'category',
				'attachments',
				'user',
				'user.avatar'
			])
			->published()
			->featured()
			->latest()
			->take(5)
			->get();

		$tournaments = Tournament::query()
			->with([
				'category',
				'attachments',
				'user',
				'user.avatar'
			])
			->published()
			->latest()
			->paginate(12);

		return Inertia::render('tournaments/index', [
			'user' => new UserResource(
				$request->user()->load(['avatar', 'background'])
			),
			'tournamentCategories' => $tournamentCategories,
			'featuredTournaments' => TournamentPostResource::collection($featured)->resolve(),
			'tournaments' => TournamentPostResource::collection($tournaments),
		]);
	}

	/**
	 * Display the specified resource.
	 */
	public function show(Request $request, string $slug)
	{
		$tournament = Tournament::with(['category', 'attachments', 'user', 'user.avatar'])->firstOrFail();

		return Inertia::render('tournaments/show', [
			'user' => new UserResource(
				$request->user()->load(['avatar', 'background'])
			),
			'tournament' => $tournament
		]);
	}
}
