<?php

namespace App\Http\Resources\Users;

use App\Http\Resources\Posts\PostResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class UserProfileResource extends JsonResource
{
	/**
	 * Transform the resource into an array.
	 *
	 * @return array<string, mixed>
	 */
	public static $wrap = null;

	public function toArray(Request $request): array
	{
		$loggedInUser = $request->user();

		return [
			'id' => $this->id,
			'username' => $this->username,
			'name' => $this->name,
			'bio' => $this->bio,

			// Avatar & Background
			'avatar' => new UserAvatarResource($this->avatar),
			'background' => new UserBackgroundResource($this->background),

			// Social Links Resource
			'socialLinks' => UserSocialLinkResource::collection(
				$this->socialLinks
			),


			// Followers & Following count
			'followersCount' => $this->followers()->count(),
			'followingsCount' => $this->followings()->count(),

			// Is the logged in user currently following this user?
			'isFollowing' => $loggedInUser
				? $loggedInUser->followings()->where('following_id', $this->id)->exists()
				: false,

			// Posts created by this user
			'posts' => PostResource::collection(
				$this->whenLoaded('posts')
			),

			// Posts likes by this user
			'likedPosts' => PostResource::collection(
				$this->whenLoaded('likedPosts')
			),

			// Posts saved by this user
			'savedPosts' => PostResource::collection(
				$this->whenLoaded('savedPosts')
			),
		];
	}
}
