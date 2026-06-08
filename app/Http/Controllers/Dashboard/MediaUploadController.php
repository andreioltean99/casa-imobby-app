<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Support\UploadRules;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MediaUploadController extends Controller
{
    public function storeLegalImage(Request $request)
    {
        $data = $request->validate([
            'image' => UploadRules::requiredImage(),
        ]);

        $path = $data['image']->store('legal', 'public');

        return response()->json([
            'url' => Storage::disk('public')->url($path),
        ]);
    }
}

