<?php

namespace App\Models\Users;

use Illuminate\Database\Eloquent\Model;

class UserRelation extends Model
{
	protected $fillable = ['follower_id', 'following_id'];
}
