<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

Route::get('/api-local/events/{id}/artists', function (string $id) {
    $row = DB::selectOne(
        'SELECT artists FROM events WHERE TRIM(id) = ?',
        [trim($id)]
    );
    $artists = $row ? json_decode($row->artists, true) : [];
    return response()->json($artists ?? []);
});

Route::get('/{any?}', function () {
    return view('app');
})->where('any', '.*');
