<?php

namespace App\Http\Resources\Posts;

use App\Http\Resources\Users\UserResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
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
			'slug' => $this->slug,
			'caption' => $this->caption,
			'location' => $this->location,
			'attachments' => PostAttachmentResource::collection($this->whenLoaded('attachments'))->resolve(),
			'user' => new UserResource($this->whenLoaded('user')),
			'tags' => $this->tags,
			'created_at' => $this->created_at,
			'updated_at' => $this->updated_at,
		];
	}
}
