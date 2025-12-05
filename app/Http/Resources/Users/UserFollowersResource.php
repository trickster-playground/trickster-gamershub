<?php

namespace App\Http\Resources\Users;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserFollowersResource extends JsonResource
{
	/**
	 * Transform the resource into an array.
	 *
	 * @return array<string, mixed>
	 */
	public function toArray(Request $request): array
	{
		$loggedInUser = $request->user();

		return [
			'id'       => $this->id,
			'username' => $this->username,
			'name'     => $this->name,
			'avatar' => new UserAvatarResource($this->avatar),

			// Is the logged in user currently following this user?
			'isFollowing' => $loggedInUser
				? $loggedInUser->followings()->where('following_id', $this->id)->exists()
				: false,

			'created_at' => $this->pivot?->created_at,
		];
	}
}
