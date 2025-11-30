<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Resources\Users\UserResource;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AppearanceController extends Controller
{
	public function edit(Request $request): Response
	{
		return Inertia::render('settings/appearance', [
			'user' => new UserResource(
				$request->user()->load(['avatar', 'background'])
			),
		]);
	}
}
