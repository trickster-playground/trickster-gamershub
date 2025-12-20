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
		Schema::create('tournament_attachments', function (Blueprint $table) {
			$table->id();

			$table->foreignId('tournament_id')->constrained('tournaments')->cascadeOnDelete();
			$table->string('file_name');
			$table->unsignedInteger('size');
			$table->enum('type', ['banner', 'thumbnail', 'gallery']);
			$table->string('path');

			$table->timestamps();
		});
	}

	/**
	 * Reverse the migrations.
	 */
	public function down(): void
	{
		Schema::dropIfExists('tournament_attachments');
	}
};
