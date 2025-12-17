<?php

namespace App\Models\Tournaments;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tournament extends Model
{
	use HasFactory;

	protected $fillable = [
		'tournament_category_id',
		'title',
		'slug',
		'description',
		'tags',
		'registration_start',
		'registration_end',
		'start_date',
		'end_date',
		'location',
		'max_participants',
		'status',
	];

	/** Relation */

	public function user()
	{
		return $this->belongsTo(User::class);
	}

	public function category()
	{
		return $this->belongsTo(TournamentCategory::class, 'tournament_category_id');
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
