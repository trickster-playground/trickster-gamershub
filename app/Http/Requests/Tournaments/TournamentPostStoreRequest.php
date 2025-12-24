<?php

namespace App\Http\Requests\Tournaments;

use Illuminate\Foundation\Http\FormRequest;

class TournamentPostStoreRequest extends FormRequest
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

			'mode' => [
				'required',
				'in:solo,team',
			],

			'format' => [
				'required',
				'in:single_elimination,double_elimination,round_robin,group_stage,swiss',
			],

			'registration_start' => ['required', 'date'],
			'registration_end' => ['required', 'date', 'after_or_equal:registration_start'],
			'start_date' => ['required', 'date'],
			'end_date' => ['required', 'date', 'after_or_equal:start_date'],

			'banner' => ['required', 'image', 'max:5120'],
			'thumbnail' => ['required', 'image', 'max:2048'],

			'status' => [
				'required',
				'in:draft,upcoming,ongoing,finished,cancelled',
			],

			'is_featured' => ['boolean'],
			'is_published' => ['boolean'],
		];
	}
}
