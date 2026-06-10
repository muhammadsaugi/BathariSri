<?php

use App\Services\PadiScanService;

it('menormalisasi kelas FastAPI v2 ke disease_key internal', function () {
    $service = new PadiScanService();

    expect($service->normalizePredictedClass('Bacterial_Blight'))->toBe('bacterial_leaf_blight');
    expect($service->normalizePredictedClass('Blast'))->toBe('leaf_blast');
    expect($service->normalizePredictedClass('Brown_Spot'))->toBe('brown_spot');
    expect($service->normalizePredictedClass('Tungro'))->toBe('tungro');
    expect($service->normalizePredictedClass('Healthy'))->toBe('healthy');
});
