<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Users\UserResource;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
	/**
	 * Display a listing of the resource.
	 */
	public function index(Request $request)
	{
		return Inertia::render('admin/dashboard', [
			'user' => new UserResource(
				$request->user()->load(['avatar', 'background'])
			),
		]);
	}
}
