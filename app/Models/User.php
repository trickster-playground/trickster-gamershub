<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Models\Users\UserAttachment;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

/**
 * Slug vendor imports
 */

use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;
use Illuminate\Support\Str;

class User extends Authenticatable
{
	/** @use HasFactory<\Database\Factories\UserFactory> */
	use HasFactory, Notifiable, TwoFactorAuthenticatable, HasSlug;

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var list<string>
	 */
	protected $fillable = [
		'name',
		'email',
		'username',
		'bio',
		'password',
	];

	/**
	 * The attributes that should be hidden for serialization.
	 *
	 * @var list<string>
	 */
	protected $hidden = [
		'password',
		'two_factor_secret',
		'two_factor_recovery_codes',
		'remember_token',
	];

	/**
	 * Get the attributes that should be cast.
	 *
	 * @return array<string, string>
	 */
	protected function casts(): array
	{
		return [
			'email_verified_at' => 'datetime',
			'password' => 'hashed',
			'two_factor_confirmed_at' => 'datetime',
		];
	}

	public function getSlugOptions(): SlugOptions
	{
		return SlugOptions::create()
			->generateSlugsFrom(function ($model) {
				// Remove spaces and non-alphanumerics, then truncate to 10 characters
				$base = Str::lower(preg_replace('/[^a-zA-Z0-9]/', '', substr($model->name, 0, 16)));

				$suffix = Str::lower(Str::random(3));
				$username = "{$base}-{$suffix}";

				while (User::where('username', $username)->exists()) {
					$suffix = Str::lower(Str::random(3));
					$username = "{$base}-{$suffix}";
				}

				return $username;
			})
			->saveSlugsTo('username')
			->doNotGenerateSlugsOnUpdate();
	}

	public function attachments()
	{
		return $this->hasMany(UserAttachment::class);
	}

	public function avatar()
	{
		return $this->hasOne(UserAttachment::class)->where('type', 'avatar');
	}

	public function background()
	{
		return $this->hasOne(UserAttachment::class)->where('type', 'background');
	}
}
