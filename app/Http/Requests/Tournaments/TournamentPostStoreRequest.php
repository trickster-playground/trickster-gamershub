<?php

namespace App\Http\Requests\Tournaments;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

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

			'team_size' => ['required', 'integer', 'min:1'],

			'registration_fee' => ['required', 'integer', 'min:0'],

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

	public function withValidator(Validator $validator): void
	{
		$validator->after(function ($validator) {
			$mode = $this->input('mode');
			$teamSize = (int) $this->input('team_size');

			// Solo rule
			if ($mode === 'solo' && $teamSize !== 1) {
				$validator->errors()->add(
					'team_size',
					'Solo tournament must have exactly 1 player per team.'
				);
			}

			// Team rule
			if ($mode === 'team' && $teamSize < 2) {
				$validator->errors()->add(
					'team_size',
					'Team tournament must have at least 2 players per team.'
				);
			}
		});
	}
}
