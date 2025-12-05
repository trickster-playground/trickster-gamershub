<?php

namespace App\Models\Globals;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
	use HasFactory;

	protected $fillable = [
		'name',
		'slug',
	];
}
