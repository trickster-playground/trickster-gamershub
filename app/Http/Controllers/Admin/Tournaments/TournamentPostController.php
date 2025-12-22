<?php

namespace App\Http\Controllers\Admin\Tournaments;

use App\Http\Controllers\Controller;
use App\Http\Resources\Tournaments\TournamentPostResource;
use App\Http\Resources\Users\UserResource;
use App\Models\Tournaments\Tournament;
use App\Models\Tournaments\TournamentAttachment;
use App\Models\Tournaments\TournamentCategory;
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
	public function store(Request $request)
	{

		$validated = $request->validate([
			'title' => ['required', 'string', 'max:50'],
			'category_id' => ['required', 'exists:tournament_categories,id'],
			'description' => ['nullable', 'string'],
			'tags' => ['nullable', 'string'],

			'prize_pool' => ['nullable', 'integer', 'min:0'],
			'max_participants' => ['nullable', 'integer', 'min:1'],

			'location' => ['nullable', 'string'],
			'latitude' => ['nullable', 'numeric'],
			'longitude' => ['nullable', 'numeric'],

			'registration_start' => ['required', 'date'],
			'registration_end' => ['required', 'date', 'after_or_equal:registration_start'],
			'start_date' => ['required', 'date'],
			'end_date' => ['required', 'date', 'after_or_equal:start_date'],

			'status' => ['required', 'string'],
			'is_featured' => ['boolean'],
			'is_published' => ['boolean'],

			'banner' => ['required', 'image', 'max:5120'],
			'thumbnail' => ['required', 'image', 'max:2048'],
		]);

		DB::beginTransaction();

		try {
			/** 1️⃣ CREATE TOURNAMENT */
			$tournament = Tournament::create($validated);

			/** 2️⃣ SAVE FILES (BANNER & THUMBNAIL) */
			foreach (['banner', 'thumbnail'] as $type) {
				if (!$request->hasFile($type)) continue;

				$file = $request->file($type);

				$path = $file->store(
					"tournaments/posts/{$tournament->id}/{$type}",
					'public'
				);

				$tournament->attachments()->create([
					'file_name' => $file->getClientOriginalName(),
					'size' => $file->getSize(),
					'type' => $type,
					'path' => $path,
				]);
			}

			DB::commit();

			return redirect()
				->route('admin.tournaments')
				->with('success', 'Tournament created successfully!');
		} catch (\Throwable $e) {
			DB::rollBack();
			report($e);

			return redirect()->back()->with('error', 'Failed to create tournament.');
		}
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
	public function update(Request $request, string $slug)
	{
		$tournament = Tournament::where('slug', $slug)->firstOrFail();

		$validated = $request->validate([
			'title' => ['required', 'string', 'max:50'],
			'category_id' => ['required', 'exists:tournament_categories,id'],
			'description' => ['nullable', 'string'],
			'tags' => ['nullable', 'string'],

			'prize_pool' => ['nullable', 'integer', 'min:0'],
			'max_participants' => ['nullable', 'integer', 'min:1'],

			'location' => ['nullable', 'string'],
			'latitude' => ['nullable', 'numeric'],
			'longitude' => ['nullable', 'numeric'],

			'registration_start' => ['required', 'date'],
			'registration_end' => ['required', 'date', 'after_or_equal:registration_start'],
			'start_date' => ['required', 'date'],
			'end_date' => ['required', 'date', 'after_or_equal:start_date'],

			'status' => ['required', 'string'],
			'is_featured' => ['boolean'],
			'is_published' => ['boolean'],

			// ⬇️ FILE TIDAK WAJIB SAAT UPDATE
			'banner' => ['nullable', 'image', 'max:5120'],
			'thumbnail' => ['nullable', 'image', 'max:2048'],
		]);

		DB::beginTransaction();

		try {
			/** 1️⃣ UPDATE DATA TOURNAMENT */
			$tournament->update($validated);

			/** 2️⃣ HANDLE FILE UPDATE */
			foreach (['banner', 'thumbnail'] as $type) {
				if (!$request->hasFile($type)) continue;

				$file = $request->file($type);

				/** cari attachment lama */
				$oldAttachment = $tournament
					->attachments()
					->where('type', $type)
					->first();

				/** hapus file lama */
				if ($oldAttachment) {
					Storage::disk('public')->delete($oldAttachment->path);
					$oldAttachment->delete();
				}

				/** simpan file baru */
				$path = $file->store(
					"tournaments/posts/{$tournament->id}/{$type}",
					'public'
				);

				$tournament->attachments()->create([
					'file_name' => $file->getClientOriginalName(),
					'size' => $file->getSize(),
					'type' => $type,
					'path' => $path,
				]);
			}

			DB::commit();

			return redirect()
				->route('admin.tournaments')
				->with('success', 'Tournament updated successfully!');
		} catch (\Throwable $e) {
			DB::rollBack();
			report($e);

			return redirect()
				->back()
				->with('error', 'Failed to update tournament.');
		}
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
