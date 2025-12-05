<?php

namespace App\Services;

use App\Models\User;

class UserRelationService
{
	/**
	 * Create a new class instance.
	 */
	public function follow(User $user, User $targetUser)
	{
		if ($user->id === $targetUser->id) {
			return false;
		}

		if ($user->followings()->where('following_id', $targetUser->id)->exists()) {
			return false;
		}

		$user->followings()->attach($targetUser->id);

		return true;
	}

	public function unfollow(User $user, User $targetUser)
	{
		$user->followings()->detach($targetUser->id);
		return true;
	}
}
