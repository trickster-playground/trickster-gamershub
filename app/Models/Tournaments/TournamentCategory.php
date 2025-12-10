<?php

namespace App\Models\Tournaments;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class TournamentCategory extends Model
{
	use HasFactory;

	protected $fillable = [
		'name',
		'icon',
		'slug',
		'description',
		'color',
	];

	protected static function boot()
	{
		parent::boot();

		static::creating(function ($category) {
			// Generate slug on create
			if (empty($category->slug)) {
				$category->slug = static::generateUniqueSlug($category->name);
			}
		});

		static::updating(function ($category) {
			// Jika name berubah, regenerate slug
			if ($category->isDirty('name')) {
				$category->slug = static::generateUniqueSlug($category->name, $category->id);
			}
		});
	}

	/**
	 * Generate unique slug
	 */
	protected static function generateUniqueSlug($name, $ignoreId = null)
	{
		$baseSlug = Str::slug($name);
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


	public function tournaments()
	{
		return $this->hasMany(Tournament::class, 'tournament_category_id');
	}
}
