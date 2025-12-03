<?php

namespace App\Policies\Posts;

use App\Models\Posts\PostComment;
use App\Models\User;

class PostCommentPolicy
{
	/**
	 * Policy for comment.
	 */
	public function owner(User $user, PostComment $comment): bool
	{
		return $user->id === $comment->user_id;
	}
}
