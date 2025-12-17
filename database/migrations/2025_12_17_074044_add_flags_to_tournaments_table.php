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
		Schema::table('tournaments', function (Blueprint $table) {
			$table->unsignedBigInteger('prize_pool')->after('description')->nullable();
			$table->enum('mode', ['online', 'lan'])->after('location')->nullable();
			$table->boolean('is_featured')->default(false)->after('status');
			$table->boolean('is_published')->default(false)->after('is_featured');
		});
	}

	/**
	 * Reverse the migrations.
	 */
	public function down(): void
	{
		Schema::table('tournaments', function (Blueprint $table) {
			$table->dropColumn([
				'prize_pool',
				'mode',
				'is_featured',
				'is_published',
			]);
		});
	}
};
