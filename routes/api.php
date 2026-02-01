
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AssetController;
use App\Http\Controllers\Api\MockupController;
use App\Http\Controllers\Api\AuthController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Assets
    Route::get('/assets', [AssetController.class, 'index']);
    Route::post('/assets/generate', [AssetController.class, 'generate']);
    
    // Mockups
    Route::get('/mockups', [MockupController.class, 'index']);
    Route::post('/mockups/render', [MockupController.class, 'render']);
});
