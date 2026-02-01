<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Asset;
use App\Models\Mockup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class MockupController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()->mockups()->latest()->get();
    }

    public function render(Request $request)
    {
        $request->validate([
            'productId' => 'required|exists:assets,id',
            'layers' => 'required|array',
            'prompt' => 'nullable|string',
            'scenePrompt' => 'nullable|string',
            'lightingStyle' => 'required|string'
        ]);

        $geminiKey = env('API_KEY');
        // Switched to gemini-2.5-flash-image for better availability and free tier support
        $model = 'gemini-2.5-flash-image';

        $productAsset = Asset::findOrFail($request->productId);
        
        $parts = [
            ['inlineData' => [
                'mimeType' => $productAsset->mime_type,
                'data' => explode(',', $productAsset->data)[1]
            ]]
        ];

        $layoutHints = "";
        foreach ($request->layers as $index => $layer) {
            $logoAsset = Asset::findOrFail($layer['assetId']);
            $parts[] = ['inlineData' => [
                'mimeType' => $logoAsset->mime_type,
                'data' => explode(',', $logoAsset->data)[1]
            ]];
            $layoutHints .= "\n- Layer " . ($index + 1) . ": Position ({$layer['x']}%, {$layer['y']}%). Scale: {$layer['scale']}. Rotation: {$layer['rotation']}deg.";
        }

        $systemPrompt = "TASK: Professional Product Mockup Rendering.
        1. Base Product: Image 1.
        2. Overlays: Images 2 to " . (count($request->layers) + 1) . ".
        3. PLACEMENT: {$layoutHints}
        4. STAGING: " . ($request->scenePrompt ?: "Clean studio background") . ".
        5. LIGHTING: Use {$request->lightingStyle} lighting.
        Output ONLY the high-resolution final merged image.";

        $parts[] = ['text' => $systemPrompt];

        $response = Http::post("https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$geminiKey}", [
            'contents' => [['parts' => $parts]],
            'generationConfig' => [
                'responseModalities' => ['IMAGE']
            ]
        ]);

        if ($response->failed()) {
            return response()->json(['error' => 'Rendering failed'], 500);
        }

        $resultParts = $response->json('candidates.0.content.parts');
        $resultB64 = null;
        foreach ($resultParts as $p) {
            if (isset($p['inlineData'])) {
                $resultB64 = $p['inlineData']['data'];
                break;
            }
        }

        $mockup = $request->user()->mockups()->create([
            'image_url' => "data:image/png;base64," . $resultB64,
            'prompt' => $request->prompt,
            'scene_prompt' => $request->scenePrompt,
            'lighting_style' => $request->lightingStyle,
            'metadata' => ['layers' => $request->layers]
        ]);

        return response()->json($mockup);
    }
}
