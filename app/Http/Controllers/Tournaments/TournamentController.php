<?php

namespace App\Http\Controllers\Tournaments;

use App\Http\Controllers\Controller;
use App\Http\Resources\Users\UserResource;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TournamentController extends Controller
{
	/**
	 * Display a listing of the resource.
	 */
	public function index(Request $request)
	{
		return Inertia::render('tournaments/tournament-page', [
			'user' => new UserResource(
				$request->user()->load(['avatar', 'background'])
			),
		]);
	}
}
