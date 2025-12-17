<?php

namespace App\Http\Controllers\Admin\Tournaments;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tournaments\TournamentCategoryStoreRequest;
use App\Http\Requests\Tournaments\TournamentCategoryUpdateRequest;
use App\Http\Resources\Tournaments\TournamentCategoryResource;
use App\Http\Resources\Users\UserResource;
use App\Models\Tournaments\TournamentCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class TournamentCategoryController extends Controller
{
	/**
	 * Display a listing of the resource.
	 */
	public function index(Request $request)
	{
		$tournamentCategories = TournamentCategoryResource::collection(
			TournamentCategory::orderBy('id', 'desc')->get()
		)->toArray($request);

		return Inertia::render('admin/tournaments/categories/index', [
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
		return Inertia::render('admin/tournaments/categories/create', [
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
					"tournaments/categories/{$category->id}",
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
	public function edit($slug)
	{
		$tournamentCategory = TournamentCategory::where('slug', $slug)->firstOrFail();

		return Inertia::render('admin/tournaments/categories/edit', [
			'tournamentCategory' => new TournamentCategoryResource($tournamentCategory),
		]);
	}


	/**
	 * Update the specified resource in storage.
	 */
	public function update(TournamentCategoryUpdateRequest $request, $slug)
	{
		DB::beginTransaction();

		try {
			// Get category based on slug
			$category = TournamentCategory::where('slug', $slug)
				->firstOrFail();

			// Update fields
			$category->update([
				'name'        => $request->name,
				'description' => $request->description,
				'color'       => $request->color,
			]);

			// Update icon
			if ($request->hasFile('icon')) {

				// Delete old icon
				if ($category->icon && Storage::disk('public')->exists($category->icon)) {
					Storage::disk('public')->delete($category->icon);
				}

				// Upload new icon
				$path = $request->file('icon')->store(
					"tournaments/categories/{$category->id}",
					'public'
				);

				$category->update([
					'icon' => $path,
				]);
			}

			DB::commit();

			return redirect()->route('admin.category')
				->with('success', 'Tournament category updated successfully!');
		} catch (\Exception $e) {
			DB::rollBack();

			return back()
				->withErrors(['error' => $e->getMessage()]);
		}
	}



	/**
	 * Remove the specified resource from storage.
	 */
	public function destroy(string $slug)
	{
		$tournamentCategory = TournamentCategory::where('slug', $slug)->firstOrFail();

		// Delete associated icon from storage
		if ($tournamentCategory->icon) {

			// Delete file icon
			Storage::disk('public')->delete($tournamentCategory->icon);

			// Delete folder from ID
			$folderPath = 'tournaments/categories/' . $tournamentCategory->id;
			Storage::disk('public')->deleteDirectory($folderPath);
		}

		// Delete data
		$tournamentCategory->delete();

		return redirect()->route('admin.category')
			->with('success', 'Tournament category deleted successfully.');
	}
}
