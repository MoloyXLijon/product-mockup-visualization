
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Asset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class AssetController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()->assets()->latest()->get();
    }

    public function generate(Request $request)
    {
        $request->validate([
            'prompt' => 'required|string',
            'type' => 'required|in:logo,product'
        ]);

        $geminiKey = env('API_KEY');
        // Switched to gemini-2.5-flash-image for better availability and free tier support
        $model = 'gemini-2.5-flash-image';
        
        $enhancedPrompt = $request->type === 'logo' 
            ? "Design a modern professional logo: {$request->prompt}. Minimalist, white background, high quality vector style."
            : "Product photography: {$request->prompt}. Studio lighting, clean background, 4k, professional merchandise shot.";

        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
        ])->post("https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$geminiKey}", [
            'contents' => [['parts' => [['text' => $enhancedPrompt]]]],
            'generationConfig' => [
                'responseModalities' => ['IMAGE']
            ]
        ]);

        if ($response->failed()) {
            return response()->json(['error' => 'Gemini AI Generation failed', 'details' => $response->body()], 500);
        }

        $parts = $response->json('candidates.0.content.parts');
        $imageData = null;
        foreach ($parts as $part) {
            if (isset($part['inlineData'])) {
                $imageData = $part['inlineData']['data'];
                break;
            }
        }

        if (!$imageData) {
            return response()->json(['error' => 'No image returned from AI'], 500);
        }

        $asset = $request->user()->assets()->create([
            'id' => (string) Str::uuid(),
            'name' => "AI Generated " . ucfirst($request->type),
            'type' => $request->type,
            'data' => "data:image/png;base64," . $imageData,
            'mime_type' => 'image/png',
            'tags' => ['ai-generated', $request->type]
        ]);

        return response()->json($asset);
    }

    public function destroy(Request $request, $id)
    {
        $asset = $request->user()->assets()->findOrFail($id);
        $asset->delete();
        return response()->json(['success' => true]);
    }
}
