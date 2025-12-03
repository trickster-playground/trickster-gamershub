<?php

namespace App\Http\Controllers\Posts;

use App\Http\Controllers\Controller;
use App\Models\Posts\Post;
use App\Models\Posts\PostComment;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;

class PostCommentController extends Controller
{
	use AuthorizesRequests;


	/**
	 * Store a newly created resource in storage.
	 */
	public function store(Request $request): RedirectResponse
	{
		// validate input
		$validated = $request->validate([
			'comment' => 'required|string|max:255|not_regex:/^\s*$/',
			'post_id' => 'required|exists:posts,id',
		]);

		// get the related post
		$post = Post::findOrFail($validated['post_id']);

		// create a new comment via the post's comments relation
		$post->comments()->create([
			'user_id' => $request->user()->id,
			'comment' => $validated['comment'],
		]);

		// redirect back to the previous page
		return back()->with('message', 'Comment added!');
	}

	/**
	 * Update the specified resource in storage.
	 */
	public function update(Request $request, $id): RedirectResponse
	{
		// Get the related comment
		$comment = PostComment::findOrFail($id);

		// Authorize the owner of comment
		$this->authorize('owner', $comment);

		// Validate input user
		$validated = $request->validate([
			'comment' => 'required|string|max:255|not_regex:/^\s*$/',
		]);

		// Update comment
		$comment->update([
			'comment' => $validated['comment'],
		]);

		return back()->with('message', 'Comment updated!');
	}

	/**
	 * Remove the specified resource from storage.
	 */
	public function destroy(Request $request, $id)
	{
		$comment = PostComment::where('id', $id)->firstOrFail();

		$this->authorize('owner', $comment);

		// Delete associated attachments from storage
		// if ($post->attachments) {
		// 	foreach ($post->attachments as $attachment) {
		// 		Storage::disk('public')->delete($attachment->path);
		// 	}

		// 	// Delete the attachments folder
		// 	$folderPath = 'attachments/' . $request->user()->id . '/' . $post->id;
		// 	Storage::disk('public')->deleteDirectory($folderPath);
		// }

		// Delete the post
		$comment->delete();

		return back()->with('message', 'Comment deleted!');
	}
}
