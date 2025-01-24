<?php

namespace App\Http\Controllers;

use App\Models\Ceo;
use Illuminate\Http\Request;

class CeoController extends Controller
{
    public function index()
    {
        return Ceo::all();
    }

    public function show($id)
    {
        $ceo = Ceo::find($id);

        if (!$ceo) {
            return response()->json(['message' => 'CEO not found'], 404);
        }

        return $ceo;
    }
}