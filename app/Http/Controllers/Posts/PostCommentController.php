<?php

namespace App\Http\Controllers\Posts;

use App\Http\Controllers\Controller;
use App\Models\Posts\Post;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;

class PostCommentController extends Controller
{
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
}
