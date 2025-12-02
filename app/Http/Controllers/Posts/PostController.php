<?php

namespace App\Http\Controllers\Posts;

use App\Http\Controllers\Controller;
use App\Http\Requests\Posts\PostStoreRequest;
use App\Http\Requests\Posts\PostUpdateRequest;
use App\Http\Resources\Users\UserResource;
use App\Models\Posts\Post;
use App\Models\Posts\PostAttachment;
use Illuminate\Http\Request;
use Inertia\Inertia;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
	/**
	 * Show the form for creating a new post.
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
	 * Store a newly created post in storage.
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

			// Update post data
			$post->update($request->only('caption', 'location', 'tags'));

			// Hapus file yang dihapus user
			if (!empty($deletedFiles)) {
				foreach ($deletedFiles as $deletedFileId) {
					$attachment = PostAttachment::where('post_id', $post->id)->where('id', $deletedFileId)->first();
					if ($attachment) {
						Storage::disk('public')->delete($attachment->path);
						$attachment->delete();
					}
				}
			}

			// Upload file baru
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
			// Jika ada error, hapus file yang sudah terupload
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
}
