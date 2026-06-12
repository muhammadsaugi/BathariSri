<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    
    protected $rootView = 'app';

    
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user()?->only('id', 'name', 'email', 'role', 'avatar'),
            ],
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],

            'has_lahan' => ($request->user()?->role === 'petani')
                ? $request->user()->lahans()->where('is_active', true)->exists()
                : null,
        ];
    }
}
