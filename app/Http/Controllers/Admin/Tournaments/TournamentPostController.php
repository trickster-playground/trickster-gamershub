<?php

namespace App\Http\Controllers\Admin\Tournaments;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tournaments\TournamentPostStoreRequest;
use App\Http\Requests\Tournaments\TournamentPostUpdateRequest;
use App\Http\Resources\Tournaments\TournamentPostResource;
use App\Http\Resources\Users\UserResource;
use App\Models\Tournaments\Tournament;
use App\Models\Tournaments\TournamentAttachment;
use App\Models\Tournaments\TournamentCategory;
use App\Services\Tournaments\TournamentPostService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TournamentPostController extends Controller
{
	/**
	 * Display a listing of the resource.
	 */
	public function index(Request $request)
	{
		$tournamentPosts = Tournament::with([
			'category',
			'attachments',
			'user',
		])->latest()->get();

		return Inertia::render('admin/tournaments/posts/index', [
			'user' => new UserResource(
				$request->user()->load(['avatar', 'background'])
			),

			'tournamentPosts' => $tournamentPosts,
		]);
	}

	/**
	 * Show the form for creating a new resource.
	 */
	public function create(Request $request)
	{

		$categories = TournamentCategory::query()->select('id', 'name', 'color')->orderBy('name')->get();

		return Inertia::render('admin/tournaments/posts/create', [
			'user' => new UserResource(
				$request->user()->load(['avatar', 'background'])
			),

			'categories' => $categories
		]);
	}

	/**
	 * Store a newly created resource in storage.
	 */
	public function store(TournamentPostStoreRequest $request, TournamentPostService $service)
	{
		$service->store($request->validated(), $request);

		return redirect()
			->route('admin.tournaments')
			->with('success', 'Tournament created successfully!');
	}


	/**
	 * Show the form for editing the specified resource.
	 */
	public function edit(Request $request, $slug)
	{
		$categories = TournamentCategory::query()->select('id', 'name', 'color')->orderBy('name')->get();
		$tournamentPostData = Tournament::where('slug', $slug)->with('attachments')->firstOrFail();

		return Inertia::render('admin/tournaments/posts/edit', [
			'user' => new UserResource(
				$request->user()->load(['avatar', 'background'])
			),
			'tournamentPostData' => $tournamentPostData,

			'categories' => $categories
		]);
	}

	/**
	 * Update the specified resource in storage.
	 */
	public function update(TournamentPostUpdateRequest $request, string $slug, TournamentPostService $service)
	{
		$tournament = Tournament::where('slug', $slug)->firstOrFail();

		$service->update($tournament, $request->validated(), $request);

		return redirect()
			->route('admin.tournaments')
			->with('success', 'Tournament updated successfully!');
	}


	/**
	 * Remove the specified resource from storage.
	 */
	public function destroy(string $slug)
	{
		$tournament = Tournament::where('slug', $slug)
			->with('attachments')
			->firstOrFail();

		DB::beginTransaction();

		try {
			/** 1️⃣ DELETE FILES FROM STORAGE */
			foreach ($tournament->attachments as $attachment) {
				if ($attachment->path && Storage::disk('public')->exists($attachment->path)) {
					Storage::disk('public')->delete($attachment->path);
				}
			}

			/** 2️⃣ DELETE ATTACHMENTS RECORD */
			$tournament->attachments()->delete();

			/** 3️⃣ DELETE TOURNAMENT */
			$tournament->delete();

			DB::commit();

			return redirect()
				->route('admin.tournaments')
				->with('success', 'Tournament deleted successfully.');
		} catch (\Throwable $e) {
			DB::rollBack();
			report($e);

			return redirect()
				->back()
				->with('error', 'Failed to delete tournament.');
		}
	}
}
