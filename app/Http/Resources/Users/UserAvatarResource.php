<?php

namespace App\Http\Resources\Users;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class UserAvatarResource extends JsonResource
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
			'path' => $this->path ? url(Storage::url($this->path)) : null,
		];
	}
}
