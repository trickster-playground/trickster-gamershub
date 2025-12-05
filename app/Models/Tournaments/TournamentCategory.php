<?php

namespace App\Models\Tournaments;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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

	public function tournaments()
	{
		return $this->hasMany(Tournament::class, 'tournament_category_id');
	}
}
