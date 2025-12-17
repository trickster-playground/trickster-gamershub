<?php

namespace App\Http\Resources\Tournaments;

use App\Http\Resources\Users\UserResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TournamentPostResource extends JsonResource
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
			'tournament_category_id' => TournamentCategoryResource::collection($this->whenLoaded('tournament_category_id'))->resolve(),
			'title' => $this->title,
			'slug' => $this->slug,
			'description' => $this->description,
			'location' => $this->location,
			'attachments' => TournamentPostAttachmentResource::collection($this->whenLoaded('attachments'))->resolve(),
			'user' => new UserResource($this->whenLoaded('user')),

			'tags' => $this->tags,

			'status' => $this->status,

			'prize_pool' => $this->prize_pool,
			'mode' => $this->mode,


			'max_participants' => $this->max_participants,

			'registration_start' => $this->registration_start,
			'registration_end' => $this->registration_end,

			'start_date' => $this->start_date,
			'end_date' => $this->end_date,

			'is_featured' => $this->is_featured,
			'is_published' => $this->is_published,

			'created_at' => $this->created_at,
			'updated_at' => $this->updated_at,
		];
	}
}
