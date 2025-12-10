<?php

namespace App\Http\Requests\Tournaments;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\File;

class TournamentCategoryStoreRequest extends FormRequest
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
			'name'        => 'required|string|max:50|min:3',
			'description' => 'required|string',
			'color'       => 'required|string',
			'icon'        => [
				'required',
				File::image()->max(2048), // 2MB
			],
		];
	}

	protected function prepareForValidation()
	{
		$this->merge([
			'name'        => $this->name ?? '',
			'description' => $this->description ?? '',
			'color'       => $this->color ?? '',
		]);
	}
}
