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
            // Generate slug automatically
            if (empty($category->slug)) {
                $baseSlug = Str::slug($category->name);
                $slug = $baseSlug;
                $counter = 1;

                // Validate slug is unique
                while (static::where('slug', $slug)->exists()) {
                    $slug = "{$baseSlug}-{$counter}";
                    $counter++;
                }

                $category->slug = $slug;
            }
        });
    }

	public function tournaments()
	{
		return $this->hasMany(Tournament::class, 'tournament_category_id');
	}
}
