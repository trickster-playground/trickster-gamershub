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

				$table->foreignId('category_id')
					->constrained('tournament_categories')
					->cascadeOnDelete();


				$table->string('title');
				$table->string('slug')->unique();
				$table->text('description')->nullable();
				$table->unsignedBigInteger('prize_pool')->nullable();

				// Tags (text / JSON)
				$table->string('tags')->nullable();

				// Registration windows
				$table->dateTime('registration_start')->nullable();
				$table->dateTime('registration_end')->nullable();

				// Tournament schedule
				$table->dateTime('start_date')->nullable();
				$table->dateTime('end_date')->nullable();

				// Additional fields
				$table->string('location')->nullable();
				$table->decimal('latitude', 10, 7)->nullable();
				$table->decimal('longitude', 10, 7)->nullable();

				$table->integer('max_participants')->nullable();

				// Status
				$table->enum('status', [
					'draft',
					'upcoming',
					'ongoing',
					'finished',
					'cancelled'
				])->default('draft');

				$table->boolean('is_featured')->default(false);
				$table->boolean('is_published')->default(false);

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
