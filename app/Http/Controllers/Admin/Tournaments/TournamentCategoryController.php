<?php

namespace App\Http\Controllers\Admin\Tournaments;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tournaments\TournamentCategoryStoreRequest;
use App\Http\Resources\Users\UserResource;
use App\Models\Tournaments\TournamentCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

use Illuminate\Support\Facades\DB;

class TournamentCategoryController extends Controller
{
	/**
	 * Display a listing of the resource.
	 */
	public function index(Request $request)
	{
		$tournamentCategories = TournamentCategory::select(
			'id',
			'name',
			'icon',
			'slug',
			'description',
			'color',
			'created_at'
		)
			->orderBy('id', 'desc')
			->get();

		return Inertia::render('admin/tournaments/categories/index-category', [
			'user' => new UserResource(
				$request->user()->load(['avatar', 'background'])
			),

			'tournamentCategories' => $tournamentCategories,
		]);
	}


	/**
	 * Show the form for creating a new resource.
	 */
	public function create(Request $request)
	{
		return Inertia::render('admin/tournaments/categories/create-category', [
			'user' => new UserResource(
				$request->user()->load(['avatar', 'background'])
			),
		]);
	}

	/**
	 * Store a newly created resource in storage.
	 */
	public function store(TournamentCategoryStoreRequest $request)
	{
		DB::beginTransaction();

		try {
			// Create category first (slug auto generated)
			$category = TournamentCategory::create([
				'name'        => $request->name,
				'description' => $request->description,
				'color'       => $request->color,
			]);

			// Upload icon if exists
			if ($request->hasFile('icon')) {

				$path = $request->file('icon')->store(
					"attachments/tournaments/categories/{$category->id}",
					'public'
				);

				$category->update([
					'icon' => $path,
				]);
			}

			DB::commit();

			return redirect(route('admin.category'))->with('success', 'Tournament category created successfully!');
		} catch (\Exception $e) {
			DB::rollBack();

			return back()->withErrors([
				'error' => $e->getMessage()
			]);
		}
	}


	/**
	 * Display the specified resource.
	 */
	public function show(string $id)
	{
		//
	}

	/**
	 * Show the form for editing the specified resource.
	 */
	public function edit(string $id)
	{
		//
	}

	/**
	 * Update the specified resource in storage.
	 */
	public function update(Request $request, string $id)
	{
		//
	}

	/**
	 * Remove the specified resource from storage.
	 */
	public function destroy(string $id)
	{
		//
	}
}
