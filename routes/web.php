<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


use App\Http\Controllers\Petani\PetaniDashboardController;
use App\Http\Controllers\Petani\LahanController;
use App\Http\Controllers\Petani\PlantingController;
use App\Http\Controllers\Petani\ScanController;
use App\Http\Controllers\Petani\SPK\FertilizerController;
use App\Http\Controllers\Petani\SPK\HarvestController;
use App\Http\Controllers\Petani\SPK\WasteController;


use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\AdminScanController;
use App\Http\Controllers\Admin\AdminSpkController;


use App\Http\Controllers\Admin\Referensi\AdminFertilizerRefController;
use App\Http\Controllers\Admin\Referensi\AdminDiseaseRefController;
use App\Http\Controllers\Admin\Referensi\AdminVarietyRefController;
use App\Http\Controllers\Admin\Referensi\AdminCommodityPriceController;
use App\Http\Controllers\Admin\Referensi\AdminWastePriceRefController;




Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin'       => Route::has('login'),
        'canRegister'    => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion'     => PHP_VERSION,
    ]);
});


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    
    Route::get('/dashboard', function () {
        $role = auth()->user()->role;
        if ($role === 'admin') {
            return redirect()->route('admin.dashboard');
        }
        return redirect()->route('petani.dashboard');
    })->name('dashboard');
});


Route::middleware(['auth', 'role:petani'])
    ->prefix('petani')
    ->name('petani.')
    ->group(function () {
        Route::get('/dashboard', [PetaniDashboardController::class, 'index'])->name('dashboard');

        
        Route::resource('/lahan', LahanController::class);

        
        Route::resource('/tanam', PlantingController::class)
            ->only(['index', 'create', 'store', 'show', 'destroy']);

        
        Route::get('/scan/penyakit', [ScanController::class, 'index'])->name('scan.index');
        Route::get('/scan/penyakit/baru', [ScanController::class, 'create'])->name('scan.create');
        Route::post('/scan/penyakit', [ScanController::class, 'store'])
            ->name('scan.store')
            ->middleware('throttle:20,1');
        Route::get('/scan/penyakit/{scan}', [ScanController::class, 'show'])->name('scan.show');
        Route::delete('/scan/penyakit/{scan}', [ScanController::class, 'destroy'])->name('scan.destroy');

        
        Route::get('/spk/pupuk', [FertilizerController::class, 'create'])->name('spk.pupuk');
        Route::post('/spk/pupuk', [FertilizerController::class, 'store'])->name('spk.pupuk.store');

        
        Route::get('/spk/panen', [HarvestController::class, 'create'])->name('spk.panen');
        Route::post('/spk/panen', [HarvestController::class, 'store'])->name('spk.panen.store');

        
        Route::get('/spk/limbah', [WasteController::class, 'create'])->name('spk.limbah');
        Route::post('/spk/limbah', [WasteController::class, 'store'])->name('spk.limbah.store');
    });


Route::middleware(['auth', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

        
        Route::resource('/users', AdminUserController::class)->only(['index', 'show']);
        Route::patch('/users/{user}/toggle', [AdminUserController::class, 'toggle'])->name('users.toggle');

        
        Route::get('/scan', [AdminScanController::class, 'index'])->name('scan.index');
        Route::get('/scan/export', [AdminScanController::class, 'export'])->name('scan.export');

        
        
        
        Route::resource('/referensi/pupuk', AdminFertilizerRefController::class)
            ->names([
                'index'   => 'referensi.pupuk.index',
                'create'  => 'referensi.pupuk.create',
                'store'   => 'referensi.pupuk.store',
                'show'    => 'referensi.pupuk.show',
                'edit'    => 'referensi.pupuk.edit',
                'update'  => 'referensi.pupuk.update',
                'destroy' => 'referensi.pupuk.destroy',
            ]);
        Route::resource('/referensi/penyakit', AdminDiseaseRefController::class)
            ->names([
                'index'   => 'referensi.penyakit.index',
                'create'  => 'referensi.penyakit.create',
                'store'   => 'referensi.penyakit.store',
                'show'    => 'referensi.penyakit.show',
                'edit'    => 'referensi.penyakit.edit',
                'update'  => 'referensi.penyakit.update',
                'destroy' => 'referensi.penyakit.destroy',
            ]);
        Route::resource('/referensi/varietas', AdminVarietyRefController::class)
            ->names([
                'index'   => 'referensi.varietas.index',
                'create'  => 'referensi.varietas.create',
                'store'   => 'referensi.varietas.store',
                'show'    => 'referensi.varietas.show',
                'edit'    => 'referensi.varietas.edit',
                'update'  => 'referensi.varietas.update',
                'destroy' => 'referensi.varietas.destroy',
            ]);
        Route::resource('/referensi/harga', AdminCommodityPriceController::class)
            ->names([
                'index'   => 'referensi.harga.index',
                'create'  => 'referensi.harga.create',
                'store'   => 'referensi.harga.store',
                'show'    => 'referensi.harga.show',
                'edit'    => 'referensi.harga.edit',
                'update'  => 'referensi.harga.update',
                'destroy' => 'referensi.harga.destroy',
            ]);
        Route::resource('/referensi/limbah', AdminWastePriceRefController::class)
            ->names([
                'index'   => 'referensi.limbah.index',
                'create'  => 'referensi.limbah.create',
                'store'   => 'referensi.limbah.store',
                'show'    => 'referensi.limbah.show',
                'edit'    => 'referensi.limbah.edit',
                'update'  => 'referensi.limbah.update',
                'destroy' => 'referensi.limbah.destroy',
            ]);

        
        Route::get('/spk', [AdminSpkController::class, 'index'])->name('spk.index');
        Route::put('/spk', [AdminSpkController::class, 'update'])->name('spk.update');
        Route::post('/spk/reset', [AdminSpkController::class, 'reset'])->name('spk.reset');
    });

require __DIR__ . '/auth.php';
