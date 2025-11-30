<?php

namespace App\Http\Controllers\Posts;

use App\Http\Controllers\Controller;
use App\Http\Requests\Posts\PostStoreRequest;
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
}
