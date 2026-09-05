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
        Schema::table('users', function (Blueprint $table) {
            $table->string('etime_corp_id')->nullable();
            $table->string('etime_username')->nullable();
            $table->text('etime_password')->nullable(); // Text to hold encrypted string
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['etime_corp_id', 'etime_username', 'etime_password']);
        });
    }
};
