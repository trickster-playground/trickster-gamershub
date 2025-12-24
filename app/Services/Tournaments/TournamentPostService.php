<?php

namespace App\Services\Tournaments;

use App\Models\Tournaments\Tournament;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class TournamentPostService
{
	public function store(array $data, Request $request): Tournament
	{
		return DB::transaction(function () use ($data, $request) {
			$data['user_id'] = Auth::id();
			$tournament = Tournament::create($this->filter($data));
			$this->handleFiles($tournament, $request);
			return $tournament;
		});
	}

	public function update(
		Tournament $tournament,
		array $data,
		Request $request
	): Tournament {
		return DB::transaction(function () use ($tournament, $data, $request) {
			$tournament->update($this->filter($data));
			$this->handleFiles($tournament, $request);
			return $tournament;
		});
	}

	protected function handleFiles(Tournament $tournament, Request $request): void
	{
		foreach (['banner', 'thumbnail'] as $type) {
			if ($request->hasFile($type)) {
				$this->syncAttachment(
					$tournament,
					$request->file($type),
					$type
				);
			}
		}
	}

	protected function syncAttachment(
		Tournament $tournament,
		UploadedFile $file,
		string $type
	): void {
		$oldAttachment = $tournament->attachments()
			->where('type', $type)
			->first();

		if ($oldAttachment) {
			Storage::disk('public')->delete($oldAttachment->path);
			$oldAttachment->delete();
		}

		$path = $file->store(
			"tournaments/posts/{$tournament->id}/{$type}",
			'public'
		);

		$tournament->attachments()->create([
			'file_name' => $file->getClientOriginalName(),
			'size' => $file->getSize(),
			'type' => $type,
			'path' => $path,
		]);
	}

	protected function filter(array $data): array
	{
		return collect($data)
			->except(['banner', 'thumbnail'])
			->toArray();
	}
}
