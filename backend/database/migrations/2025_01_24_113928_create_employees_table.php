<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('avatar')->nullable();
            $table->string('position')->nullable();
            $table->foreignId('chief_id')->nullable()->constrained('employees');
            $table->timestamps();
        });
    }
    
    public function down()
    {
        Schema::dropIfExists('employees');
    }
};
