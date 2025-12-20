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
}
