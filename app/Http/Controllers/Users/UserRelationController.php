<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\UserRelationService;
use Illuminate\Http\Request;

class UserRelationController extends Controller
{
	protected $UserRelationService;

	public function __construct(UserRelationService $userRelationService)
	{
		$this->UserRelationService = $userRelationService;
	}

	public function follow(Request $request, $id)
	{
		$targetUser = User::findOrFail($id);
		$this->UserRelationService->follow($request->user(), $targetUser);

		return back()->with('message', 'Followed!');
	}

	public function unfollow(Request $request, $id)
	{
		$targetUser = User::findOrFail($id);
		$this->UserRelationService->unfollow($request->user(), $targetUser);

		return back()->with('message', 'Unfollowed!');
	}

	/**
	 * List followers
	 */
	public function followers(User $user)
	{
		return response()->json([
			'followers' => $user->followers()->with('avatar')->get(),
		]);
	}

	/**
	 * List following
	 */
	public function followings(User $user)
	{
		return response()->json([
			'followings' => $user->followings()->with('avatar')->get(),
		]);
	}
}
