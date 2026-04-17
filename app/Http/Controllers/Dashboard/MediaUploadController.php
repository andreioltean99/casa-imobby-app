<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MediaUploadController extends Controller
{
    public function storeLegalImage(Request $request)
    {
        $data = $request->validate([
            'image' => ['required', 'image', 'max:4096'],
        ]);

        $path = $data['image']->store('legal', 'public');

        return response()->json([
            'url' => Storage::disk('public')->url($path),
        ]);
    }
}

