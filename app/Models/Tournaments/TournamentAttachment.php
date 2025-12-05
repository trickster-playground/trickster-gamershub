<?php

namespace App\Models\Tournaments;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TournamentAttachment extends Model
{
	use HasFactory;

	protected $fillable = [
		'tournament_id',
		'file_name',
		'size',
		'type',
		'modified',
		'path',
	];

	/** Relation */

	public function tournament()
	{
		return $this->belongsTo(Tournament::class);
	}
}
