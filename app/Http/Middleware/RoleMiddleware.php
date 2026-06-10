<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * Memverifikasi role pengguna yang sedang login sebelum mengizinkan akses
     * ke rute terproteksi. Jika role tidak sesuai, kembalikan HTTP 403.
     *
     * @param  string  $role  Role yang dibutuhkan (misalnya 'admin' atau 'petani')
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        if (auth()->user()->role !== $role) {
            abort(403);
        }

        return $next($request);
    }
}
