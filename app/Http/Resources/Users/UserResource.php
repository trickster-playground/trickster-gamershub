<?php

namespace App\Http\Resources\Users;

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
	public function toArray(Request $request): array
	{
		return [
			'id' => $this->id,
			'name' => $this->name,
			'email' => $this->email,

			// Avatar & Background Resource
			'avatar' => new UserAvatarResource($this->whenLoaded('avatar')),
			'background' => new UserBackgroundResource($this->whenLoaded('background')),

			// Social Links Resource
			'socialLinks' => UserSocialLinkResource::collection(
				$this->whenLoaded('socialLinks')
			),
		];
	}
}
