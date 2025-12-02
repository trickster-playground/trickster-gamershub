<?php

namespace App\Policies\Posts;

use App\Models\Posts\Post;
use App\Models\User;

class PostPolicy
{
	/**
	 * Policy for post.
	 */
	public function owner(User $user, Post $post): bool
	{
		return $user->id === $post->user_id;
	}
}
