<?php

namespace App\Models\Posts;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class PostComment extends Model
{
	protected $fillable = [
		'user_id',
		'post_id',
		'comment',
	];

	public function user()
	{
		return $this->belongsTo(User::class);
	}

	public function post()
	{
		return $this->belongsTo(Post::class);
	}
}
