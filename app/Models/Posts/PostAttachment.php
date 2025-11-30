<?php

namespace App\Models\Posts;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class PostAttachment extends Model
{
	protected $fillable = [
		'post_id',
		'file_name',
		'path',
		'type',
		'size',
		'modified',
	];

	public function post(): BelongsTo
	{
		return $this->belongsTo(Post::class);
	}

	protected static function boot()
	{
		parent::boot();

		static::deleted(function (self $model) {
			Storage::disk('public')->delete($model->path);
		});
	}
}
