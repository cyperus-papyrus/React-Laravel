<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ceo extends Model
{
    use HasFactory;

    protected $table = 'ceo';
    protected $fillable = ['name', 'position', 'avatar'];
}