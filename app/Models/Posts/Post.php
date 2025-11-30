<?php

namespace App\Models\Posts;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

use Hidehalo\Nanoid\Client;

class Post extends Model
{
	protected $fillable = [
		'caption',
		'slug',
		'user_id',
		'tags',
		'location',
	];

	protected static function boot()
	{
		parent::boot();

		static::creating(function ($post) {
			// Use NanoID to create random ID for post
			$client = new Client();
			$randomId = $client->generateId(10); // 10 character alphanumeric

			// Create slug from random ID
			$slug = $randomId;

			// Make sure the slug is unique
			while (Post::where('slug', $slug)->exists()) {
				$randomId = $client->generateId(10);
				$slug = $randomId;
			}

			$post->slug = $slug;
		});
	}

	public function user(): BelongsTo
	{
		return $this->belongsTo(User::class);
	}

	public function getRouteKeyName()
	{
		return 'slug';
	}

	public function attachments(): HasMany
	{
		return $this->hasMany(PostAttachment::class);
	}

	public function likes(): HasMany
	{
		return $this->hasMany(PostLike::class);
	}

	public function saves(): HasMany
	{
		return $this->hasMany(PostSave::class);
	}
}
