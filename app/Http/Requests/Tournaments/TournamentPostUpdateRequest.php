<?php

namespace App\Http\Requests\Tournaments;

use Illuminate\Foundation\Http\FormRequest;

class TournamentPostUpdateRequest extends FormRequest
{
	/**
	 * Determine if the user is authorized to make this request.
	 */
	public function authorize(): bool
	{
		return true;
	}

	/**
	 * Get the validation rules that apply to the request.
	 *
	 * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
	 */
	public function rules(): array
	{
		return [
			'title' => ['required', 'string', 'max:50'],
			'category_id' => ['required', 'exists:tournament_categories,id'],
			'description' => ['nullable', 'string'],
			'tags' => ['nullable', 'string'],

			'prize_pool' => ['nullable', 'integer', 'min:0'],
			'max_participants' => ['nullable', 'integer', 'min:1'],

			'location' => ['nullable', 'string'],
			'latitude' => ['nullable', 'numeric'],
			'longitude' => ['nullable', 'numeric'],

			'registration_start' => ['required', 'date'],
			'registration_end' => ['required', 'date', 'after_or_equal:registration_start'],
			'start_date' => ['required', 'date'],
			'end_date' => ['required', 'date', 'after_or_equal:start_date'],

			'banner' => ['nullable', 'image', 'max:5120'],
			'thumbnail' => ['nullable', 'image', 'max:2048'],

			'status' => ['required', 'string'],
			'is_featured' => ['boolean'],
			'is_published' => ['boolean'],
		];
	}
}
