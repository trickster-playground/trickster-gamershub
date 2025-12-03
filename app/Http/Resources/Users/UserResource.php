<?php

namespace App\Http\Resources\Users;

use App\Http\Resources\Posts\PostResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class UserResource extends JsonResource
{
	/**
	 * Transform the resource into an array.
	 *
	 * @return array<string, mixed>
	 */
	public static $wrap = null;

	public function toArray(Request $request): array
	{
		return [
			'id' => $this->id,
			'name' => $this->name,
			'email' => $this->email,
			'username' => $this->username,

			// Avatar & Background Resource
			'avatar' => new UserAvatarResource($this->whenLoaded('avatar')),
			'background' => new UserBackgroundResource($this->whenLoaded('background')),

			// Social Links Resource
			'socialLinks' => UserSocialLinkResource::collection(
				$this->whenLoaded('socialLinks')
			),

			'posts' => PostResource::collection($this->whenLoaded('posts')),
			'likedPosts' => PostResource::collection($this->whenLoaded('likedPosts')), // Menambahkan likedPosts
			'savedPosts' => PostResource::collection($this->whenLoaded('savedPosts')),  // Menambahkan savedPosts
		];
	}
}
