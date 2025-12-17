<?php

namespace App\Http\Controllers\Tournaments;

use App\Http\Controllers\Controller;
use App\Http\Resources\Tournaments\TournamentCategoryResource;
use App\Http\Resources\Users\UserResource;
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

		return Inertia::render('tournaments/index', [
			'user' => new UserResource(
				$request->user()->load(['avatar', 'background'])
			),
			'tournamentCategories' => $tournamentCategories,
		]);
	}
}
