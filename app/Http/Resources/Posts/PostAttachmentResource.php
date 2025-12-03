<?php

namespace App\Http\Resources\Posts;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class PostAttachmentResource extends JsonResource
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
			'file_name' => $this->file_name,
			'path' => $this->path ? url(Storage::url($this->path)) : null,
			'type' => $this->type,
			'modified' => $this->modified,
			'size' => $this->size,
			'created_at' => $this->created_at,
			'updated_at' => $this->updated_at,
		];
	}
}
