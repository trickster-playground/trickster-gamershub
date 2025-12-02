<?php

namespace App\Http\Controllers\Posts;

use App\Http\Controllers\Controller;
use App\Http\Requests\Posts\PostStoreRequest;
use App\Http\Requests\Posts\PostUpdateRequest;
use App\Http\Resources\Posts\PostResource;
use App\Http\Resources\Users\UserResource;
use App\Models\Posts\Post;
use App\Models\Posts\PostAttachment;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Auth;

class PostController extends Controller
{
	use AuthorizesRequests;
	/**
	 * Show the form for creating a new resource.
	 */
	public function create(Request $request)
	{
		return Inertia::render('posts/create-post', [
			'user' => new UserResource(
				$request->user()->load(['avatar', 'background'])
			),
		]);
	}

	/**
	 * Store a newly created resource in storage.
	 */
	public function store(PostStoreRequest $request)
	{

		$data = $request->validated();

		/** @var \Illuminate\Http\Request $request */
		$user = $request->user();

		DB::beginTransaction();
		$allFilePaths = [];
		try {
			$post = Post::create($data);

			$files = $data['files'];
			foreach ($files as $file) {
				$path = $file->store('attachments/' . $user->id . '/' . 'posts' . '/' . $post->id, 'public');
				$allFilePaths[] = $path;
				PostAttachment::create([
					'post_id' => $post->id,
					'file_name' => $file->getClientOriginalName(), // TODO: ganti dengan HASH
					'path' => $path,
					'modified' => $file->getMTime() * 1000,
					'type' => $file->getMimeType(),
					'size' => $file->getSize(),
				]);
			}

			DB::commit();
		} catch (\Exception $e) {
			foreach ($allFilePaths as $path) {
				Storage::disk('public')->delete($path);
			}
			DB::rollBack();
			return response()->json(['message' => 'Failed to update post', 'error' => $e->getMessage()], 500);
		}
		return redirect(route('dashboard'))->with('message', 'Post created successfully.');
	}

	/**
	 * Show the form for editing the specified resource.
	 */
	public function edit(Request $request, string $slug)
	{
		$post = Post::with('attachments')->where('slug', $slug)->firstOrFail();

		$this->authorize('owner', $post);

		return Inertia::render('posts/edit-post', [
			'post' => new PostResource($post),
			'user' => new UserResource(
				$request->user()->load(['avatar'])
			),
		]);
	}

	/**
	 * Update the specified resource in storage.
	 */
	public function update(PostUpdateRequest $request, $slug)
	{
		$deletedFiles = json_decode($request->input('deleted'), true);
		DB::beginTransaction();
		$allFilePaths = [];

		/** @var \Illuminate\Http\Request $request */
		try {
			$post = Post::where('slug', $slug)->firstOrFail();

			// Authorization check
			$this->authorize('owner', $post);

			// Update post details
			$post->update($request->only('caption', 'location', 'tags'));

			// Delete removed files from user
			if (!empty($deletedFiles)) {
				foreach ($deletedFiles as $deletedFileId) {
					$attachment = PostAttachment::where('post_id', $post->id)->where('id', $deletedFileId)->first();
					if ($attachment) {
						Storage::disk('public')->delete($attachment->path);
						$attachment->delete();
					}
				}
			}

			// Upload new files
			if ($request->hasFile('files')) {
				foreach ($request->file('files') as $file) {
					$path = $file->store("attachments/{$request->user()->id}/posts/{$post->id}", 'public');
					$allFilePaths[] = $path;

					PostAttachment::create([
						'post_id' => $post->id,
						'file_name' => $file->getClientOriginalName(),
						'path' => $path,
						'modified' => date("Y-m-d H:i:s", $file->getMTime()),
						'type' => $file->getMimeType(),
						'size' => $file->getSize(),
					]);
				}
			}

			DB::commit();
			return redirect(route('dashboard'))->with('status', 'Post updated successfully');
		} catch (\Exception $e) {
			// If there is an error, delete the uploaded files
			foreach ($allFilePaths as $path) {
				Storage::disk('public')->delete($path);
			}
			DB::rollBack();
			return response()->json([
				'message' => 'Failed to update post',
				'error' => $e->getMessage()
			], 500);
		}
	}

	/**
	 * Display the specified resource.
	 */
	public function show(Request $request, string $username, string $slug)
	{
		$auth = Auth::id();
		$user = User::where('username', $username)->firstOrFail();
		$post = Post::with([
			'user.avatar',
			'attachments',
		])
			->withCount(['likes', 'saves'])
			->withExists([
				'likes as is_liked' => fn($q) => $q->where('user_id', $auth),
				'saves as is_saved' => fn($q) => $q->where('user_id', $auth),
			])
			->where('slug', $slug)
			->where('user_id', $user->id)
			->firstOrFail();

		return Inertia::render('posts/detail-post', [
			'post' => new PostResource($post),
			'user' => new UserResource(
				$request->user()->load(['avatar'])
			),
		]);
	}

	/**
	 * Remove the specified resource from storage.
	 */
	public function destroy(Request $request, $slug)
	{
		$post = Post::where('slug', $slug)->firstOrFail();

		$this->authorize('owner', $post);

		// Delete associated attachments from storage
		if ($post->attachments) {
			foreach ($post->attachments as $attachment) {
				Storage::disk('public')->delete($attachment->path);
			}

			// Delete the attachments folder
			$folderPath = 'attachments/' . $request->user()->id . '/' . $post->id;
			Storage::disk('public')->deleteDirectory($folderPath);
		}

		// Delete the post
		$post->delete();

		return redirect()->route('dashboard')->with('success', 'Post deleted successfully.');
	}
}
