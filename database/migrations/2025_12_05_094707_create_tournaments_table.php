<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
	/**
	 * Run the migrations.
	 */
	public function up(): void
	{
		Schema::create('tournaments', function (Blueprint $table) {
			$table->id();

			$table->foreignId('tournament_category_id')
				->constrained('tournament_categories')
				->onDelete('cascade');

			$table->string('title');
			$table->string('slug')->unique();
			$table->text('description')->nullable();

			// Tags (text / JSON)
			$table->string('tags')->nullable();

			// Registration windows
			$table->dateTime('registration_start')->nullable();
			$table->dateTime('registration_end')->nullable();

			// Tournament schedule
			$table->dateTime('start_date')->nullable();
			$table->dateTime('end_date')->nullable();

			// Additional fields
			$table->string('location')->nullable(); // Online / Offline / Address
			$table->integer('max_participants')->nullable();

			// Status
			$table->enum('status', [
				'draft',
				'upcoming',
				'ongoing',
				'finished',
				'cancelled'
			])->default('draft');

			$table->timestamps();
		});
	}

	/**
	 * Reverse the migrations.
	 */
	public function down(): void
	{
		Schema::dropIfExists('tournaments');
	}
};
