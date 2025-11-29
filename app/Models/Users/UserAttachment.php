<?php

namespace App\Models\Users;

use Illuminate\Database\Eloquent\Model;

class UserAttachment extends Model
{
	protected $fillable = [
		'type',
		'path',
	];
}
