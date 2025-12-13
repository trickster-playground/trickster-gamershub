<?php

namespace App\Http\Controllers\Posts;

use App\Http\Controllers\Controller;
use App\Models\Posts\Post;
use Illuminate\Http\Request;

class PostInteractionController extends Controller
{
	public function likePost(Request $request, $id)
	{
		$post = Post::findOrFail($id);
		$user = $request->user();

		// Check if the user has liked the post
		$like = $post->likes()->where('user_id', $user->id)->first();

		if ($like) {
			// Delete the like if exists
			$like->delete();
			$liked = false;
		} else {
			// Jika belum suka, tambahkan like
			$post->likes()->create(['user_id' => $user->id]);
			$liked = true;
		}

		// Return the updated like status
		return response()->json(['liked' => $liked]);
	}

	public function savePost(Request $request, $id)
	{
		$post = Post::findOrFail($id);
		$user = $request->user();

		// Check if the user has saved the post
		$save = $post->saves()->where('user_id', $user->id)->first();

		if ($save) {
			// If it has been saved, delete it from saved
			$save->delete();
			$saved = false;
		} else {
			// If not saved, add to saved
			$post->saves()->create(['user_id' => $user->id]);
			$saved = true;
		}

		// Return the updated save status
		return response()->json(['saved' => $saved]);
	}
}
