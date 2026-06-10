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
        Schema::create('disease_scans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('lahan_id')->nullable()->constrained('lahans')->nullOnDelete();
            $table->string('image_path', 500);
            $table->enum('predicted_class', [
                'bacterial_leaf_blight',
                'brown_spot',
                'leaf_blast',
                'healthy',
            ]);
            $table->decimal('confidence', 5, 4);
            $table->enum('severity', ['mild', 'moderate', 'severe'])->nullable();
            $table->json('raw_response')->nullable();
            $table->text('action_taken')->nullable();
            $table->timestamp('scanned_at')->useCurrent();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('disease_scans');
    }
};
