
<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return ['status' => 'Laravel Backend is Running'];
});
