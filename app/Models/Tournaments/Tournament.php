<?php

namespace App\Models\Tournaments;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Tournament extends Model
{
	use HasFactory;

	protected $fillable = [
		'title',
		'category_id',
		'description',
		'tags',
		'prize_pool',
		'max_participants',
		'location',
		'latitude',
		'longitude',
		'registration_start',
		'registration_end',
		'start_date',
		'end_date',
		'status',
		'is_featured',
		'is_published',
	];

	protected static function boot()
	{
		parent::boot();

		static::creating(function ($tournament) {
			// Generate slug on create
			if (empty($tournament->slug)) {
				$tournament->slug = static::generateUniqueSlug($tournament->title);
			}
		});

		static::updating(function ($tournament) {
			// Jika name berubah, regenerate slug
			if ($tournament->isDirty('name')) {
				$tournament->slug = static::generateUniqueSlug($tournament->title, $tournament->id);
			}
		});
	}

	/**
	 * Generate unique slug
	 */
	protected static function generateUniqueSlug($title, $ignoreId = null)
	{
		$baseSlug = Str::slug($title);
		$slug = $baseSlug;
		$counter = 1;

		// Uniqueness check but ignore current model ID
		while (
			static::where('slug', $slug)
			->when($ignoreId, fn($query) => $query->where('id', '!=', $ignoreId))
			->exists()
		) {
			$slug = "{$baseSlug}-{$counter}";
			$counter++;
		}

		return $slug;
	}


	public function getRouteKeyName()
	{
		return 'slug';
	}

	/** Relation */

	public function user()
	{
		return $this->belongsTo(User::class);
	}

	public function category()
	{
		return $this->belongsTo(TournamentCategory::class);
	}


	public function attachments()
	{
		return $this->hasMany(TournamentAttachment::class);
	}

	/** Tag Accessors (JSON Helper) */
	public function getTagsListAttribute()
	{
		return $this->tags ? explode(',', $this->tags) : [];
	}

	public function setTagsListAttribute($value)
	{
		$this->attributes['tags'] = implode(',', $value);
	}
}
