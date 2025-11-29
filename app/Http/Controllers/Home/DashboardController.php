<?php

namespace App\Http\Controllers\Home;

use App\Http\Controllers\Controller;
use App\Http\Resources\Users\UserResource;
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
		return Inertia::render('dashboard', [
			'user' => new UserResource(
				$request->user()->load(['avatar', 'background'])
			),
		]);
	}
}
