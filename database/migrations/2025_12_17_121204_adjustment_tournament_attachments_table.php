<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
	/**
	 * Run the migrations.
	 */
	public function up(): void
	{
		Schema::table('tournament_attachments', function (Blueprint $table) {

			// Delete field
			if (Schema::hasColumn('tournament_attachments', 'modified')) {
				$table->dropColumn('modified');
			}

			$table->unsignedInteger('size')->change();

			// Type for UI
			$table->enum('type', [
				'banner',
				'thumbnail',
				'gallery',
			])->change();
		});

		// Normalize
		DB::table('tournament_attachments')
			->whereNotIn('type', ['banner', 'thumbnail', 'gallery'])
			->update(['type' => 'gallery']);
	}

	/**
	 * Reverse the migrations.
	 */
	public function down(): void
	{
		Schema::table('tournament_attachments', function (Blueprint $table) {
			$table->string('type')->change();
			$table->integer('size')->change();
			$table->string('modified')->nullable();
		});
	}
};
