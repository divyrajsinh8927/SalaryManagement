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
        Schema::create('salaries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            
            // Required inputs
            $table->decimal('actual_salary', 10, 2);
            $table->integer('total_working_days');
            $table->integer('total_present_days');
            $table->integer('total_absent_days');
            $table->decimal('esic_percent', 5, 2);
            $table->decimal('tax', 10, 2);
            $table->decimal('pf', 10, 2);
            $table->string('month');
            $table->integer('year');
            
            // Nullable calculated fields (logic to be added later)
            $table->decimal('cutoff', 10, 2)->nullable();
            $table->decimal('final_salary', 10, 2)->nullable();
            $table->decimal('esic_money', 10, 2)->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('salaries');
    }
};
