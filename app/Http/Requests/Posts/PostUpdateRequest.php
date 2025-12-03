<?php

namespace App\Http\Requests\Posts;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\UploadedFile;
use Illuminate\Validation\Rules\File;
use Illuminate\Support\Facades\Auth;

class PostUpdateRequest extends FormRequest
{
	/**
	 * Determine if the user is authorized to make this request.
	 */
	public function authorize(): bool
	{
		return true;
	}

	public static array $extensions =
	[
		'jpg',
		'png',
		'jpeg',
		'gif',
		'svg',
		'mp3',
		'mp4',
		'webp',
	];

	/**
	 * Get the validation rules that apply to the request.
	 *
	 * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
	 */
	public function rules(): array
	{
		return [
			'caption' => 'nullable|string',
			'tags' => 'nullable|string',
			'location' => 'nullable|string',
			'files' => [
				'nullable',
				'array',
				'max:10',
				function ($attribute, $value, $fail) {
					$totalSize = collect($value)->sum(fn(UploadedFile $file) => $file->getSize());
					$maxSize = 1 * 1024 * 1024 * 1024;
					if ($totalSize > $maxSize) {
						$fail('The total size of the attachments must not exceed 1GB.');
					}
				}
			],
			'files.*' => [
				'file',
				File::types(self::$extensions),
			],
			'user_id' => 'required|exists:users,id',
		];
	}

	protected function prepareForValidation()
	{
		$this->merge([
			'user_id' => Auth::user()->id,
			'caption' => $this->input('caption') ?: '',
			'tags' => $this->input('tags') ?: '',
			'location' => $this->input('location') ?: '',
		]);
	}
}
